"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "@/store/useCartStore";
import { formatPrice } from "@/utils/format";
import { useRouter } from "next/navigation";

export default function CartIcon() {
    const { cartItems } = useCartStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const goToCart = () => {
        setShowDropdown(false); 
        router.push("/cart"); 
    };

    return (
        <div className="relative">
            {/* Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition"
            >
                <FaShoppingCart className="text-lg" />
                <span>{cartItems.length}</span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-2 border-b">
                        <h3 className="font-semibold text-black">Cart</h3>
                        <span className="text-sm text-black">
                            ({cartItems.length})
                        </span>
                    </div>

                    {/* Scrollable Items */}
                    <div className="max-h-60 overflow-y-auto px-4 py-2 space-y-3">
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                Cart is empty
                            </p>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-start"
                                >
                                    <p className="text-sm font-medium text-black w-40">
                                        {item.product.name}
                                    </p>
                                    <p className="text-sm text-black whitespace-nowrap">
                                        {item.quantity} x{" "}
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t px-4 py-2">
                        <button
                            onClick={goToCart}
                            className="w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-800 transition"
                        >
                            Lihat Keranjang
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
