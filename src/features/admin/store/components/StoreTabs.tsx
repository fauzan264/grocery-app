import Image from "next/image";
import Link from "next/link";
import { IStore } from "../types";

export default function StoreTabs({
  store,
  token,
  userId,
}: {
  store?: IStore;
  token: string;
  userId: string;
}) {
  if (!store) {
    return <div>No Store data available.</div>;
  }

  return (
    <div className="tabs tabs-box bg-slate-50 py-5 shadow-md rounded-md h-10/12">
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
      <div className="tab-content bg-slate-100 p-6">
        <div className="flex py-2 justify-center md:justify-end">
          <div className="flex flex-col md:flex-row gap-2 w-4/5 md:w-auto">
            <Link
              href={`/admin/profile/address/create`}
              className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md border-0 transition duration-300"
            >
              Add Store Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
