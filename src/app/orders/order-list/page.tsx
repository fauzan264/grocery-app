"use client";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/userOrderStore";
import { getUsersOrderList } from "@/services/order";
import OrderListCard from "@/features/orders/OrderListCard";
import useAuthStore from "@/store/useAuthStore";

export default function OrderListPage() {
    const { token } = useAuthStore();
    const { orders, setOrders } = useOrderStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getUsersOrderList(token);
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }
        if (token) fetchOrders();
    }, [token, setOrders]);

    if (!token) return <div className="p-4">Please login to view your orders.</div>;
    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="flex flex-col gap-4 mt-15 max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order List</h1>

            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                orders.map((order) => <OrderListCard key={order.id} order={order} />)
            )}
        </div>
    );
}
