import Image from "next/image";
import { IStore } from "../types";

export default function StoreDetail({ store }: { store: IStore }) {
  return (
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
          <p className="text-sm font-semibold text-slate-900">{store.name}</p>
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
          <p className="text-sm font-semibold text-slate-900">{store.status}</p>
        </div>
      </div>
    </div>
  );
}
