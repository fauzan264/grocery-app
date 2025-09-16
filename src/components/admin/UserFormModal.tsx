"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import UploadField from "./UploadField";
import { uploadFileToServer } from "../../app/lib/upload";
import { useCreateUser, useUpdateUser, useUserForm } from "../../app/hooks/useUsers";
import { InferType } from "yup";

export const schema = yup.object({
  id: yup.string().optional(),
  full_name: yup
    .string()
    .required("Nama lengkap diperlukan")
    .max(100),
  email: yup
    .string()
    .email("Email tidak valid")
    .required("Email diperlukan"),
  date_of_birth: yup
    .date()
    .nullable()
    .notRequired(),   
  phone_number: yup
    .string()
    .nullable()
    .matches(/^[0-9+ -]{6,15}$/, "Nomor telepon tidak valid")
    .notRequired(),   
  user_role: yup
    .string()
    .oneOf(["ADMIN_STORE", "CUSTOMER", "SUPER_ADMIN"])
    .required("Role diperlukan"),
  password: yup
    .string()
    .when("user_role", {
      is: (val: string) => val === "ADMIN_STORE",
      then: (s) => s.required("Password diperlukan untuk ADMIN_STORE").min(6),
      otherwise: (s) => s.notRequired(), 
    }),
}).required();

export type FormValues = InferType<typeof schema>;

export default function UserFormModal({
  onClose,
  defaultValues,
  mode = "create",
}: {
  onClose: () => void;
  defaultValues?: Partial<FormValues>;
  mode?: "create" | "edit";
}) {
  const { register, handleSubmit, reset, setValue, formState:{ errors, isSubmitting } } = useUserForm();

  const [file, setFile] = useState<File | undefined>();
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as any);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (vals: FormValues) => {
    try {
      // upload file if exists
      let photoUrl: string | null = null;
      if (file) {
        const uploaded = await uploadFileToServer(file);
        photoUrl = uploaded.url;
      }
      const payload: Record<string, unknown> = {
        fullName: vals.full_name,
        email: vals.email,
        dateOfBirth: vals.date_of_birth || null,
        phoneNumber: vals.phone_number || null,
        userRole: vals.user_role,
        password: vals.password || null,
        photoProfile: photoUrl
      };

      if (mode === "create") {
        await createMut.mutateAsync(payload);
      } else {
        // defaultValues must include id
        await updateMut.mutateAsync({ id: defaultValues?.id as string, payload });
      }

      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan, cek console.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded p-6 w-[720px] max-w-full">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{ mode === "create" ? "Buat User" : "Edit User" }</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Nama Lengkap</label>
            <input {...register("full_name")} className="w-full p-2 border rounded mt-1" />
            <div className="text-red-500 text-xs">{ errors.full_name?.message as any }</div>
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input {...register("email")} className="w-full p-2 border rounded mt-1" />
            <div className="text-red-500 text-xs">{ errors.email?.message as any }</div>
          </div>

          <div>
            <label className="block text-sm">Phone</label>
            <input {...register("phone_number")} className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm">Tanggal Lahir</label>
            <input type="date" {...register("date_of_birth")} className="w-full p-2 border rounded mt-1" />
          </div>

          <div>
            <label className="block text-sm">Role</label>
            <select {...register("user_role")} className="w-full p-2 border rounded mt-1">
              <option value="ADMIN_STORE">ADMIN_STORE</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input type="password" {...register("password")} className="w-full p-2 border rounded mt-1" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm">Foto Profil</label>
            <UploadField onChange={(f)=>setFile(f)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Batal</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-emerald-200">Simpan</button>
        </div>
      </form>
    </div>
  );
}
