import React, { useState } from "react";
import Image from "next/image";
import api from "@/lib/api";

export type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
};

export default function ImageGallery({
  images,
  productName,
  onDeleted,
}: {
  images: ProductImage[];
  productName?: string;
  onDeleted?: () => Promise<void> | void;
}) {
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  const handleDelete = async (imageId: string) => {
    if (!confirm("Hapus gambar ini?")) return;

    try {
      setDeletingIds((s) => ({ ...s, [imageId]: true }));

      // ambil token dari localStorage (sesuaikan auth flow aplikasi mu)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // endpoint sesuai productRouter: DELETE /api/products/images/:imageId
      const res = await api.delete(`/api/products/images/${imageId}`, { validateStatus: () => true });

      if (res.status === 200 || res.status === 204) {
        // sukses
        onDeleted && (await onDeleted());
        return;
      }

      // tangani status spesifik
      if (res.status === 401) return alert("Sesi berakhir. Silakan login ulang.");
      if (res.status === 403) return alert("Akses ditolak. Hanya SUPER_ADMIN yang dapat menghapus gambar.");
      // fallback: coba tampilkan pesan dari backend
      const backendMsg = res.data?.message ?? `Gagal menghapus (HTTP ${res.status})`;
      alert(backendMsg);
    } catch (err) {
      console.error("delete image error", err);
      alert("Terjadi kesalahan saat menghapus gambar. Cek console.");
    } finally {
      setDeletingIds((s) => {
        const next = { ...s };
        delete next[imageId];
        return next;
      });
    }
  };

  if (!images || images.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-6">Belum ada gambar</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((img) => {
        const isDeleting = Boolean(deletingIds[img.id]);
        return (
          <div key={img.id} className="relative rounded-md overflow-hidden border">
            <div className="w-full h-20 relative bg-gray-100">
              <Image src={img.url} alt={img.altText ?? productName ?? ""} fill className="object-cover" unoptimized />
            </div>

            <div className="p-2 flex items-center justify-between gap-2">
              <span className="text-xs text-gray-700 truncate">{img.isPrimary ? "Primary" : ""}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded disabled:opacity-60"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
