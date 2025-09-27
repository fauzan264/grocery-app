"use client";
import { OrderStatus } from "@/features/orders/type";
import UploadPayment from "@/features/orders/UploadPayment";
import { getOrderDetail } from "@/services/order";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/userOrderStore";
import { formatDateWithTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderDetail() {
    const { id } = useParams();
    const { currentOrder, setCurrentOrder } = useOrderStore();
    const { token } = useAuthStore();
    console.log("Token from store:", token);
    useEffect(() => {
        if (!currentOrder && token) {
            (async () => {
                const order = await getOrderDetail(id as string, token);
                setCurrentOrder(order);
            })();
        }
        console.log("Fetching order ID:", id);
    }, [id, currentOrder, setCurrentOrder, token]);

    if (!currentOrder) return <div>Loading...</div>;
    return (
        <div className="min-h-screen bg-gray-50 mx-auto mt-15 p-6 max-w-lg">
            <h1 className="font-bold text-xl mb-4">Order Detail</h1>

            <div className="grid grid-cols-1 gap-4">
                <Section>
                    <span className="font-bold">
                        Order Status: {currentOrder.status}
                    </span>
                    <div className="flex justify-between">
                        <span>Order ID</span>
                        <span>{currentOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Order Date</span>
                        <span>
                            {formatDateWithTime(currentOrder?.createdAt)}
                        </span>
                    </div>
                </Section>

                <Section>
                    <span className="font-semibold">Detail Produk</span>
                    {/* ... */}
                </Section>

                <Section>
                    <span className="font-semibold">Info Pengiriman</span>

                    <div className="grid grid-cols-[120px_20px_1fr] gap-y-2">
                        <span>Kurir</span>
                        <span>:</span>
                        <span>Kargo</span>

                        <span>Tracking Number</span>
                        <span>:</span>
                        <span>123456789</span>

                        <span>Address</span>
                        <span>:</span>
                        <div className="flex flex-col">
                            <span>{currentOrder.user?.receiverName}</span>
                            <span>{currentOrder.user?.receiverNumber}</span>
                            <span>{currentOrder.user?.shippingAddress}</span>
                        </div>
                    </div>
                </Section>
                <Section>
                    <h1 className="font-bold">Payment Detail</h1>
                    <div className="flex justify-between border-b border-dashed pb-2 mb-2">
                        <span>Payment Method</span>
                        <span>{currentOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>{formatPrice(currentOrder.sub_total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipment Cost</span>
                        <span>Rp.xxx</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed pb-2 mb-2">
                        <span>Discount</span>
                        <span>- ({formatPrice(currentOrder.discount)})</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total Order</span>
                        <span>{formatPrice(currentOrder.finalPrice)}</span>
                    </div>
                    <UploadPayment />
                    <button
                        className={`font-semibold py-2 px-4 rounded-md w-full transition
                            ${
                                OrderStatus.WAITING_FOR_PAYMENT 
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                            }`}
                        disabled={currentOrder.status !== OrderStatus.WAITING_FOR_PAYMENT}
                    >
                        Cancel Order
                    </button>
                </Section>
            </div>
        </div>
    );
}

function Section({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-white p-4 rounded-md shadow space-y-2">
            {children}
        </div>
    );
}
