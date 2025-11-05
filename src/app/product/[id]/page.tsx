"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingThreeDotsPulse from "@/components/ui/loading";
import { getPublicProductById } from "@/services/public";
import { addToCart } from "@/services/cart";
import { useParams } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import useAuthStore from "@/store/useAuthStore";
import { showErrorToast, showSuccessToast } from "@/utils/swal";
import useLocationStore from "@/store/useLocationStore";

export interface PublicProduct {
    id: string;
    name: string;
    description: string;
    weight: number;
    price: number;
    image: string;
    category: string;
    stock: number;
}

interface AddToCartResponse {
    success: boolean;
    message?: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const { selectedStore } = useLocationStore();
    const [product, setProduct] = useState<PublicProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { token } = useAuthStore();

    useEffect(() => {
        if (!id) return;
        if (selectedStore?.id) {
            const fetchProduct = async () => {
                try {
                    const res = await getPublicProductById({
                        productId: id as string,
                        storeId: selectedStore?.id || "",
                    });
                    setProduct(res.data.data);
                } catch (error) {
                    console.error("Failed to fetch product:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, selectedStore?.id]);
    console.log(product);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingThreeDotsPulse />
            </div>
        );

    if (!product)
        return (
            <div className="text-center py-20 text-gray-500">
                Product not found 😢
            </div>
        );

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (type === "increment" && quantity < product.stock)
            setQuantity(quantity + 1);
        else if (type === "decrement" && quantity > 1)
            setQuantity(quantity - 1);
    };

    const handleAddToCart = async () => {
        if (!token) {
            await showErrorToast(
                "Login Required",
                "Please login first to add items to your cart."
            );
            return;
        }

        setIsAdding(true);

        try {
            await addToCart(token, product.id, quantity);
            await showSuccessToast(
                "Added to Cart 🛒",
                `${quantity} × ${product.name} has been added to your cart.`
            );
        } catch (error) {
            console.error(error);
            await showErrorToast(
                "Error",
                "An error occurred while adding the product to the cart."
            );
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="mb-2 text-sm text-gray-500 uppercase tracking-wide">
                            {product.category}
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        <p className="text-gray-700 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-bold text-emerald-700">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-gray-500 text-sm">/ pcs</span>
                        </div>

                        {/* Quantity */}
                        <div className="border-t border-gray-200 pt-5">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                Amount
                            </h3>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange("decrement")
                                        }
                                        disabled={quantity <= 1}
                                        className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val =
                                                parseInt(e.target.value) || 1;
                                            if (
                                                val >= 1 &&
                                                val <= product.stock
                                            )
                                                setQuantity(val);
                                        }}
                                        className="w-14 text-center border-x border-gray-200 text-gray-800 font-semibold focus:outline-none"
                                    />
                                    <button
                                        onClick={() =>
                                            handleQuantityChange("increment")
                                        }
                                        disabled={quantity >= product.stock}
                                        className="px-3 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>

                                <span className="text-sm text-gray-600">
                                    Remaining Stock:{" "}
                                    <b className="text-gray-900">
                                        {product.stock}
                                    </b>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-10">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm
    ${
        product.stock === 0
            ? "bg-gray-400 text-gray-100 cursor-not-allowed"
            : "bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
    }`}
                        >
                            {isAdding ? (
                                <LoadingThreeDotsPulse />
                            ) : product.stock === 0 ? (
                                "Out of Stock"
                            ) : (
                                <>
                                    <FaShoppingCart /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
