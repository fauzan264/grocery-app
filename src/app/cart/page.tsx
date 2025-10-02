"use client";
import { useEffect, useState } from "react";
import CartItems from "@/features/cart/components/CartItems";
import { ICartItems } from "@/features/cart/components/type";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore"; // ⬅️ pakai global store
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    deleteCartItem,
    getCartItems,
    updateCartItemQty,
} from "@/services/cart";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingThreeDotsPulse from "@/components/ui/loading";

export default function Cart() {
    const { token } = useAuthStore();
    const router = useRouter();

    const { cartItems, setCartItems } = useCartStore();
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // GET cart items
    const onGetCartItems = async () => {
        try {
            setLoading(true);
            const items = await getCartItems(token);
            setCartItems(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) onGetCartItems();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );
    }

    // PATCH increment/decrement
    const onChangeItemQty = async (
        id: string,
        action: "increment" | "decrement"
    ) => {
        const oldItems = [...cartItems];

        setCartItems(
            cartItems.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity:
                              action === "increment"
                                  ? item.quantity + 1
                                  : item.quantity - 1,
                          subTotal:
                              (action === "increment"
                                  ? item.quantity + 1
                                  : item.quantity - 1) * item.price,
                      }
                    : item
            )
        );

        setLoadingIds((prev) => [...prev, id]);

        try {
            const updatedItem = await updateCartItemQty(id, action, token, 200);

            if (updatedItem.message === "Item removed from cart") {
                setCartItems(cartItems.filter((item) => item.id !== id));
                toast.success("Item removed from cart", {
                    containerId: "cart",
                });
            } else {
                setCartItems(
                    cartItems.map((item) =>
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

    const onRemoveItem = async (id: string) => {
        const oldItems = [...cartItems];
        setCartItems(cartItems.filter((item) => item.id !== id));
        try {
            await deleteCartItem(id, token);
            toast.success("Item removed from cart", { containerId: "cart" });
        } catch (err) {
            console.error(err);
            setCartItems(oldItems);
        }
    };

    const total = cartItems.reduce(
        (acc, item) => acc + Number(item.subTotal),
        0
    );
    const goToShopping = () => {
        router.push("/");
    };

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
                                    Cart is empty
                                </p>
                                <button
                                    onClick={goToShopping}
                                    className="bg-black text-white font-bold border rounded-md p-2"
                                >
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
                            onClick={() => router.push("/orders")}
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
