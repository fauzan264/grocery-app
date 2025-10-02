"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { runInBatches } from "@/utils/batch";
import { createStock, deleteProduct } from "@/services/product";
import type { CreateStockInput } from "@/services/product";
import type { StockItem, ApiStockRaw, } from "@/components/stocks/stockTypes";

type Props = {
  stocks: StockItem[];
  setStocks: React.Dispatch<React.SetStateAction<StockItem[]>>;
  token?: string | null;
  productId?: string | null;
  autoPushWhenProductReady?: boolean;
  rollbackOnError?: boolean;
};

type StoreApiItem = {
  id: string | number;
  name: string;
  [key: string]: unknown;
};

// Helper untuk normalize store response
const mapToStores = (arr: unknown[]): { id: string; name: string }[] => {
  return arr
    .filter((s): s is StoreApiItem => {
      return (
        typeof s === "object" &&
        s !== null &&
        "id" in s &&
        "name" in s
      );
    })
    .map((s) => ({
      id: String(s.id),
      name: String(s.name),
    }));
};

export default function StockEditorCreate({
  stocks,
  setStocks,
  token,
  productId,
  autoPushWhenProductReady = false,
  rollbackOnError = false,
}: Props) {
  const [storeIdInput, setStoreIdInput] = useState("");
  const [qtyInput, setQtyInput] = useState(0);
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{
    successes: StockItem[];
    errors: { item: StockItem; error: unknown }[];
    rollback?: { attempted: boolean; success: boolean; error?: unknown };
  } | null>(null);

  // fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      setLoadingStores(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await api.get("/api/stores", { headers });
        const data = res?.data;

        let list: { id: string; name: string }[] = [];

        if (Array.isArray(data)) {
          list = mapToStores(data);
        } else if (Array.isArray(data?.data)) {
          list = mapToStores(data.data);
        } else if (Array.isArray(data?.data?.stores)) {
          list = mapToStores(data.data.stores);
        } else if (Array.isArray(data?.stores)) {
          list = mapToStores(data.stores);
        } else {
          console.warn("Unrecognized stores response shape:", data);
        }

        setStores(list);
      } catch (err) {
        console.error("fetchStores error:", err);
        setStores([]);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, [token]);

  // auto push when product becomes available (optional)
  useEffect(() => {
    if (autoPushWhenProductReady && productId) {
      // only trigger if stocks exist
      if (stocks.length > 0) {
        void handlePushToServer();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const addStock = () => {
    if (!storeIdInput) return alert("Pilih store terlebih dahulu");
    const store = stores.find((s) => s.id === storeIdInput);
    if (!store) return alert("Store tidak ditemukan");

    const existingIndex = stocks.findIndex((s) => s.storeId === storeIdInput);
    if (existingIndex !== -1) {
      const updated = [...stocks];
      updated[existingIndex].quantity = qtyInput;
      setStocks(updated);
    } else {
      setStocks([
        ...stocks,
        { storeId: store.id, storeName: store.name, quantity: qtyInput, updatedAt: null },
      ]);
    }

    setStoreIdInput("");
    setQtyInput(0);
  };

  const updateStock = (index: number, quantity: number) => {
    const updated = [...stocks];
    updated[index].quantity = quantity;
    setStocks(updated);
  };

  const removeStock = (index: number) => {
    const updated = [...stocks];
    updated.splice(index, 1);
    setStocks(updated);
  };

  // push handler (UI)
  const handlePushToServer = async () => {
    if (!productId) return alert("ProductId belum tersedia. Simpan product dulu.");
    if (stocks.length === 0) return alert("Belum ada stock untuk di-push.");

    setPushing(true);
    setPushResult(null);

    try {
      const result = await createStocksForProduct(stocks, productId, { concurrency: 5, rollbackOnError });

      setPushResult(result);

      if (result.errors.length > 0) {
        if (result.rollback?.attempted) {
          alert(
            `Beberapa stock gagal dibuat (${result.errors.length}). Rollback attempted: ${result.rollback.success ? "SUCCESS" : "FAILED"
            }. Cek console untuk detail.`
          );
        } else {
          alert(`Beberapa stock gagal dibuat (${result.errors.length}). Cek console untuk detail.`);
        }
      } else {
        alert(`Semua stock berhasil dibuat (${result.successes.length}).`);
      }
    } catch (err) {
      console.error("push stocks fatal error:", err);
      alert("Gagal melakukan push stocks. Cek console.");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Stocks per Store</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={storeIdInput}
          onChange={(e) => setStoreIdInput(e.target.value)}
          disabled={loadingStores}
          className="border border-gray-300 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-600"
        >
          <option value="">{loadingStores ? "Loading stores..." : "Select Store"}</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={qtyInput}
          onChange={(e) => setQtyInput(Number(e.target.value))}
          className="border border-gray-300 p-3 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-600"
        />

        <button
          onClick={addStock}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 hover:shadow-md transition"
        >
          Add
        </button>

        <button
          onClick={handlePushToServer}
          disabled={!productId || pushing || stocks.length === 0}
          className="ml-2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {pushing ? "Pushing..." : "Push to server"}
        </button>
      </div>

      {stocks.length === 0 ? (
        <div className="text-sm text-gray-500">No stocks added yet</div>
      ) : (
        <ul className="space-y-3">
          {stocks.map((s, idx) => (
            <li
              key={s.storeId}
              className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span className="flex-1 text-gray-700 font-medium">{s.storeName}</span>
              <input
                type="number"
                value={s.quantity}
                onChange={(e) => updateStock(idx, Number(e.target.value))}
                className="border border-gray-300 p-2 w-24 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-600"
              />
              <button
                onClick={() => removeStock(idx)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {pushResult && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700 mb-2">
            Successes: {pushResult.successes.length}, Errors: {pushResult.errors.length}
          </div>
          {pushResult.errors.length > 0 && (
            <div className="text-sm text-red-600">
              <strong>Errors detail (see console):</strong>
              <ul className="mt-2 list-disc ml-5">
                {pushResult.errors.map((e, i) => (
                  <li key={i}>
                    {e.item.storeName} — {String((e.error as Error)?.message ?? JSON.stringify(e.error))}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pushResult.rollback && (
            <div className="mt-2 text-sm text-yellow-700">
              Rollback attempted: {String(pushResult.rollback.attempted)}, success:{" "}
              {String(pushResult.rollback.success)} {pushResult.rollback.error ? ` — error: ${String(pushResult.rollback.error)}` : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Helper: create stocks on server for given productId
 *
 * - localStocks: StockItem[]
 * - productId: string
 * - token: optional
 * - options: { concurrency, rollbackOnError }
 *
 * Return:
 *  { successes: StockItem[]; errors: { item: StockItem; error: unknown }[]; rollback?: { attempted, success, error } }
 */
export async function createStocksForProduct(
  localStocks: StockItem[],
  productId: string,
  options?: { concurrency?: number; rollbackOnError?: boolean }
): Promise<{
  successes: StockItem[];
  errors: { item: StockItem; error: unknown }[];
  rollback?: { attempted: boolean; success: boolean; error?: unknown };
}> {
  const concurrency = options?.concurrency ?? 5;
  const doRollback = options?.rollbackOnError ?? false;

  if (!productId) throw new Error("productId is required");
  if (!Array.isArray(localStocks) || localStocks.length === 0) {
    return { successes: [], errors: [] };
  }

  type Payload = CreateStockInput;

  const payloads: Payload[] = localStocks.map((s) => ({
    productId,
    storeId: s.storeId,
    qty: Number(s.quantity),
  }));

  // worker → createStock return ApiStockRaw langsung
  const worker = async (p: Payload): Promise<ApiStockRaw> => {
    const res = await createStock(p); // ✅ hanya 1 argumen
    return res.data as ApiStockRaw;
  };

  const { successes: rawSuccesses, errors: rawErrors } = await runInBatches(
    payloads,
    worker,
    concurrency
  );

  const successes: StockItem[] = (rawSuccesses as ApiStockRaw[]).map(
    parseApiStockRawToStockItem
  );

  const errors = rawErrors.map((e) => {
    const payloadItem = e.item as Payload;
    const local = localStocks.find((ls) => ls.storeId === payloadItem.storeId);
    const fallback: StockItem = {
      storeId: payloadItem.storeId,
      storeName: local?.storeName ?? payloadItem.storeId,
      quantity: payloadItem.qty,
      updatedAt: local?.updatedAt ?? null,
      stockId: undefined,
    };
    return { item: local ?? fallback, error: e.error };
  });

  let rollbackResult:
    | { attempted: boolean; success: boolean; error?: unknown }
    | undefined = undefined;

  if (errors.length > 0 && doRollback) {
    rollbackResult = { attempted: true, success: false };
    try {
      await deleteProduct(productId); // ✅ token gak usah dipassing manual
      rollbackResult.success = true;
    } catch (err) {
      rollbackResult.success = false;
      rollbackResult.error = err;
      console.error("Rollback deleteProduct failed:", err);
    }
  }

  return { successes, errors, rollback: rollbackResult };
}


/** helper mapper */
function parseApiStockRawToStockItem(raw: ApiStockRaw): StockItem {
  const stockId =
    raw.stockId ?? raw.stock_id ?? raw.id ?? raw._id ?? undefined;
  const storeName =
    raw.storeName ?? raw.store?.name ?? String(raw.storeId ?? "");
  const quantity = typeof raw.quantity === "number" ? raw.quantity : Number(raw.quantity ?? 0);
  const updatedAt = raw.updatedAt ?? null;

  return {
    stockId,
    storeId: String(raw.storeId),
    storeName,
    quantity,
    updatedAt,
  };
}
