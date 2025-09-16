import StoreListComponent from "@/features/admin/store/components/StoreListComponent";
import Link from "next/link";

export default function StorePage() {
  return (
    <div className="mx-auto w-11/12 my-10">
      <div className="flex">
        <h1 className="text-2xl text-gray-700">Store Management</h1>
        <Link
          href={"/admin/store/create"}
          className="btn btn-sm ml-auto bg-amber-400 text-white text-sm rounded-md hover:bg-amber-500 active:bg-amber-500 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0"
        >
          Create Store
        </Link>
      </div>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl">
        <div className="card-body">
          <StoreListComponent />
        </div>
      </div>
    </div>
  );
}
