"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cancelOrderAdmin, sendOrderAdmin } from "@/services/order-admin";
import useAuthStore from "@/store/useAuthStore";
import ConfirmModal from "./confirmToast";
import { toast } from "react-toastify";
import { OrderStatus } from "@/features/orders/type";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";

interface OrderActionBarProps {
    orderId: string;
    status: OrderStatus;
    onAction?: (action: "cancel" | "deliver") => void;
}

export default function OrderActionBar({
    orderId,
    status,
    onAction,
}: OrderActionBarProps) {
    const { token } = useAuthStore();
    const [confirmOpen, setConfirmOpen] = useState<
        null | "cancel" | "delivered"
    >(null);

    const orderStatus = normalizeOrderStatus(status);

    const isDisabled =
        orderStatus === OrderStatus.DELIVERED ||
        orderStatus === OrderStatus.CANCELLED ||
        orderStatus === OrderStatus.ORDER_CONFIRMATION;

    const handleCancel = async () => {
        if (!orderId || !token) return;

        try {
            const res = await cancelOrderAdmin(orderId, token);
            toast.success(res.message);
            onAction?.("cancel");
        } catch (error) {
            toast.error("Fail to cancel order");
            console.error("Cancel order failed:", error);
        }
    };

    const handleDeliver = async () => {
        if (!orderId || !token) return;
        try {
            const res = await sendOrderAdmin(orderId, token);
            toast.success(res?.message || "Order delivered");
            onAction?.("deliver");
        } catch (error) {
            toast.error("Fail to deliver order");
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Reminder Box */}
            <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 mt-3">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                Make sure you have prepared all items before delivering the
                order
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => {
                        if (isDisabled) return 
                        setConfirmOpen("cancel");
                    }}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-md transition-colors
    ${
        isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-100 text-red-700 hover:bg-red-200"
    }`}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        if (isDisabled) return 
                        setConfirmOpen("cancel");
                    }}
                    className={`px-4 py-2 rounded-md transition-colors
    ${
        isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
    }`}
                >
                    Deliver
                </button>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={!!confirmOpen}
                onClose={() => setConfirmOpen(null)}
                onConfirm={
                    confirmOpen === "cancel" ? handleCancel : handleDeliver
                }
                title={
                    confirmOpen === "cancel"
                        ? "Are you sure you want to cancel this order?"
                        : "Are you sure to deliver this order to customer"
                }
                confirmText={
                    confirmOpen === "cancel" ? "Cancel Order" : "Mark Delivered"
                }
                cancelText="Close"
                variant={confirmOpen ?? "cancel"}
            />
        </div>
    );
}
