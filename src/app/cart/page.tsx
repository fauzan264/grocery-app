"use client";
import CartItems from "@/features/cart/components/CartItems";
import { ICartItems } from "@/features/cart/components/type";
import useAuthStore from "@/store/useAuthStore";
import { formatPrice } from "@/utils/format";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function Cart() {
    const { token } = useAuthStore();
    const [cartItems, setCartItems] = useState<[] | ICartItems[]>([]);
    const onGetCartItems = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCartItems(response?.data?.data?.items);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (token) {
            onGetCartItems();
        }
    }, [token]);

    const total = cartItems.reduce((acc, item) => acc + item.subTotal, 0);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Cart</h1>
                {/* Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bagian kiri - daftar produk */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <CartItems
                                    key={item.id}
                                    {...item}
                                    onUpdateItem={(updatedItem) => {
                                        setCartItems((prev) =>
                                            prev.map((ci) =>
                                                ci.id === updatedItem.id
                                                    ? updatedItem
                                                    : ci
                                            )
                                        );
                                    }}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[60vh] gap-5">
                                <FaShoppingCart
                                    size={100}
                                    className="text-gray-500"
                                />
                                <p className="font-bold text-gray-500">
                                    Keranjang kosong
                                </p>
                                <button className="bg-black text-white font-bold border rounded-md p-2">
                                    Go to Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bagian kanan - ringkasan belanja */}
                    <div className="bg-white p-6 rounded-lg shadow h-fit">
                        <h2 className="text-lg font-semibold mb-4">
                            Cart Summary
                        </h2>
                        <div className="flex justify-between mb-4">
                            <span>Total</span>
                            <span className="font-bold">
                                {formatPrice(total)}
                            </span>
                        </div>
                        <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
