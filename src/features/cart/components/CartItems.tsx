"use client";
import { ICartItems } from "./type";
import { formatPrice } from "@/utils/formatPrice";
import { formatWeight } from "@/utils/formatProducts";
import Image from "next/image";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface CartItemsProps extends ICartItems {
    onRemove?: (id: string) => void;
    onChangeQuantity: (id: string, action: "increment" | "decrement") => void;
    loading: boolean;
}

export default function CartItems(props: CartItemsProps) {
    console.log("CartItem stock:", props.product.stock);
    const handleIncrement = () => props.onChangeQuantity(props.id, "increment");
    const handleDecrement = () =>
        props.quantity > 0 && props.onChangeQuantity(props.id, "decrement");
    const handleDelete = () => props.onRemove && props.onRemove(props.id);

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={
                            props.product.images?.find((img) => img.isPrimary)
                                ?.url || "/placeholder.jpg"
                        }
                        alt={props.product.name}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                    />
                    <div className="flex flex-col">
                        <p>{props.product.name}</p>
                        <p className="text-xs">
                            {formatWeight(props.product.weight_g)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="font-bold text-gray-800">
                        {formatPrice(props.price)}
                    </p>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 font-bold text-lg hover:text-red-700"
                        >
                            <RiDeleteBin6Fill />
                        </button>
                        <div className="flex items-center gap-5 border border-gray-200 rounded-full px-2">
                            <button
                                disabled={props.loading || props.quantity <= 0}
                                onClick={handleDecrement}
                                className="px-2 text-lg font-bold text-gray-500 disabled:opacity-50"
                            >
                                -
                            </button>
                            <span className="text-sm">{props.quantity}</span>
                            <button
                                disabled={
                                    props.loading ||
                                    props.quantity >= props.product.stock
                                }
                                onClick={handleIncrement}
                                className="px-2 text-lg font-bold text-gray-500 disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
