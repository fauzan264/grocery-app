"use client";

import { useState } from "react";
import Image from "next/image";
import { PaymentMethod } from "@/features/orders/type";

interface PaymentProofModalProps {
    src?: string;
    alt?: string;
    paymentMethod?: PaymentMethod;
}

export default function PaymentProofModal({
    src,
    alt = "Payment Proof",
    paymentMethod,
}: PaymentProofModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    
    if (!src || paymentMethod === PaymentMethod.SNAP) {
        return null;
    }

    return (
        <div className="mb-4 flex items-center space-x-2 gap-5">
            <span className="text-gray-500 font-medium">Payment Proof :</span>
            <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={() => setIsOpen(true)}
            >
                View Payment Proof
            </button>
            <button
                className="btn btn-sm btn-success"
                onClick={() => console.log("Approve Payment clicked")}
            >
                Approve Payment
            </button>
            {/* Modal */}
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
        </div>
    );
}
