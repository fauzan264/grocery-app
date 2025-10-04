"use client";
import OrderCard from "@/features/orders/CheckOutOrderCard";
import { PaymentMethod } from "@/features/orders/type";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { useOrderStore } from "@/store/userOrderStore";
import { formatPrice } from "@/utils/formatPrice";
import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { MdDiscount } from "react-icons/md";

export default function Order() {
    const { cartItems } = useCartStore();
    const { currentShipping } = useOrderStore();
    const [couponCodes, setCouponCodes] = useState<string[]>([]);

    const subTotal = cartItems.reduce((acc, item) => acc + Number(item.subTotal), 0);
    const delivery = currentShipping ? currentShipping.cost : 0;
    const discount = 0;
    const total = subTotal + delivery - discount;

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-10 mt-15">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Checkout Order</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <OrderCard />
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow h-fit">
                            <h2 className="text-lg font-semibold mb-4">
                                Order Summary
                            </h2>
                            {/* Mapping Items */}
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-gray-600 border-b w-full py-2"
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
                                <div className="flex justify-between py-2">
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

                            <button className="flex justify-between items-center w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold ">
                                <span className="flex text-sm items-center gap-2">
                                    <MdDiscount className="text-lg" />
                                    Select Available Discount
                                </span>
                                <IoChevronForward className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
