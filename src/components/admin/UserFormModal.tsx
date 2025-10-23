"use client";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { uploadFileToServer } from "../../lib/upload";
import {
  useCreateUser,
  useUpdateUser,
  useUserForm,
} from "../../app/hooks/useUsers";
import { InferType } from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "../error/types";

export const schema = yup
  .object({
    id: yup.string().optional(),
    full_name: yup.string().required("Nama lengkap diperlukan").max(100),
    email: yup.string().email("Email tidak valid").required("Email diperlukan"),
    date_of_birth: yup.date().nullable().notRequired(),
    phone_number: yup
      .string()
      .nullable()
      .matches(/^[0-9+ -]{6,15}$/, "Nomor telepon tidak valid")
      .notRequired(),
    user_role: yup
      .string()
      .oneOf(["ADMIN_STORE", "CUSTOMER", "SUPER_ADMIN"])
      .required("Role diperlukan"),
    password: yup.string().when("user_role", {
      is: (val: string) => val === "ADMIN_STORE",
      then: (s) => s.required("Password diperlukan untuk ADMIN_STORE").min(6),
      otherwise: (s) => s.notRequired(),
    }),
  })
  .required();

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useUserForm();

  const [file, setFile] = useState<File | undefined>();
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as FormValues);
    }
  }, [defaultValues, reset]);

  const { role: currentRole } = useAuthStore();
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  const onSubmit = async (vals: FormValues) => {
    try {
      let finalRole = vals.user_role;
      if (!isSuperAdmin) {
        finalRole = "CUSTOMER";
      }
      // upload file if exists
      let photoUrl: string | null = null;
      if (file) {
        const uploaded = await uploadFileToServer(file);
        photoUrl = uploaded.url;
      }
      const payload = {
        fullName: vals.full_name,
        email: vals.email,
        dateOfBirth: vals.date_of_birth || null,
        phoneNumber: vals.phone_number || null,
        userRole: finalRole,
        password: vals.password || null,
        photoProfile: photoUrl,
      };

      if (mode === "create") {
        await createMut.mutateAsync(payload);
        toast.success("User created");
      } else {
        // defaultValues must include id
        await updateMut.mutateAsync({
          id: defaultValues?.id ?? "",
          payload,
        });
        toast.success("User updated");
      }

      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-lg p-6 w-[720px] max-w-full"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {mode === "create" ? "Buat User" : "Edit User"}
        </h3>

        {/* Grid 2 kolom */}
        <div className="grid grid-cols-2 gap-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              {...register("full_name")}
              className="w-full p-2.5 border border-gray-300 rounded-md mt-1 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Masukkan nama lengkap"
            />
            {errors.full_name?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              className="w-full p-2.5 border border-gray-300 rounded-md mt-1 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Masukkan email"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              {...register("phone_number")}
              className="w-full p-2.5 border border-gray-300 rounded-md mt-1 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Nomor telepon"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Lahir
            </label>
            <input
              type="date"
              {...register("date_of_birth")}
              className="w-full p-2.5 rounded-md mt-1 
                      text-gray-900 
                      bg-gray-50 border border-gray-400 
                      focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                      placeholder-gray-500
                      [color-scheme:light]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            {isSuperAdmin ? (
              <select
                {...register("user_role")}
                className="w-full p-2.5 border border-gray-300 rounded-md mt-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="ADMIN_STORE">Store Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            ) : (
              <input
                value="CUSTOMER"
                disabled
                className="w-full p-2.5 border border-gray-200 rounded-md mt-1 bg-gray-100 text-gray-600"
              />
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full p-2.5 border border-gray-300 rounded-md mt-1 
                        text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Foto Profil full width */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Profil
            </label>

            <div className="flex items-center gap-4">
              {/* Preview photo */}
              <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
                {file ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              {/* Upload button dengan feedback */}
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md shadow cursor-pointer hover:bg-emerald-600 active:scale-95 transition-transform duration-150">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  Pilih Foto
                </label>
                <p className="text-xs text-gray-500">PNG, JPG maksimal 1MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-md bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:bg-emerald-300"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
