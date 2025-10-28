"use client";
import { IPagination } from "@/app/types/pagination";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import { IStore } from "../types";
import { deleteStore, getStores } from "@/services/store";
import camelcaseKeys from "camelcase-keys";
import { toast } from "react-toastify";
import _ from "lodash";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/Pagination";
import DeleteModal from "@/components/modals/DeleteModal";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";

export default function StoreListTable() {
  const router = useRouter();
  const { token } = useAuthStore();
  const auth = useAuthStore();
  const [stores, setStores] =
    useState<Pick<IStore, "id" | "name" | "city" | "province">[]>();
  const [pagination, setPagination] = useState<IPagination | null>();
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const provinceId = searchParams.get("province_id");
  const search = searchParams.get("search");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const debounceFetch = useMemo(
    () =>
      _.debounce(
        async (
          searchValue: string | null,
          provinceId: string | null,
          pageValue: number,
          token: string
        ) => {
          try {
            const response = await getStores({
              name: searchValue || "",
              provinceId: Number(provinceId) || 0,
              page: pageValue,
              limit: 8,
              token,
            });

            if (response.data.success) {
              setStores(response.data.data.stores);
              setPagination(camelcaseKeys(response.data.data.pagination));
            }
          } catch (error: unknown) {
            toast.error(String(error));
          }
        },
        100
      ),
    [getStores, setStores, setPagination, toast, camelcaseKeys]
  );

  const handleDeleteClick = ({
    store,
  }: {
    store: { id: string; name: string };
  }) => {
    setSelectedItem(store);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedItem) return;
      setIsDeleting(true);
      const response = await deleteStore({
        id: selectedItem.id,
        token,
      });

      toast.success(response.data.message);
      await debounceFetch(search, provinceId, page, auth.token);

      setIsDeleting(false);
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    setPage(pageFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (auth.token) {
      debounceFetch(search, provinceId, page, auth.token);

      return () => debounceFetch.cancel();
    }
  }, [search, provinceId, page, debounceFetch, auth.token]);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Stores</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Province</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((store) => (
              <tr
                key={store.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{store.name}</td>
                <td className="px-4 py-3">{store.province!.name}</td>
                <td className="px-4 py-3">{store.city!.name}</td>
                <td className="px-4 py-3 flex space-x-2 justify-center">
                  <Link
                    href={`/admin/store/detail/${store.id}`}
                    className="btn btn-sm bg-emerald-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/admin/store/edit/${store.id}`}
                    className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm bg-red-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                    onClick={() => {
                      if (store.id && store.name) {
                        handleDeleteClick({
                          store: {
                            id: store.id as string,
                            name: store.name as string,
                          },
                        });
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stores?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No stores found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={
          pagination?.currentPage ? Number(pagination?.currentPage) : 1
        }
        totalPages={pagination?.totalPage ? Number(pagination?.totalPage) : 1}
        onPageChange={(page) => {
          setPage(page);
          const params = new URLSearchParams(searchParams);
          params.set("page", String(page));
          router.push(`?${params.toString()}`);
        }}
      />
      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
