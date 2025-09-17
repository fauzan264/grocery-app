import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { IUser } from "../types/user";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../components/admin/UserFormModal";
import { InferType } from "yup";

/**
 * Response bentuk paginated dari backend
 */
export interface IPagedUsers {
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  data: IUser[];
}

// infer type langsung dari yup schema — single source of truth
export type FormValues = InferType<typeof schema>;


export const useUserForm = () => {
  // default values: partial dulu
  const defaultValues: Partial<FormValues> = {
    full_name: "",
    email: "",
    date_of_birth: null,
    phone_number: null,
    user_role: "CUSTOMER" as FormValues["user_role"],
    password: "",
  };

  return useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues>,
    defaultValues,
  });
};

/**
 * Hook: ambil daftar user (paginated)
 * - page, limit, q, role disertakan di queryKey supaya cache per parameter
 */
export const useUsers = (page = 1, limit = 10, q?: string, role?: string) => {
  return useQuery<IPagedUsers, Error>({
    queryKey: ["users", page, limit, q, role],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (q) params.q = q;
      if (role) params.role = role;

      const res = await api.get<{
        success: boolean;
        message?: string;
        data: IPagedUsers;
      }>("/api/users", { params });

      return res.data.data;
    },
    placeholderData: (prev) => prev,
  });
};

/**
 * Hook: create user
 * - typed: returns IUser on success, accepts Record payload
 */
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation<IUser, Error, Record<string, unknown>>({
    mutationFn: async (payload) => {
      const res = await api.post<{
        success: boolean;
        message?: string;
        data: IUser;
      }>("/api/users", payload);

      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook: update user
 * - accepts object { id, payload }
 */
export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<IUser, Error, { id: string; payload: Record<string, unknown> }>({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put<{ success: boolean; data: IUser }>(
        `/api/users/${id}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook: delete user
 * - accepts user id (string)
 */
export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/api/users/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
