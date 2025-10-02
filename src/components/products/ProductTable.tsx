"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "../../app/types/product";

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => Promise<void> | void;
  onBulkDelete?: (ids: string[]) => Promise<void> | void;
  onEdit?: (product: Product) => void;
}

export default function ProductTable({ products = [], onDelete, onBulkDelete }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));


  const toggleSelectAll = () => {
    if (allSelected) {
      // unselect all visible
      setSelectedIds((prev) => prev.filter((id) => !products.some((p) => p.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...products.filter((p) => !prev.includes(p.id)).map((p) => p.id),
      ]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
  };

  const handleBulkDeleteClick = async () => {
    if (!onBulkDelete) return console.log("Bulk delete handler not provided", selectedIds);
    if (selectedIds.length === 0) return;
    if (!confirm(`Hapus ${selectedIds.length} produk terpilih? Ini tidak bisa dibatalkan.`)) return;

    try {
      // ensure we support sync or async handlers
      await Promise.resolve(onBulkDelete(selectedIds));
      // clear selection after success
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete failed", err);
      // let parent handle error UI; here minimal fallback
      alert("Gagal menghapus beberapa produk. Cek console untuk detail.");
    }
  };

  const handleSingleDelete = async (id: string) => {
    if (!onDelete) return console.log("Delete handler not provided", id);
    if (!confirm("Hapus produk ini?")) return;
    try {
      await Promise.resolve(onDelete(id));
      // remove from selection if present
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Gagal menghapus produk.");
    }
  };

  return (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    {/* Bulk action bar */}
    {selectedIds.length > 0 && (
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <span className="text-sm text-gray-600 font-medium">
          {selectedIds.length} produk dipilih
        </span>
        <button
          onClick={handleBulkDeleteClick}
          className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
        >
          Hapus Terpilih
        </button>
      </div>
    )}

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-left text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4"
              />
            </th>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                Belum ada produk
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const mainImage =
                product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
              const outOfStock = (product.totalStock ?? 0) <= 0;
              const isChecked = selectedIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition border-b last:border-b-0"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(product.id)}
                      className="h-4 w-4"
                    />
                  </td>

                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
                      {mainImage?.url ? (
                        <Image
                          src={mainImage.url}
                          alt={mainImage.altText ?? product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.name}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-gray-700">
                    {product.category?.name ?? "-"}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-gray-800">
                    Rp {Number(product.price ?? 0).toLocaleString()}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        outOfStock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {outOfStock ? "Out of stock" : String(product.totalStock ?? 0)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Edit now navigates to edit page */}
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="px-2 py-1 rounded bg-yellow-400 text-black text-xs hover:bg-yellow-500 transition-colors duration-200"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}`}
                        className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                      >
                        Detail
                      </Link>

                      <button
                        onClick={() => handleSingleDelete(product.id)}
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}
