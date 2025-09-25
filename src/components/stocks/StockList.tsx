import React, { useState } from "react";
import { StockItem } from "./stockTypes";

export default function StockList({
  items,
  onSet,
}: {
  items: StockItem[];
  onSet: (stockId: string | undefined, storeId: string, newQty: number) => void;
}) {
  const [editing, setEditing] = useState<Record<string, number>>({});

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-sm text-slate-500">No stock records yet.</div>
      )}
      {items.map((item) => (
        <div
          key={item.storeId}
          className="flex items-center justify-between border p-2 rounded text-sm"
        >
          <div>
            <div className="font-medium">{item.storeName || item.storeId}</div>
            <div className="text-xs text-slate-500">
              Qty: {item.quantity}{" "}
              {item.updatedAt && `(updated ${new Date(item.updatedAt).toLocaleString()})`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editing[item.storeId] ?? item.quantity}
              onChange={(e) =>
                setEditing((prev) => ({
                  ...prev,
                  [item.storeId]: Number(e.target.value),
                }))
              }
              className="px-2 py-1 border rounded w-20 text-sm"
            />
            <button
              onClick={() =>
                onSet(item.stockId, item.storeId, editing[item.storeId] ?? item.quantity)
              }
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
