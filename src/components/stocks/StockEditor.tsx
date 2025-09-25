"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import StockList from "./StockList";
import StockForm from "./StockForm";
import { StockItem, ApiStockRaw, ApiListResponse } from "./stockTypes";
import { normalizeApiList } from "./stockHelpers";
import axios from "axios";

export default function StockEditor({
  productId,
  token,
}: {
  productId: string;
  token?: string | null;
}) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeIdInput, setStoreIdInput] = useState(""); // UUID store
  const [qtyInput, setQtyInput] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, token]);

  const ensureAuthHeader = (t?: string | null) => {
    if (t) api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    else delete api.defaults.headers.common["Authorization"];
  };

  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      ensureAuthHeader(token);
      console.log("[StockEditor] fetchStocks request ->", { productId });
      const res = await api.get<ApiListResponse<ApiStockRaw>>(
        `/api/stocks/products/${productId}`
      );
      console.log("[StockEditor] fetchStocks response ->", res?.data);

      const rawItems = normalizeApiList(res.data?.data);

      const mapped: StockItem[] = rawItems.map((d) => ({
        stockId: d.id ?? d.stockId ?? undefined,
        storeId: d.storeId,
        storeName: d.storeName ?? d.store?.name ?? "",
        quantity: typeof d.quantity === "number" ? d.quantity : 0,
        updatedAt: d.updatedAt ?? null,
      }));

      setItems(mapped);
    } catch (err) {
      console.error("fetchStocks error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  function extractErrorInfo(err: unknown) {
    if (axios.isAxiosError(err)) {
      return {
        kind: "axios" as const,
        message: err.message,
        responseData: err.response?.data,
        status: err.response?.status,
      };
    }
    return {
      kind: "unknown" as const,
      message: err instanceof Error ? err.message : String(err),
      responseData: undefined,
      status: undefined,
    };
  }

  const createOrUpdate = async () => {
    if (!storeIdInput) return alert("Pilih store dari dropdown terlebih dahulu");

    setSaving(true);
    try {
      ensureAuthHeader(token);

      const existing = items.find((it) => it.storeId === storeIdInput);

      if (existing && existing.stockId) {
        console.log("[StockEditor] update absolute stock", {
          stockId: existing.stockId,
          qtyInput,
        });

        const res = await api.patch(`/api/stocks/${existing.stockId}`, {
          setAbsolute: Number(qtyInput),
        });
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.data?.message ?? "Gagal update stock");
        }
      } else {
        const payload = {
          productId,
          storeId: storeIdInput,
          initialQuantity: Number(qtyInput),
        };
        console.log("[StockEditor] create new stock", payload);

        const res = await api.post(`/api/stocks`, payload);
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.data?.message ?? "Gagal create stock");
        }
      }

      await fetchStocks();
      setStoreIdInput("");
      setQtyInput(0);
    } catch (err) {
      const info = extractErrorInfo(err);
      console.error("createOrUpdate error:", info);
      alert(info.responseData?.message ?? info.message);
    } finally {
      setSaving(false);
    }
  };

  const setDelta = async (
    stockId: string | undefined,
    storeId: string,
    deltaQty: number
  ) => {
    try {
      ensureAuthHeader(token);
      console.log("[StockEditor] setDelta ->", { stockId, storeId, deltaQty });

      if (stockId) {
        const res = await api.patch(`/api/stocks/${stockId}`, { delta: deltaQty });
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.data?.message ?? "Gagal update stock via delta");
        }
      } else {
        const payload = { productId, storeId, initialQuantity: deltaQty };
        const res = await api.post(`/api/stocks`, payload);
        if (!(res.status >= 200 && res.status < 300)) {
          throw new Error(res.data?.message ?? "Gagal create stock via delta");
        }
      }

      await fetchStocks();
    } catch (err) {
      const info = extractErrorInfo(err);
      console.error("setDelta error:", info);
      alert(info.responseData?.message ?? info.message);
    }
  };

  if (isLoading)
    return <div className="text-sm text-slate-600">Load stocks...</div>;

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-600">List stocks per store</div>
      <StockList items={items} onSet={setDelta} />
      <StockForm
        storeId={storeIdInput}
        token={token}
        qty={qtyInput}
        onStoreChange={setStoreIdInput}
        onQtyChange={setQtyInput}
        onSave={createOrUpdate}
        saving={saving}
      />
    </div>
  );
}
