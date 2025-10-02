"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Select, { SingleValue } from "react-select";

type StoreItem = {
  id: string;
  name: string;
  address?: string | null;
};

// kemungkinan bentuk data dari API (opsional semua)
type RawStore = {
  id?: string | number;
  storeId?: string | number;
  _id?: string | number;
  name?: string;
  storeName?: string;
  address?: string | null;
  [k: string]: unknown;
};

type Option = { value: string; label: string };

export default function StockForm({
  storeId = "",
  qty = 0,
  onStoreChange,
  onQtyChange,
  onSave,
  saving = false,
  token,
}: {
  storeId?: string;
  qty: number;
  onStoreChange: (storeId: string) => void;
  onQtyChange: (qty: number) => void;
  onSave: () => void | Promise<void>;
  saving?: boolean;
  token?: string | null;
}) {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [useManual, setUseManual] = useState(false);
  const [manualInput, setManualInput] = useState("");

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // helper kecil
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const toStr = (v: unknown): string | undefined =>
    typeof v === "string" ? v : typeof v === "number" ? String(v) : undefined;

  const fetchStores = async () => {
    setLoading(true);
    try {
      console.log("[StockForm] fetchStores request");
      const res = await api.get("/api/stores?page=1&limit=200");
      console.log("[StockForm] fetchStores response ->", res?.data);

      const raw: unknown =
        res.data?.data?.stores ??
        res.data?.stores ??
        res.data?.data ??
        res.data;

      let normalized: StoreItem[] = [];

      if (Array.isArray(raw)) {
        normalized = raw.reduce<StoreItem[]>((acc, entry) => {
          if (!isObject(entry)) return acc;

          // entry mungkin bukan RawStore tapi kita bisa baca field-field umum
          const maybeId = (entry as RawStore).id ?? (entry as RawStore).storeId ?? (entry as RawStore)._id;
          const id = toStr(maybeId);
          if (!id) return acc; // skip jika tidak dapat id

          const nameField = (entry as RawStore).name;
          const storeNameField = (entry as RawStore).storeName;
          const name =
            typeof nameField === "string"
              ? nameField
              : typeof storeNameField === "string"
              ? storeNameField
              : id;

          const address =
            typeof (entry as RawStore).address === "string"
              ? (entry as RawStore).address
              : null;

          acc.push({ id, name, address });
          return acc;
        }, []);
      }

      setStores(normalized);
    } catch (err) {
      console.error("[StockForm] fetchStores error:", err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      setManualInput("");
      setUseManual(false);
    }
  }, [storeId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Tambah / Update Stock</h4>
        <div className="text-xs text-gray-500">
          {loading ? "Memuat store..." : `${stores.length} store`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Pilih Store
          </label>

          {!useManual ? (
            <div>
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Select<Option, false>
                    isLoading={loading}
                    options={stores.map((s) => ({
                      value: s.id,
                      label: s.name, // hanya nama store ditampilkan
                    }))}
                    value={
                      storeId
                        ? {
                            value: storeId,
                            label:
                              stores.find((s) => s.id === storeId)?.name ??
                              "Store tidak ditemukan",
                          }
                        : null
                    }
                    onChange={(opt: SingleValue<Option>) =>
                      onStoreChange(opt?.value ?? "")
                    }
                    placeholder="Cari atau pilih store..."
                    className="text-sm"
                  />
                </div>
                <button
                  type="button"
                  className="px-3 py-2 rounded border text-sm"
                  onClick={() => setUseManual(true)}
                >
                  Manual
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Masukkan storeId (UUID)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <button
                  type="button"
                  className="px-3 py-2 rounded border text-sm"
                  onClick={() => {
                    onStoreChange(manualInput);
                    setUseManual(false);
                  }}
                >
                  Pakai
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Atau pilih dari list jika ragu.
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => onQtyChange(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={fetchStores}
          type="button"
          className="px-3 py-2 rounded border text-sm"
        >
          Refresh Stores
        </button>

        <button
          onClick={() => onSave()}
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm shadow"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
