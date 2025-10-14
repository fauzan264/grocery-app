"use client";

import { useState } from "react";
import { addToCart } from "@/services/cart";
import toast from "react-hot-toast";


interface AddToCartButtonProps {
    productId: string;
    token: string;
    label?: string;
}

export default function AddToCartButton({
    productId,
    token,
    label = "Buy Now",
}: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            await addToCart(token, productId);
            toast.success("Item added to cart!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add to cart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`btn btn-sm bg-amber-400 hover:bg-amber-500 text-white border-0 w-full mt-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
            {loading ? "Processing..." : label}
        </button>
    );
}
