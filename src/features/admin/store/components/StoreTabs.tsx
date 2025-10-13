import { IStore } from "../types";
import StoreAdminManagement from "../admin/component/StoreAdminManagement";
import StoreDetail from "./StoreDetail";

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
    <div className="tabs tabs-box bg-slate-50 py-5 shadow-md rounded-md h-full">
      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Store"
        defaultChecked
      />
      <div className="tab-content bg-slate-100 p-6">
        <StoreDetail store={store} />
      </div>

      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Store Admin"
      />
      <div className="tab-content bg-slate-100 p-6 flex flex-col min-h-screen">
        <StoreAdminManagement store={store} token={token} />
      </div>
    </div>
  );
}
