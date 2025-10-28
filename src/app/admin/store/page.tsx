"use client";
import StoreListTable from "@/features/admin/store/components/StoreList";
import { IStoreProvince } from "@/features/admin/store/types";
import AuthGuard from "@/hoc/AuthGuard";
import { getProvinces } from "@/services/shipping";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function StorePage() {
  const [provinces, setProvinces] = useState<IStoreProvince[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedProvince, setSelectedProvince] = useState("");
  const onGetProvince = async () => {
    const response = await getProvinces();
    setProvinces(response.data.data);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvince(value);

    const params = new URLSearchParams(searchParams.toString() ?? "");
    if (value) {
      params.set("province_id", value);
    } else {
      params.delete("province_id");
    }
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString() ?? "");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const searchByProvince = searchParams.get("province_id") || "";
    setSelectedProvince(searchByProvince);
  }, [searchParams]);

  useEffect(() => {
    onGetProvince();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Store Management
            </h1>
          </div>
          {/* Filter by Store */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search store..."
                onChange={handleSearch}
                className="w-full sm:w-64 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <select
                id="storeFilter"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full sm:w-48 border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                router.push("/admin/store/create");
              }}
              className="btn btn-md w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Create Store
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section>
          <Suspense fallback={<div>Loading...</div>}>
            <StoreListTable />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

export default AuthGuard(StorePage, ["SUPER_ADMIN"]);
