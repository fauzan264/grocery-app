"use client";
import { OrderStatus } from "@/features/orders/type";
import UploadPayment from "@/features/orders/UploadPayment";
import { getOrderDetail } from "@/services/order";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/userOrderStore";
import { formatDateWithTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderDetail() {
    const { id } = useParams();

    const { currentOrder, setCurrentOrder } = useOrderStore();
    const { token } = useAuthStore();

    const normalizedStatus = normalizeOrderStatus(currentOrder?.status ?? "");

    // Fetch order & polling tiap 30 detik
    useEffect(() => {
        if (!id || !token) return;

        const fetchOrder = async () => {
            const order = await getOrderDetail(id as string, token);
            setCurrentOrder(order);
            console.log(order);
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 30000);
        return () => clearInterval(interval);
    }, [id, token, setCurrentOrder]);

    if (!currentOrder) return <div>Loading...</div>;

    const isWaitingForPayment =
        normalizedStatus === OrderStatus.WAITING_FOR_PAYMENT;
    const isCancelled = normalizedStatus === OrderStatus.CANCELLED;
    const isWaitingConfirmation =
        normalizedStatus === OrderStatus.WAITING_CONFIRMATION_PAYMENT;
    const isInProcess = normalizedStatus === OrderStatus.IN_PROCESS;

    const refreshOrder = async () => {
        if (token) {
            const updatedOrder = await getOrderDetail(id as string, token);
            setCurrentOrder(updatedOrder);
        }
    };

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
                    <span className="font-semibold">Shipment</span>

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

                    {isWaitingForPayment ? (
                        <>
                            <UploadPayment onSuccess={refreshOrder} />

                            <button
                                className="font-semibold py-2 px-4 rounded-md w-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
                                disabled={!isWaitingForPayment}
                            >
                                Cancel Order
                            </button>
                        </>
                    ) : isCancelled ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md text-center font-medium">
                            Order has been canceled due to unpaid after 1 hour.
                        </div>
                    ) : isWaitingConfirmation ? (
                        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md text-center font-medium">
                            Waiting for payment confirmation by admin.
                        </div>
                    ) : isInProcess ? (
                        <div className="p-4 bg-blue-100 text-blue-700 rounded-md text-center font-medium">
                            Payment confirmed. Your order is being processed.
                        </div>
                    ) : null}
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
