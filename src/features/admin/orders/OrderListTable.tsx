"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getStoreOrderList } from "@/services/order-admin";
import useAuthStore from "@/store/useAuthStore";
import { IOrderAdminResponse } from "./type";
import { formatPrice } from "@/utils/formatPrice";
import OrderStatusBadge from "@/features/orders/OrderStatusBedge";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import Pagination from "@/features/orders/Pagination";

export default function OrderListTable({ storeId }: { storeId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token } = useAuthStore();

    const [orders, setOrders] = useState<IOrderAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const currentPage = Number(searchParams.get("page")) || 1;
    const storeNameParam = searchParams.get("store");

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        if (storeNameParam) {
            params.set("store", storeNameParam);
        } else {
            params.delete("store");
        }

        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await getStoreOrderList(token, {
                    page: currentPage,
                    limit: 10,
                    storeId: storeId === "all" ? undefined : storeId,
                });
                setOrders(res.data || []);
                setTotalPages(res.meta?.totalPages || 1);
                setTotalOrders(res.meta?.total || 0);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, currentPage, storeId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-6 text-gray-500 text-center">No orders found</div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Orders Found : {totalOrders}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Order ID</th>
                            <th className="px-4 py-3 text-left">Store</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Created At</th>
                            <th className="px-4 py-3 text-left">
                                Payment Method
                            </th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.orderId}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">#{order.orderId}</td>
                                <td className="px-4 py-3">
                                    {order.store?.name}
                                </td>
                                <td className="px-4 py-3">
                                    {order?.customer?.fullName || "-"}
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-3">
                                    {order.paymentMethod}
                                </td>
                                <td className="px-4 py-3">
                                    <OrderStatusBadge
                                        status={normalizeOrderStatus(
                                            order.status
                                        )}
                                    />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {formatPrice(order.finalPrice)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/admin/orders/${order.orderId}`
                                            )
                                        }
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:opacity-90 transition"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔹 Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
