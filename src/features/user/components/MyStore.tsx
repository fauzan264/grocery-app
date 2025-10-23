import { IStore } from "@/features/admin/store/types";
import { getMyStore } from "@/services/user";
import { useEffect, useState } from "react";

export default function MyStore({ token }: { token: string }) {
  const [store, setStore] = useState<IStore>();

  const onGetMyStore = async ({ token }: { token: string }) => {
    try {
      const response = await getMyStore({ token });
      setStore(response.data.data.store);
    } catch {}
  };

  useEffect(() => {
    if (token) {
      onGetMyStore({ token });
    }
  }, [token]);

  return (
    <>
      <div className="flex my-2 justify-center md:justify-end">
        <div className="flex flex-col md:flex-row gap-2 w-4/5 md:w-auto"></div>
      </div>
      <div className="col-span-full md:col-span-3 space-y-4">
        <div className="pb-2 border-b-2 border-slate-200">
          <p className="text-sm font-medium text-slate-500">Name</p>
          <p className="text-sm font-semibold text-slate-900">{store?.name}</p>
        </div>
        <div className="pb-2 border-b-2 border-slate-200">
          <p className="text-sm-font-medium text-slate-500">Province</p>
          <p className="text-sm font-semibold text-slate-900">
            {store?.province?.name}
          </p>
        </div>
        <div className="pb-2 border-b-2 border-slate-200">
          <p className="text-sm-font-medium text-slate-500">City</p>
          <p className="text-sm font-semibold text-slate-900">
            {store?.city?.name}
          </p>
        </div>
        <div className="pb-2 border-b-2 border-slate-200">
          <p className="text-sm-font-medium text-slate-500">District</p>
          <p className="text-sm font-semibold text-slate-900">
            {store?.district?.name}
          </p>
        </div>
        <div className="pb-2 border-b-2 border-slate-200">
          <p className="text-sm-font-medium text-slate-500">Address</p>
          <p className="text-sm font-semibold text-slate-900">
            {store?.address}
          </p>
        </div>
      </div>
    </>
  );
}
