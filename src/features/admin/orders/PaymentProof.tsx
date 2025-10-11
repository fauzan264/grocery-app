"use client";

import { useState } from "react";
import Image from "next/image";
import { PaymentMethod, OrderStatus } from "@/features/orders/type";
import useAuthStore from "@/store/useAuthStore";
import { approvePayment, declinePayment } from "@/services/order-admin";
import { toast } from "react-toastify";
import ConfirmModal from "./confirmToast";

interface PaymentProofModalProps {
    src?: string;
    alt?: string;
    paymentMethod?: PaymentMethod;
    orderId: string;
    status: OrderStatus;
    onAction?: (action: "approve" | "decline") => void;
}

export default function PaymentProofModal({
    src,
    alt = "Payment Proof",
    paymentMethod,
    orderId,
    status,
    onAction
}: PaymentProofModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState<
        null | "approve" | "decline"
    >(null);
    const { token } = useAuthStore();

    if (!src || paymentMethod === PaymentMethod.SNAP) {
        return null;
    }

    const onHandleApprove = async () => {
        try {
            const res = await approvePayment(orderId, token);
            toast.success("Payment Approved Successfully");
            setConfirmOpen(null);
            onAction?.("approve");
        } catch (error) {
            toast.error("Fail to Approve Payment");
            console.log(error);
        }
    };

    const onHandleDecline = async () => {
        try {
            const res = await declinePayment(orderId, token);
            toast.success("Payment Declined Successfully");
            setConfirmOpen(null);
            onAction?.("decline")
        } catch (error) {
            toast.error("Fail to Decline Payment");
            console.log(error);
        }
    };

    const isWaitingConfirmation =
        status === OrderStatus.WAITING_CONFIRMATION_PAYMENT;

    return (
        <div className="mb-4 flex items-center space-x-2 gap-5">
            <span className="text-gray-500 font-medium">Payment Proof :</span>

            <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={() => setIsOpen(true)}
            >
                View Payment Proof
            </button>

            {/* ⬅️ tombol hanya muncul kalau masih menunggu konfirmasi */}
            {isWaitingConfirmation && (
                <>
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => setConfirmOpen("approve")}
                    >
                        Approve Payment
                    </button>
                    <button
                        className="btn btn-sm btn-error"
                        onClick={() => setConfirmOpen("decline")}
                    >
                        Decline Payment
                    </button>
                </>
            )}

            {/* Modal Bukti Transfer */}
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-4xl max-h-[80vh] relative p-0 overflow-hidden">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                        <div className="relative max-w-4xl aspect-[4/3]">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                style={{ objectFit: "contain" }}
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}

            <ConfirmModal
                isOpen={!!confirmOpen}
                onClose={() => setConfirmOpen(null)}
                onConfirm={
                    confirmOpen === "approve"
                        ? onHandleApprove
                        : onHandleDecline
                }
                title={
                    confirmOpen === "approve"
                        ? "Are you sure to approve this payment?"
                        : "Are you sure to decline this payment?"
                }
                confirmText={confirmOpen === "approve" ? "Approve" : "Decline"}
                cancelText="Cancel"
                variant={confirmOpen ?? "approve"}
            />
        </div>
    );
}
