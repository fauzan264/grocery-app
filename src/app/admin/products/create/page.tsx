"use client";

import React, { useState } from "react";
import ProductForm from "@/components/products/CreateProductForm";
import ProductImages from "@/components/products/ProductImages";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { PackagePlus, ArrowLeft } from "lucide-react";

export type ProductFormData = {
  name: string;
  sku: string;
  description?: string;
  price: string;
  weight_g: number;
  categoryId: string;
};

export default function CreateProductPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const resolveToken = (): string | undefined => {
    const authHeader = api.defaults?.headers?.common?.Authorization as
      | string
      | undefined;
    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length === 2) return parts[1];
      return authHeader;
    }
    try {
      if (typeof window !== "undefined") {
        return (localStorage.getItem("token") ?? undefined) as
          | string
          | undefined;
      }
    } catch {}
    return undefined;
  };

  const handleSubmit = async (form: ProductFormData) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("sku", form.sku?.trim() ?? "");
      if (form.description) fd.append("description", form.description.trim());
      fd.append("price", String(Number(form.price)));
      fd.append("weight_g", String(Number(form.weight_g)));
      fd.append("categoryId", form.categoryId);

      images.forEach((file) => fd.append("images", file));

      const token = resolveToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await api.post("/api/products", fd, { headers });

      alert("Product berhasil dibuat!");
      router.push("/admin/products");
    } catch (err) {
      console.error("Create product error:", err);
      alert("Gagal membuat product, cek console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-2xl">
            <PackagePlus className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Create Product
          </h1>
        </div>

        {/* Tombol Back */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <ProductForm
            onSubmit={handleSubmit}
            loading={loading}
            inputClassName="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </motion.div>

        {/* Image Upload */}
        <ProductImages images={images} setImages={setImages} />
      </div>
    </div>
  );
}
