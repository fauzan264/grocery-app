"use client";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import OrderActivitySidebar from "@/features/admin/orders/OrderActivities";
import OrderDetail from "@/features/admin/orders/OrderDetail";
import { useParams } from "next/navigation";
import React, { use } from "react";

export default function OrderDetailPage() {
    const {orderId} = useParams()

    if (!orderId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );
    }
    return (
        <>
            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 min-h-screen">
                <div className="md:col-span-3 space-y-6">
                    <OrderDetail orderId={orderId as string} />
                </div>

                <div className="md:col-span-1 space-y-6">
                    <OrderActivitySidebar />
                </div>
            </div>
        </>
    );
}
