import Image from "next/image";
import Link from "next/link";
import { IStore } from "../types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import camelcaseKeys from "camelcase-keys";
import { IPagination } from "@/app/types/pagination";
import { getStoreAdmins } from "@/services/store";

export default function StoreTabs({
  store,
  token,
  userId,
}: {
  store?: IStore;
  token: string;
  userId: string;
}) {
  const [storeAdmins, setStoreAdmins] = useState<
    { user: { full_name: string } }[]
  >([]);
  const [pagination, setPagination] = useState<IPagination | null>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debounceFetch = useMemo(
    () =>
      _.debounce(async (searchValue: string, pageValue: number) => {
        if (!store?.id) return;
        try {
          const response = await getStoreAdmins({
            id: store?.id,
            name: searchValue || "",
            page: pageValue,
            limit: 10,
            token,
          });

          if (response.data.success) {
            setStoreAdmins(response.data.data.store_admins);
            setPagination(camelcaseKeys(response.data.data.pagination));
          }
        } catch (error: unknown) {
          toast.error(String(error));
        }
      }, 1000),
    [store?.id, token]
  );

  useEffect(() => {
    if (!store?.id) return;
    debounceFetch(search, page);
  }, [search, page, debounceFetch]);

  if (!store) {
    return <div>No Store data available.</div>;
  }

  return (
    <div className="tabs tabs-box bg-slate-50 py-5 shadow-md rounded-md h-full">
      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Store"
        defaultChecked
      />
      <div className="tab-content bg-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-full md:col-span-1">
            <div className="col-span-full md:col-span-1 flex flex-col items-start space-y-4 md:pr-6  pb-6 md:pb-0 border-b md:border-b-0">
              <div className="relative mx-auto md:mx-0">
                <figure className="w-59 h-59 block relative rounded-3xl overflow-hidden shadow-md">
                  {store?.logo && (
                    <Image
                      src={String(store?.logo)}
                      alt={`${store?.logo} image`}
                      fill
                      className="object-cover"
                    />
                  )}
                </figure>
              </div>
            </div>
          </div>
          <div className="col-span-full md:col-span-3 space-y-4">
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm font-medium text-slate-500">Name</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.name}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm font-medium text-slate-500">Description</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.description}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm font-medium text-slate-500">Province</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.province?.name}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">City</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.city?.name}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">District</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.district?.name}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">Address</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.address}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">Status</p>
              <p className="text-sm font-semibold text-slate-900">
                {store.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Store Admin"
      />
      <div className="tab-content bg-slate-100 p-6 flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row gap-4 py-2 justify-center md:justify-between items-start md:items-center">
          <Link
            href={`/admin/profile/address/create`}
            className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md border-0"
          >
            Add Store Admin
          </Link>

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
              {storeAdmins?.length > 0 ? (
                storeAdmins?.map((admin, i) => (
                  <tr key={i}>
                    <td>{admin.user.full_name}</td>
                    <td>
                      <Link
                        href="#"
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center">
                    No store admin found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {pagination && (
          <div className="flex bottom-0 gap-2 justify-center py-4 border-t border-slate-200 mt-auto">
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
      </div>
    </div>
  );
}
