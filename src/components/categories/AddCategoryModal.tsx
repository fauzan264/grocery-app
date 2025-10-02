"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

type CategoryFlat = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  token?: string | null;
  parentOptions?: CategoryFlat[];
  onCreated?: (created: { id: string; name: string }) => void;
};

export default function AddCategoryModal({ open, onClose, token, parentOptions = [], onCreated }: Props) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setParentId("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  const submit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Nama kategori wajib diisi");
      return;
    }
    setLoading(true);
    try {
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      else delete api.defaults.headers.common["Authorization"];

      const payload: Record<string, unknown> = { name: name.trim() };
      if (parentId) payload["parentId"] = parentId;

      const res = await api.post("/api/categories", payload);
      if (res.data?.success) {
        const created = res.data?.data;
        onCreated?.({ id: String(created.id), name: String(created.name) });
        onClose();
      } else {
        setError(res.data?.message ?? "Gagal membuat kategori");
      }
    } catch (err: unknown) {
      console.error("create category error", err);
      setError((err as Error)?.message ?? "Gagal membuat kategori");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Tambah Kategori Baru</h3>

        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border rounded p-2 text-sm"
              placeholder="Contoh: Alat Dapur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parent (opsional)</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="mt-1 block w-full border rounded p-2 text-sm"
            >
              <option value="">-- Tidak ada parent --</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 rounded border text-sm">
            Batal
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            {loading ? "Menyimpan..." : "Simpan Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
}