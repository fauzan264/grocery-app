"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderListTable from "@/features/admin/orders/OrderListTable";
import useAuthStore from "@/store/useAuthStore";
import { getStores } from "@/services/store";
import toast from "react-hot-toast";
import Breadcrumbs from "@/features/admin/orders/BreadCrumbs";

interface Store {
    id: string;
    name: string;
}

export default function OrderManagement() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token, role } = useAuthStore();

    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    const storeNameParam = searchParams.get("store") || "all";

    useEffect(() => {
        if (!token || role !== "SUPER_ADMIN") return;
        const fetchStores = async () => {
            try {
                setLoading(true);
                const response = await getStores({
                    page: 1,
                    limit: 50,
                    name: "",
                    provinceId: undefined,
                    token: token || "",
                });

                const storeList = response?.data?.data?.stores || [];

                const formattedStores = [
                    { id: "all", name: "All Stores" },
                    ...storeList.map((store: Store) => ({
                        id: store.id,
                        name: store.name,
                    })),
                ];

                setStores(formattedStores);
            } catch (err) {
                console.error("Failed to fetch stores:", err);
                toast.error("Failed to load stores. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStores();
    }, [token, role]);

    const getStoreIdFromName = (storeName: string): string => {
        if (storeName === "all" || storeName === "All Stores") return "all";

        const store = stores.find(
            (s) => s.name.toLowerCase() === storeName.toLowerCase()
        );
        return store?.id || "all";
    };

    const currentStoreId = getStoreIdFromName(storeNameParam);
    const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStoreName = e.target.value;

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        if (selectedStoreName === "All Stores") {
            params.delete("store");
        } else {
            params.set("store", selectedStoreName);
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Breadcrumbs/>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Orders Management
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Monitor and manage all customer orders efficiently.
                        </p>
                    </div>

                    {/* 🔹 Filter by Store */}
                    {role === "SUPER_ADMIN" && (
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="storeFilter"
                                className="text-sm font-medium text-gray-700"
                            >
                                Filter by Store:
                            </label>

                            {loading ? (
                                <p className="text-sm text-gray-500">
                                    Loading...
                                </p>
                            ) : (
                                <select
                                    id="storeFilter"
                                    className="select select-bordered select-sm w-full max-w-xs"
                                    value={
                                        storeNameParam === "all"
                                            ? "All Stores"
                                            : storeNameParam
                                    }
                                    onChange={handleStoreChange}
                                >
                                    {stores.map((store) => (
                                        <option
                                            key={store.id}
                                            value={store.name}
                                        >
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                </header>

                {/* 🔹 Main Content */}
                <section>
                    <OrderListTable storeId={currentStoreId} />
                </section>
            </div>
        </div>
    );
}
