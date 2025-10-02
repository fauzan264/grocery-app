"use client";
import { useState, useEffect, useCallback } from "react";
import { useOrderStore } from "@/store/userOrderStore";
import { getUsersOrderList } from "@/services/order";
import OrderListCard from "@/features/orders/OrderListCard";
import useAuthStore from "@/store/useAuthStore";
import OrderFilterBar, { FilterValues } from "@/features/orders/OrderFilterBar";
import LoadingThreeDotsPulse from "@/components/ui/loading";

export default function OrderListPage() {
    const { token } = useAuthStore();
    const { orders, setOrders } = useOrderStore();
    const [loading, setLoading] = useState(true);

    // Filter state diterapkan ke API
    const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

    // Tangani filter dari child
    const handleApplyFilter = useCallback((filters: FilterValues) => {
        setAppliedFilters(filters);
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await getUsersOrderList(token, appliedFilters);
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, appliedFilters, setOrders]);

    if (!token)
        return <div className="p-4">Please login to view your orders.</div>;
    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );

    return (
        <div className="flex flex-col gap-4 mt-15 w-full max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>
            <OrderFilterBar onApply={handleApplyFilter} />
            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                orders.map((order) => (
                    <OrderListCard key={order.id} order={order} />
                ))
            )}
        </div>
    );
}
