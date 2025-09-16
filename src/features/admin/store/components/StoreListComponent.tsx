"use client";
import Link from "next/link";
import { IStore } from "../types";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import { getStores } from "@/services/store";
import _ from "lodash";
import { IPagination } from "@/app/types/pagination";
import { toast } from "react-toastify";
import camelcaseKeys from "camelcase-keys";

export default function StoreListComponent() {
  const auth = useAuthStore();
  const [stores, setStores] =
    useState<Pick<IStore, "id" | "name" | "city" | "province">[]>();
  const [pagination, setPagination] = useState<IPagination | null>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debounceFetch = useMemo(
    () =>
      _.debounce(async (searchValue: string, pageValue: number, token) => {
        try {
          const response = await getStores({
            name: searchValue || "",
            page: pageValue,
            limit: 10,
            token,
          });

          if (response.data.success) {
            setStores(response.data.data.stores);
            setPagination(camelcaseKeys(response.data.data.pagination));
          }
        } catch (error: unknown) {
          toast.error(String(error));
        }
      }, 100),
    []
  );

  useEffect(() => {
    if (auth.token) {
      debounceFetch(search, page, auth.token);

      return () => debounceFetch.cancel();
    }
  }, [search, page, debounceFetch, auth.token]);
  return (
    <>
      <input
        type="text"
        placeholder="Search store..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="input input-bordered input-accent md:ml-auto my-3"
      />
      <div className="overflow-x-auto">
        <table className="table border-gray-100">
          <thead className="text-slate-900">
            <tr>
              <th>Name</th>
              <th>Province</th>
              <th>City</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {stores?.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.province}</td>
                <td>{store.city}</td>
                <td className="flex space-x-2">
                  <Link
                    href={`admin/store/detail/${store.id}`}
                    className="btn btn-sm bg-emerald-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`admin/store/edit/${store.id}`}
                    className="btn btn-sm bg-amber-400 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`admin/store/delete/${store.id}`}
                    className="btn btn-sm bg-red-500 text-white hover:shadow-md m-1 px-3 py-1 text-sm rounded-md"
                  >
                    Delete
                  </Link>
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

      {/* pagination */}
      {pagination && (
        <div className="flex gap-2 mt-4 mx-auto">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn btn-sm"
          >
            Prev
          </button>
          <span>
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
    </>
  );
}
