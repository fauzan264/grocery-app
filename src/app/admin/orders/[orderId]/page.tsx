"use client";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import Breadcrumbs from "@/features/admin/orders/BreadCrumbs";
import OrderActivitySidebar from "@/features/admin/orders/OrderActivities";
import OrderDetail from "@/features/admin/orders/OrderDetail";
import { IOrderAdminResponse, IStatusLogs } from "@/features/admin/orders/type";
import { getOrderDetailAdmin, getStatusLogs } from "@/services/order-admin";
import useAuthStore from "@/store/useAuthStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const { token } = useAuthStore();
    const [order, setOrder] = useState<IOrderAdminResponse | null>(null);
    const [logs, setLogs] = useState<IStatusLogs[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch + refresh

    const refreshOrder = async () => {
        if (!orderId || !token) return;
        setLoading(true);
        try {
            const response = await getOrderDetailAdmin(
                orderId as string,
                token
            );
            console.log("✅ Order detail response:", response);
            setOrder(response);

            const logsData = await getStatusLogs(orderId as string, token);
            setLogs(logsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to get order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshOrder();
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Order not found.</p>
            </div>
        );
    }

    return (
        <>
            <div className=" min-h-screen max-w-8xl mx-auto p-6">
                <div className="mb-8">
                    <Breadcrumbs/>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Orders Detail
                    </h1>
                </div>
                <div className=" grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 min-h-screen">
                    <div className="md:col-span-3 space-y-6">
                        <OrderDetail
                            order={order}
                            refreshOrder={refreshOrder}
                        />
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <OrderActivitySidebar order={order} logs={logs} />
                    </div>
                </div>
            </div>
        </>
    );
}
