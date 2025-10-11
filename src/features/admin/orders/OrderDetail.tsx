import useAuthStore from "@/store/useAuthStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IOrderAdminResponse } from "./type";
import { getOrderDetailAdmin } from "@/services/order-admin";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import OrderStatusBadge from "@/features/orders/OrderStatusBedge";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import { formatDateWithTime } from "@/utils/formatDate";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/formatPrice";
import { OrderStatus } from "@/features/orders/type";
import { getPaymentStatus } from "@/utils/PaymentStatusAdmin";
import PaymentProof from "./PaymentProof";
import OrderActionBar from "./OrderAction";

export default function OrderDetail({ orderId }: { orderId: string }) {
    const { token } = useAuthStore();
    const [order, setOrder] = useState<IOrderAdminResponse | null>(null);
    const [actionTriggered, setActionTriggered] = useState<
        "cancel" | "deliver" | "approve" | "decline" | null
    >(null);
    const [loading, setLoading] = useState(true);
    const paymentStatus = getPaymentStatus(
        order?.status ?? OrderStatus.WAITING_FOR_PAYMENT
    );

    useEffect(() => {
        const onGetOrderDetail = async () => {
            if (!orderId && !token) return;
            try {
                const response = await getOrderDetailAdmin(orderId, token);
                setOrder(response);
            } catch (error) {
                console.error("Failed to fetch order detail:", error);
                toast.error("Failed to get order. Please Try Again.");
            } finally {
                setLoading(false);
            }
        };
        onGetOrderDetail();
    }, [orderId, token]);

    useEffect(() => {
        if (!actionTriggered) return;

        const refreshOrder = async () => {
            setLoading(true);
            try {
                const response = await getOrderDetailAdmin(orderId, token);
                setOrder(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setActionTriggered(null);
            }
        };

        refreshOrder();
    }, [actionTriggered, orderId, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );
    }
    if (!order && !loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Order not found.</p>
            </div>
        );
    }

    return (
        <>
            {/* 1. Order ID & Status Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-lg text-gray-800">
                        Order ID {order?.orderId}
                    </p>
                    <span>
                        <OrderStatusBadge
                            status={normalizeOrderStatus(order?.status ?? "-")}
                        />
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                    {formatDateWithTime(order?.createdAt ?? "-")}
                </p>
                <OrderActionBar
                    orderId={orderId}
                    onAction={(action) => setActionTriggered(action)}
                />
            </div>

            {/* 2. Products and Summary Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                        Products
                    </h3>
                </div>

                {/* Contoh Product Item 1 */}
                {order?.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-4 mb-4 pb-4 border-gray-100 last:border-b-0 last:mb-0 last:pb-0"
                    >
                        <Image
                            src={item.imageUrl || "/placeholder.png"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />
                        <div className="flex-grow">
                            <p className="font-medium text-gray-700">
                                {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                        <p className="font-semibold text-gray-700">
                            {formatPrice(item?.subTotal ?? "0")}
                        </p>
                    </div>
                ))}

                {/* Ringkasan Harga */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(order?.totalPrice ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                        <span>Discount</span>
                        <span>- {formatPrice(order?.discount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipment cost</span>
                        <span className="text-green-600">
                            {formatPrice(order?.discount ?? 0)}
                        </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-gray-800">
                        <span>Grand total</span>
                        <span>{formatPrice(order?.finalPrice ?? 0)}</span>
                    </div>
                </div>
            </div>

            {/* 3. Customer Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                        Customer details
                    </h3>
                </div>

                {/* Grid 2 kolom untuk detail pelanggan */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
                    <div>
                        <span className="text-gray-500">Name</span>:{" "}
                        <span className="font-medium">
                            {order?.customer.fullName}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Mobile</span>:
                        {order?.customer.phoneNumber}
                    </div>
                    <div>
                        <span className="text-gray-500">Email</span>:
                        {order?.customer.email}
                    </div>
                    <div>
                        <span className="text-gray-500">Address</span>: -
                    </div>
                    <div>
                        <span className="text-gray-500">Payment</span>:{" "}
                        {order?.paymentMethod}
                    </div>
                    <div>
                        <span className="text-gray-500">Status</span>:{" "}
                        <span className="text-green-600 font-medium">
                            {paymentStatus.label}
                        </span>
                    </div>
                    <div>
                        <PaymentProof
                            src={order?.paymentProof}
                            paymentMethod={order?.paymentMethod}
                            orderId={orderId}
                            status={normalizeOrderStatus(order?.status ?? "")}
                            onAction={(action) => setActionTriggered(action)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
