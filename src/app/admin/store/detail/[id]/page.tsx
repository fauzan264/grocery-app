"use client";
import { ErrorResponse } from "@/components/error/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import StoreTabs from "@/features/admin/store/components/StoreTabs";
import { IStore } from "@/features/admin/store/types";
import { getStoreById } from "@/services/store";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DetailStorePage() {
  const { token, id } = useAuthStore();
  const params = useParams<{ id: string }>();
  const [store, setStore] = useState<IStore | undefined>(undefined);

  const onGetStore = async ({ id, token }: { id: string; token: string }) => {
    try {
      const response = await getStoreById({ id, token });
      setStore(response.data.data);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      onGetStore({ id: params.id, token });
    }
  }, [token]);
  return (
    <>
      <div className="mx-auto py-10 w-11/12 min-h-full">
        <Breadcrumbs />
        <h1 className="text-2xl text-gray-700">Store Management</h1>
        <StoreTabs store={store} token={token} />
      </div>
    </>
  );
}
