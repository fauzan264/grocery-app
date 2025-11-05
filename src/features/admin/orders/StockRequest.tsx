"use client";

import { useState } from "react";

import useAuthStore from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { requestStock } from "@/services/stock";

interface StockRequestModalProps {
  productId: string;
  storeId: string;
  orderId: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function StockRequestModal({
  productId,
  storeId,
  orderId,
  onClose,
  onSuccess,
}: StockRequestModalProps) {
  const [quantity, setQuantity] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async () => {
    if (!quantity || quantity <= 10) {
      toast.error("You can only request at least 10 Pcs");
      return;
    }

    if (!token) {
      toast.error("Unauthorized");
      return;
    }
    console.log("Payload to backend:", { productId, storeId, orderId, quantity });


    setLoading(true);
    try {
      await requestStock({ productId, storeId, orderId, quantity }, token);
      toast.success("Stock request sent successfully!");
      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send stock request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Request Stock
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <input
          type="number"
          min={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
