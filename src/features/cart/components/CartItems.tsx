"use client";
import { useState } from "react";
import { ICartItems } from "./type";
import { formatPrice } from "@/utils/format";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";


export default function CartItems(props: ICartItems & { onUpdateItem: (item: ICartItems) => void }) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const updateCart = async (action: "increment" | "decrement") => {
    const oldQty = props.quantity;
    const newQty = action === "increment" ? oldQty + 1 : oldQty - 1;


    props.onUpdateItem({ ...props, quantity: newQty, subTotal: newQty * props.price });

    try {
      setLoading(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${props.id}`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      props.onUpdateItem(response.data.data);
    } catch (err) {
      console.error(err);
      props.onUpdateItem({ ...props, quantity: oldQty, subTotal: oldQty * props.price });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <p>{props.product.name}</p>
        <div className="flex flex-col items-center">
          <p className="font-bold text-gray-800">{formatPrice(props.price)}</p>
          <div className="flex items-center gap-5 border border-gray-200 rounded-full">
            <button
              disabled={loading || props.quantity <= 0}
              onClick={() => updateCart("decrement")}
              className="px-2 text-lg font-bold text-gray-500 disabled:opacity-50"
            >
              -
            </button>
            <span className="text-sm">{props.quantity}</span>
            <button
              disabled={loading}
              onClick={() => updateCart("increment")}
              className="px-2 text-lg font-bold text-gray-500 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
