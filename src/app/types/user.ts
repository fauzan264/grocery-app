import * as yup from "yup";
export type UserRole = 'SUPER_ADMIN' | 'ADMIN_STORE' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string | null;
  user_role: UserRole;
  status: UserStatus;
  photo_profile?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface FormValues {
  id?: string; // hanya dipakai di mode edit
  full_name: string;
  email: string;
  date_of_birth?: Date | null; // opsional
  phone_number?: string | null;
  user_role: "ADMIN_STORE" | "CUSTOMER" | "SUPER_ADMIN";
  password?: string; // opsional di edit, required di create
}

/**
 * Yup Schema untuk validasi form user
 * Mode bisa dikasih context: { mode: "create" | "edit" }
 */
export const userSchema = yup.object({
  full_name: yup
    .string()
    .required("Nama wajib diisi"),
  email: yup
    .string()
    .email("Email tidak valid")
    .required("Email wajib diisi"),
  date_of_birth: yup
    .date()
    .nullable()
    .optional(),
  phone_number: yup
    .string()
    .nullable()
    .optional(),
  user_role: yup
    .mixed<"ADMIN_STORE" | "CUSTOMER" | "SUPER_ADMIN">()
    .oneOf(["ADMIN_STORE", "CUSTOMER", "SUPER_ADMIN"])
    .required("Role wajib dipilih"),
  password: yup.string().when("$mode", {
    is: "create",
    then: (schema) =>
      schema.required("Password wajib diisi").min(6, "Minimal 6 karakter"),
    otherwise: (schema) => schema.optional(),
  }),
});
