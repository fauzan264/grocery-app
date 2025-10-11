"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cancelOrderAdmin } from "@/services/order-admin";
import useAuthStore from "@/store/useAuthStore";
import ConfirmModal from "./confirmToast";


interface OrderActionBarProps {
    orderId: string;
    onAction?: (action: "cancel" | "deliver") => void; 
}

export default function OrderActionBar({
    orderId,
    onAction,
}: OrderActionBarProps) {
    const { token } = useAuthStore();
    const [confirmOpen, setConfirmOpen] = useState<null | "cancel" | "delivered">(null);

    const handleCancel = async () => {
        if (!orderId || !token) return;

        try {
            await cancelOrderAdmin(orderId, token);
            onAction?.("cancel"); 
        } catch (error) {
            console.error("Cancel order failed:", error);
        }
    };

    const handleDeliver = () => {
        onAction?.("deliver"); 
    };

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Reminder Box */}
            <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 flex-1">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                Make sure you have prepared all items before delivering the order
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={() => setConfirmOpen("cancel")}
                    className="px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                >
                    Cancel
                </button>
                <button
                    onClick={() => setConfirmOpen("delivered")}
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
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
                confirmText={confirmOpen === "cancel" ? "Cancel Order" : "Mark Delivered"}
                cancelText="Close"
                variant={confirmOpen ?? "cancel"}
            />
        </div>
    );
}
