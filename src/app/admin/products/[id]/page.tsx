"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProduct } from "@/app/hooks/useProduct";
import { api } from "@/lib/api";

const queryClient = new QueryClient();

export default function ProductDetailPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductDetailInner />
    </QueryClientProvider>
  );
}

function ProductDetailInner() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!id) return <div className="p-8">Invalid product id</div>;
  if (isLoading) return <div className="p-8">Loading product...</div>;
  if (isError || !product) return <div className="p-8">Product not found</div>;

  const images = product.images ?? [];

  const handleDelete = async () => {
    if (!confirm("Yakin mau menghapus produk ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      setIsDeleting(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await api.delete(`/api/products/${id}`);
      alert("Produk berhasil dihapus");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk. Cek console untuk detail.");
    } finally {
      setIsDeleting(false);
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

  const toggleActive = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const next = !product.isActive;
      await api.patch(`/api/products/${id}`, { isActive: next });
      alert(next ? "Product dipublish" : "Product disimpan sebagai draft");
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status produk");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Breadcrumb & Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <nav className="text-sm text-slate-500 mb-3">
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link> /{" "}
            <Link href="/admin/products" className="hover:text-blue-600 transition">Products</Link> /{" "}
            <span className="text-slate-700 font-medium">{product.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{product.name}</h1>
          <p className="text-sm text-slate-500 mt-2">{product.sku ? `SKU: ${product.sku}` : "No SKU"}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/products/${id}/edit`)}
            className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-medium shadow-md transition"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md transition disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden border bg-white shadow-md">
            <div className="relative w-full h-[420px] bg-gray-100">
              {images[selectedIndex] ? (
                <Image src={images[selectedIndex].url} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* thumbnails */}
            <div className="p-4 flex gap-3 flex-wrap">
              {images.length === 0 && <div className="text-sm text-slate-500">No images uploaded</div>}
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm transition ${
                    i === selectedIndex ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-slate-300"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img.url} alt={img.altText ?? product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md border">
            <h3 className="font-semibold text-xl text-slate-800 mb-3">Description</h3>
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              {product.description ?? <span className="text-slate-400">No description</span>}
            </div>
          </div>
        </div>

        {/* Side Info */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-500 uppercase">Price</div>
                <div className="text-2xl font-bold text-slate-900">Rp {Number(product.price).toLocaleString()}</div>
              </div>
              <div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                }`}>
                  {product.isActive ? "Published" : "Draft"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-slate-700">
              <div><span className="font-medium">Category:</span> {product.category?.name ?? "-"}</div>
              <div><span className="font-medium">Weight:</span> {product.weight_g ? `${product.weight_g} g` : "-"}</div>
              <div><span className="font-medium">Total stock:</span> {product.totalStock ?? 0}</div>
              <div><span className="font-medium">Created at:</span> {product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={toggleActive} className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition">Toggle Publish</button>
                <button onClick={copyId} className="px-3 py-1 rounded border text-sm hover:bg-slate-50 transition">Copy ID</button>
                <Link href={`/admin/products/${id}/export`} className="px-3 py-1 rounded border text-sm hover:bg-slate-50 transition">Export</Link>
              </div>
            </div>
          </div>

          {/* Stock per store */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h4 className="font-semibold mb-3 text-slate-800">Stock per Store</h4>
            {product.stocksPerStore?.length === 0 ? (
              <div className="text-sm text-slate-500">No stock info</div>
            ) : (
              <ul className="space-y-2 text-sm text-slate-700">
                {product.stocksPerStore.map((s) => (
                  <li key={s.storeId} className="flex justify-between border-b last:border-0 pb-1">
                    <span>{s.storeName ?? s.storeId}</span>
                    <span className="font-medium">{s.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Misc actions */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h4 className="font-semibold mb-3 text-slate-800">Actions & Info</h4>
            <div className="text-sm text-slate-700 space-y-2">
              <div><strong>ID:</strong> <code className="text-xs">{product.id}</code></div>
              <div><strong>Vendor / Store:</strong> {product.storeName ?? "-"}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
