import Image from "next/image";
import { useState } from "react";
import { IOrderAdminResponse } from "./type";
import OrderStatusBadge from "@/features/orders/OrderStatusBedge";
import { normalizeOrderStatus } from "@/utils/normalizeOrderStatus";
import { formatDateWithTime } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { OrderStatus } from "@/features/orders/type";
import PaymentProof from "./PaymentProof";
import OrderActionBar from "./OrderAction";
import StockRequestModal from "./StockRequest";
import toast from "react-hot-toast";

export default function OrderDetail({
    order,
    refreshOrder,
}: {
    order: IOrderAdminResponse;
    refreshOrder: () => Promise<void>;
}) {
    const [actionTriggered, setActionTriggered] = useState<
        "cancel" | "deliver" | "approve" | "decline" | null
    >(null);

    const [selectedProduct, setSelectedProduct] = useState<{
        productId: string;
        storeId: string;
        orderId?: string;
    } | null>(null);

    const handleAction = async (
        action: "cancel" | "deliver" | "approve" | "decline"
    ) => {
        try {
            setActionTriggered(action);
            await refreshOrder();
        } catch (error) {
            console.error("Error during action:", error);
            toast.error("Failed to refresh order data");
        } finally {
            setActionTriggered(null);
        }
    };

    return (
        <>
            {/* 1. Order ID & Status Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-3">
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
                    orderId={order.orderId}
                    status={normalizeOrderStatus(order?.status ?? "")}
                    onAction={handleAction}
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
                            <p className="text-sm text-gray-500">
                                Available Stock: {item.stock}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="font-semibold text-gray-700">
                                {formatPrice(item?.subTotal ?? "0")}
                            </p>
                            {item.needGlobalStockRequest && (
                                <button
                                    disabled={item.hasPendingStockRequest}
                                    className={`mt-2 px-3 py-1 text-sm rounded-md transition-colors
            ${
                item.hasPendingStockRequest
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
            }`}
                                    onClick={() => {
                                        if (item.hasPendingStockRequest) return;
                                        setSelectedProduct({
                                            productId: item.productId,
                                            storeId: order.store!.id,
                                            orderId: order.orderId,
                                        });
                                    }}
                                >
                                    {item.hasPendingStockRequest
                                        ? "Waiting for stock mutation"
                                        : "Request Stock"}
                                </button>
                            )}
                        </div>
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
                            {formatPrice(order?.shipment.shipping_cost ?? 0)}
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
                        <span className="text-gray-500">Address</span>:{" "}
                        {order.shipment.address}
                    </div>
                    <div>
                        <span className="text-gray-500">Payment</span>:{" "}
                        {order?.paymentMethod}
                    </div>
                    <div>
                        <span className="text-gray-500">Status</span>:{" "}
                        <span
                            className={`font-medium ${
                                order.status ==
                                Object.values(OrderStatus)[
                                    OrderStatus.WAITING_FOR_PAYMENT
                                ]
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            {order.status ==
                            Object.values(OrderStatus)[
                                OrderStatus.WAITING_FOR_PAYMENT
                            ]
                                ? "Unpaid"
                                : "Paid"}
                        </span>
                    </div>
                    <div>
                        <PaymentProof
                            src={order?.paymentProof}
                            paymentMethod={order?.paymentMethod}
                            orderId={order.orderId}
                            status={normalizeOrderStatus(order?.status ?? "")}
                            onAction={handleAction}
                        />
                    </div>
                </div>
                {selectedProduct && (
                    <StockRequestModal
                        productId={selectedProduct.productId}
                        storeId={selectedProduct.storeId}
                        orderId={selectedProduct.orderId!}
                        onClose={() => setSelectedProduct(null)}
                        onSuccess={refreshOrder}
                    />
                )}
            </div>
        </>
    );
}
