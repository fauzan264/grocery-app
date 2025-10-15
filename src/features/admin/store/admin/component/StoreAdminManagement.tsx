"use client";
import { IPagination } from "@/app/types/pagination";
import { deleteStoreAdmin, getStoreAdmins } from "@/services/store";
import camelcaseKeys from "camelcase-keys";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IStore } from "../../types";
import _ from "lodash";
import AddStoreAdminModal from "./AddStoreAdminModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";

export default function StoreAdminManagement({
  store,
  token,
}: {
  store: IStore;
  token: string;
}) {
  const [storeAdmins, setStoreAdmins] = useState<
    { user: { id: string; full_name: string } }[]
  >([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    full_name: string;
  } | null>(null);

  const fetchAdmins = useMemo(
    () =>
      _.debounce(async (searchValue: string, pageValue: number) => {
        if (!store?.id) return;
        try {
          setIsLoading(true);
          const res = await getStoreAdmins({
            id: store.id,
            name: searchValue,
            page: pageValue,
            limit: 10,
            token,
          });

          if (res.data.success) {
            setStoreAdmins(res.data.data.store_admins);
            setPagination(camelcaseKeys(res.data.data.pagination));
          }
        } catch (error) {
          toast.error(String(error));
        } finally {
          setIsLoading(false);
        }
      }, 1000),
    [store?.id, token]
  );

  const handleDeleteClick = ({
    user,
  }: {
    user: { id: string; full_name: string };
  }) => {
    setSelectedItem(user);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedItem) return;
      setIsDeleting(true);
      const response = await deleteStoreAdmin({
        id: store.id!,
        userId: selectedItem.id,
        token,
      });

      toast.success(response.data.message);
      await fetchAdmins(search, page);

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
    fetchAdmins(search, page);
  }, [search, page, fetchAdmins]);

  const handleRefresh = () => {
    setPage(1);
    setSearch("");
    fetchAdmins("", 1);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 py-2 justify-between items-start md:items-center">
        <AddStoreAdminModal
          id={store.id!}
          token={token}
          onSuccess={handleRefresh}
        />
        <input
          type="text"
          placeholder="Search name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full md:w-48"
        />
      </div>

      <div className="overflow-x-auto flex-1 pt-4">
        <table className="table border-gray-100">
          <thead className="text-slate-900">
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {isLoading ? (
              <tr key={0}>
                <td colSpan={2} className="text-center py-8">
                  <span className="loading loading-spinner"></span>
                </td>
              </tr>
            ) : storeAdmins.length > 0 ? (
              storeAdmins.map((admin) => (
                <tr key={admin.user.id}>
                  <td>{admin.user.full_name}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-red-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                      onClick={() => {
                        handleDeleteClick({ user: admin.user });
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={0}>
                <td colSpan={2} className="text-center">
                  No store admin found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex gap-2 justify-center py-4 border-t border-slate-200">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn btn-sm"
          >
            Prev
          </button>
          <span className="flex items-center">
            Page {pagination.currentPage} of {pagination.totalPage}
          </span>
          <button
            disabled={page === pagination.totalPage}
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={selectedItem?.full_name}
        isLoading={isDeleting}
      />
    </>
  );
}
