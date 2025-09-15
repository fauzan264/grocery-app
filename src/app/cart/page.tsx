"use client";
import { useEffect, useState } from "react";
import CartItems from "@/features/cart/components/CartItems";
import { ICartItems } from "@/features/cart/components/type";
import useAuthStore from "@/store/useAuthStore";
import { formatPrice } from "@/utils/format";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
    const { token } = useAuthStore();
    const [cartItems, setCartItems] = useState<ICartItems[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const onGetCartItems = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCartItems(response?.data?.data?.items || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) onGetCartItems();
    }, [token]);

    const onChangeItemQty = async (
        id: string,
        action: "increment" | "decrement"
    ) => {
        const oldItems = [...cartItems];

        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const newQty =
                    action === "increment"
                        ? item.quantity + 1
                        : item.quantity - 1;
                const newSubTotal = newQty > 0 ? newQty * item.price : 0;
                return { ...item, quantity: newQty, subTotal: newSubTotal };
            })
        );

        setLoadingIds((prev) => [...prev, id]);

        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items`,
                { id, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedItem = response.data.data;

            if (updatedItem.message === "Item removed from cart") {
                setCartItems((prev) => prev.filter((item) => item.id !== id));
                toast.success("Item has been remove from cart", {
                    containerId: "cart",
                });
            } else {
                setCartItems((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, ...updatedItem } : item
                    )
                );
            }
        } catch (err) {
            console.error(err);
            setCartItems(oldItems);
        } finally {
            setLoadingIds((prev) => prev.filter((lid) => lid !== id));
        }
    };

    const onRemoveItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.success("Item removed from cart", { containerId: "cart" });
    };

    const total = cartItems.reduce(
        (acc, item) => acc + Number(item.subTotal),
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 py-10 mt-15">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Cart</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <CartItems
                                    key={item.id}
                                    {...item}
                                    loading={loadingIds.includes(item.id)}
                                    onChangeQuantity={onChangeItemQty}
                                    onRemove={onRemoveItem}
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
                        <button
                            className="w-full bg-amber-400 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
