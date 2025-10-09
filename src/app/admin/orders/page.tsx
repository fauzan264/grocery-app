"use client";

import { useState } from "react";
import OrderListTable from "@/features/admin/orders/OrderListTable";

export default function OrderManagement() {
  // Simulasi store list (dummy)
  const stores = [
    { id: "all", name: "All Stores" },
    { id: "store-1", name: "Toko Maju Jaya" },
    { id: "store-2", name: "Dapur Sejahtera" },
    { id: "store-3", name: "Elektronik Nusantara" },
  ];

  const [selectedStore, setSelectedStore] = useState("all");

  // Event handler
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Orders Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and manage all customer orders efficiently.
            </p>
          </div>

          {/* Filter by Store */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="storeFilter"
              className="text-sm font-medium text-gray-700"
            >
              Filter by Store:
            </label>
            <select
              id="storeFilter"
              value={selectedStore}
              onChange={handleStoreChange}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Main Content */}
        <section className="bg-white shadow rounded-lg p-6">
          <OrderListTable />
        </section>
      </div>
    </div>
  );
}
