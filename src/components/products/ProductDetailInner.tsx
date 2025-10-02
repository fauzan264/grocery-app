"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useProduct } from "@/app/hooks/useProduct";
import { api } from "@/lib/api";
import { safeNumber, formatCurrencyRupiah, formatWeight } from "@/utils/formatProducts";

export default function ProductDetailInner() {
  // ----------------------------
  // TOP-LEVEL HOOKS (WAJIB DI SINI)
  // ----------------------------
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  // selalu panggil useProduct (hook) — internalnya menggunakan `enabled`
  const productQuery = useProduct(id);
  const { data: product, isLoading, isError, refetch } = productQuery;

  const qc = useQueryClient();

  // local states (hooks) — semua dideklarasikan di top-level
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ----------------------------
  // DERIVED HOOKS / MEMO (JUGA DI TOP-LEVEL)
  // ----------------------------
  // useMemo adalah hook juga — harus dipanggil sebelum ada return kondisional.
  // Jadi kita handle product mungkin undefined di sini (safety).
  const totalStock = useMemo(() => {
    if (!product) return 0; // kalau belum ada product, tetap return angka -> hook tetap terpanggil
    if (product.totalStock != null) {
      return safeNumber(product.totalStock) ?? 0;
    }
    const stores = Array.isArray(product.stocksPerStore) ? product.stocksPerStore : [];
    return stores.reduce((acc, s) => acc + (safeNumber(s.quantity) ?? 0), 0);
  }, [product]);

  const createdAtStr = useMemo(() => {
    if (!product) return "-";
    return product.createdAt ? new Date(String(product.createdAt)).toLocaleString() : "-";
  }, [product]);

  const priceNumber = useMemo(() => (product ? safeNumber(product.price) ?? null : null), [product]);

  const images = useMemo(() => (product && Array.isArray(product.images) ? product.images : []), [product]);

  const effectiveIndex = Math.min(Math.max(selectedIndex, 0), Math.max(images.length - 1, 0));

  // ----------------------------
  // EARLY RETURNS (boleh setelah semua hooks)
  // ----------------------------
  if (!id) return <div className="p-8">Invalid product id</div>;
  if (isLoading) return <div className="p-8">Loading product...</div>;
  if (isError || !product) return <div className="p-8">Product not found</div>;

  // ----------------------------
  // ACTIONS (functions, bukan hooks)
  // ----------------------------
  const doDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      else delete api.defaults.headers.common["Authorization"];

      await api.delete(`/api/products/${id}`);

      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products"] }),
        qc.invalidateQueries({ queryKey: ["product", id] }),
      ]);

      setShowDeleteModal(false);
      alert("Produk berhasil dihapus");
      router.push("/admin/products");
    } catch (err: unknown) {
      console.error(err);
      let msg = "Gagal menghapus produk";
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data as { message?: string };
        if (d.message) msg = d.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async () => {
    if (!id) return;
    try {
      setIsToggling(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      else delete api.defaults.headers.common["Authorization"];

      const next = !product.isActive;
      await api.patch(`/api/products/${id}`, { isActive: next });

      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products"] }),
        qc.invalidateQueries({ queryKey: ["product", id] }),
      ]);

      await refetch();
      alert(next ? "Product dipublish" : "Product disimpan sebagai draft");
    } catch (err: unknown) {
      console.error(err);
      let msg = "Gagal mengubah status produk";
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data as { message?: string };
        if (d.message) msg = d.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      alert(msg);
    } finally {
      setIsToggling(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(product.id);
      alert("ID product disalin ke clipboard");
    } catch {
      alert("Gagal menyalin ID");
    }
  };

  // ----------------------------
  // RENDER (UI)
  // ----------------------------
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
        {/* Tombol Back */}
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

          <nav className="text-sm text-slate-500 mb-3">
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link> /{" "}
            <Link href="/admin/products" className="hover:text-blue-600 transition">Products</Link> /{" "}
            <span className="text-slate-700 font-medium">{product.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{product.name}</h1>
          <p className="text-sm text-slate-500 mt-2">{product.sku ? `SKU: ${product.sku}` : "No SKU"}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/admin/products/${id}/edit`)} className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-medium shadow-md transition">Edit</button>

          <button onClick={() => setShowDeleteModal(true)} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition">Delete</button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery & description */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden border bg-white shadow-md">
            <div className="relative w-full h-[420px] bg-gray-100">
              {images[effectiveIndex] ? (
                <Image src={images[effectiveIndex].url} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>

            <div className="p-4 flex gap-3 flex-wrap">
              {images.length === 0 && <div className="text-sm text-slate-500">No images uploaded</div>}
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedIndex(i)} className={`relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm transition ${i === effectiveIndex ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-slate-300"}`} aria-label={`View image ${i + 1}`}>
                  <Image src={img.url} alt={img.altText ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-xl shadow-md border">
            <h3 className="font-semibold text-xl text-slate-800 mb-3">Description</h3>
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              {product.description ?? <span className="text-slate-400">No description</span>}
            </div>
          </div>
        </div>

        {/* Side */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-500 uppercase">Price</div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrencyRupiah(priceNumber)}</div>
              </div>
              <div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                  {product.isActive ? "Published" : "Draft"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-slate-700">
              <div><span className="font-medium">Category:</span> {product.category?.name ?? "-"}</div>
              <div>
            <span className="font-medium">Weight:</span>{" "}
            {product?.weight_g != null ? `${product.weight_g.toLocaleString("id-ID")} g` : "-"}
            </div>

                {/* DEBUG (sementara, hapus bila sudah beres) */}
                {false && <pre className="text-xs mt-2">DEBUG weight raw: {JSON.stringify(product?.weight_g)}</pre>}
              <div><span className="font-medium">Total stock:</span> {totalStock}</div>
              <div><span className="font-medium">Created at:</span> {createdAtStr}</div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={toggleActive} disabled={isToggling} className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {isToggling ? "Processing..." : product.isActive ? "Unpublish" : "Publish"}
                </button>

                <button onClick={copyId} className="px-3 py-1 rounded border text-sm hover:bg-slate-50 transition">Copy ID</button>

                <Link href={`/admin/products/${id}/export`} className="px-3 py-1 rounded border text-sm hover:bg-slate-50 transition">Export</Link>
              </div>
            </div>
          </div>

          {/* Stock per store */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h4 className="font-semibold mb-3 text-slate-800">Stock per Store</h4>
            {Array.isArray(product.stocksPerStore) && product.stocksPerStore.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-700">
                {product.stocksPerStore.map((s) => (
                  <li key={s.storeId} className="flex justify-between border-b last:border-0 pb-1">
                    <span>{s.storeName ?? s.storeId}</span>
                    <span className="font-medium">{safeNumber(s.quantity) ?? 0}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500">No stock info</div>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h4 className="font-semibold mb-3 text-slate-800">Actions & Info</h4>
            <div className="text-sm text-slate-700 space-y-2">
              <div><strong>ID:</strong> <code className="text-xs">{product.id}</code></div>
              <div><strong>Vendor / Store:</strong> {product.storeName ?? "-"}</div>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Konfirmasi Hapus Produk"
        message={
          <div>
            Kamu akan menghapus produk <strong>{product.name}</strong>. Tindakan ini <span className="font-semibold">tidak bisa dibatalkan</span>.
            <div className="mt-2 text-sm text-slate-500">Pastikan kamu yakin sebelum menghapus.</div>
          </div>
        }
        confirmLabel="Hapus Produk"
        cancelLabel="Batal"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={doDelete}
        loading={isDeleting}
      />
    </div>
  );
}
