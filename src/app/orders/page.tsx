"use client";
import OrderCard from "@/features/orders/CheckOutOrderCard";
import { PaymentMethod } from "@/features/orders/type";
import AuthGuard from "@/hoc/AuthGuard";
import { createOrders } from "@/services/order";
import { createGatewayPayment } from "@/services/payment";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import useLocationStore from "@/store/useLocationStore";
import { useOrderStore } from "@/store/userOrderStore";
import { formatPrice } from "@/utils/formatPrice";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdDiscount } from "react-icons/md";

function Order() {
    const { token } = useAuthStore();
    const router = useRouter();
    const { cartItems } = useCartStore();
    const { selectedStore } = useLocationStore();
    const { currentShipping, currentAddress, setCurrentOrder } =
        useOrderStore();
    const [couponCodes, setCouponCodes] = useState<string[]>([]);
    const [selected, setSelected] = useState<PaymentMethod>(
        PaymentMethod.BANK_TRANSFER
    );
    const [loading, setLoading] = useState(false);

    const subTotal = cartItems.reduce(
        (acc, item) => acc + Number(item.subTotal),
        0
    );
    const delivery = currentShipping ? currentShipping.cost : 0;
    const discount = 0;
    const total = subTotal + delivery - discount;

    const handleCreateOrder = async () => {
        if (!token)
            return toast.error("User not authenticated", {
                position: "top-right",
            });
        if (!currentAddress)
            return toast.error("Please select a shipping address", {
                position: "top-right",
            });
        if (!currentShipping)
            return toast.error("Please select a shipping method", {
                position: "top-right",
            });

        try {
            setLoading(true);

            if (!selectedStore?.id) return;

            const shippingDays = currentShipping.etd
                ? currentShipping.etd.split("-")[0]
                : "0";

            const payload = {
                storeId: selectedStore.id,
                couponCodes: [],
                paymentMethod: selected,
                shipment: {
                    courier: currentShipping.name,
                    service: currentShipping.service,
                    shipping_cost: currentShipping.cost,
                    shipping_days: shippingDays,
                    address: currentAddress.address ?? "",
                    province_name: currentAddress.province.name ?? "",
                    city_name: currentAddress.city.name ?? "",
                    district_name: currentAddress.district.name ?? "",
                },
            };

            console.log("Order Payload:", payload);

            const order = await createOrders(payload, token);
            console.log("Order Payload:", payload);
            setCurrentOrder(order);
            toast.success("Order created successfully!");

            if (selected === PaymentMethod.SNAP) {
                const { redirect_url } = await createGatewayPayment(
                    order.id,
                    token
                );
                window.location.href = redirect_url;
            } else {
                router.replace(`/orders/${order.id}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-10 mt-15">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Checkout Order</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <OrderCard
                                selectedPayment={selected}
                                setSelectedPayment={setSelected}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow h-fit">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Summary
                            </h2>
                            {/* Mapping Items */}
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-gray-600 w-full py-2"
                                >
                                    <div className="flex items-start gap-2">
                                        <span>{item.quantity}x</span>
                                        <span>{item.product.name}</span>
                                    </div>
                                    <span className="font-bold">
                                        {formatPrice(item.subTotal)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex flex-col text-gray-600">
                                <div className="flex justify-between py-2 border-t">
                                    <span>Delivery</span>
                                    <span>{formatPrice(delivery)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span>Discount</span>
                                    <span>{formatPrice(discount)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold py-2 mb-4 border-b">
                                <span>Order Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 uppercase text-sm"
                                        />
                                        <MdDiscount className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    </div>
                                    <button className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-green-700 text-sm transition-colors">
                                        Apply
                                    </button>
                                </div>
                                {/* Create Order button */}
                                <button
                                    onClick={handleCreateOrder}
                                    disabled={loading || !cartItems.length}
                                    className="w-full bg-amber-400 text-white text-sm py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Create Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthGuard(Order, ["CUSTOMER"]);
