"use client";
import { ICartItems } from "./type";
import { formatPrice } from "@/utils/formatPrice";
import { formatWeight } from "@/utils/formatProducts";
import Image from "next/image";
import { memo, useCallback } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface CartItemsProps {
    item: ICartItems;
    onRemove?: (id: string) => void;
    onChangeQuantity: (id: string, action: "increment" | "decrement") => void;
    loading: boolean;
}

function CartItems({
    item,
    onRemove,
    onChangeQuantity,
    loading,
}: CartItemsProps) {
    const { id, product, quantity, price } = item;
    console.log("CartItem rendered:", id, {
        name: product.name,
        image:
            product.images?.find((img) => img.isPrimary)?.url || "/grocery.jpg",
        weight_g: product.weight_g,
        stock: product.stocks,
        quantity,
        price,
        loading,
    });

    const handleIncrement = useCallback(() => {
        onChangeQuantity(id, "increment");
    }, [onChangeQuantity, id]);

    const handleDecrement = useCallback(() => {
        if (quantity > 0) {
            onChangeQuantity(id, "decrement");
        }
    }, [onChangeQuantity, id, quantity]);

    const handleDelete = useCallback(() => {
        onRemove?.(id);
    }, [onRemove, id]);

    const totalStock = item.product.stocks.reduce(
        (acc, s) => acc + s.quantity,
        0
    );
    const isIncrementDisabled =
        loading || Number(quantity) >= Number(totalStock);
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={
                            product.images?.find((img) => img.isPrimary)?.url ||
                            "/grocery.jpg"
                        }
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                    />
                    <div className="flex flex-col">
                        <p>{product.name}</p>
                        <p className="text-xs">
                            {formatWeight(product.weight_g)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="font-bold text-gray-800">
                        {formatPrice(price)}
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
                                disabled={loading || quantity <= 0}
                                onClick={handleDecrement}
                                className="px-2 text-lg font-bold text-gray-500 disabled:opacity-50"
                            >
                                -
                            </button>
                            <span className="text-sm">{quantity}</span>
                            <button
                                disabled={isIncrementDisabled}
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

export default memo(CartItems, (prev, next) => {
    return (
        prev.item.quantity === next.item.quantity &&
        prev.item.price === next.item.price &&
        prev.loading === next.loading &&
        prev.onRemove === next.onRemove &&
        prev.onChangeQuantity === next.onChangeQuantity
    );
});
