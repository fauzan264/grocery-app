"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";

export type ProductFormData = {
  name: string;
  sku: string;
  description?: string;
  price: string; // form menyimpan string, parent akan konversi ke number jika perlu
  weight_g: number;
  categoryId: string;
};

type Props = {
  onSubmit?: (data: ProductFormData) => void | Promise<void>;
  loading?: boolean;
  token?: string;
  inputClassName?: string;
};

type Category = { id: string; name: string };

export default function ProductForm({ onSubmit, loading: parentLoading }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    sku: "",
    description: "",
    price: "0",
    weight_g: 0,
    categoryId: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const isLoading = parentLoading ?? loading;

  // --- fetch categories ---
  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        const res = await api.get("/api/categories");
        console.debug("fetchCategories response:", res);

        const d = res?.data;
        let rawList: unknown[] = [];

        if (Array.isArray(d)) {
          rawList = d;
        } else if (Array.isArray(d?.data)) {
          rawList = d.data;
        } else if (Array.isArray(d?.data?.items)) {
          rawList = d.data.items;
        } else if (Array.isArray(d?.data?.categories)) {
          rawList = d.data.categories;
        } else if (Array.isArray(d?.items)) {
          rawList = d.items;
        } else if (Array.isArray(d?.data?.stores)) {
          rawList = d.data.stores;
        } else if (d?.success && Array.isArray(d?.data?.stores)) {
          rawList = d.data.stores;
        } else if (d?.data && typeof d.data === "object") {
          const maybeArr = Object.values(d.data).find((v) => Array.isArray(v));
          if (Array.isArray(maybeArr)) rawList = maybeArr;
        } else {
          console.warn("fetchCategories: unrecognized response shape", d);
        }

        const mapped: Category[] = rawList
          .map((item) => {
            if (typeof item !== "object" || item === null) return null;
            const obj = item as Record<string, unknown>;

            const id =
              obj["id"] ??
              obj["_id"] ??
              obj["categoryId"] ??
              obj["value"] ??
              obj["key"];

            const name =
              obj["name"] ??
              obj["title"] ??
              obj["label"] ??
              obj["categoryName"] ??
              id;

            if (!id) return null;
            return { id: String(id), name: String(name) };
          })
          .filter((item): item is Category => item !== null);

        if (mounted) setCategories(mapped);
      } catch (err) {
        console.error("fetchCategories error:", err);
        if (mounted) setCategories([]);
      }
    }

    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  // --- helper error normalizer ---
  function normalizeSubmitError(
    err: unknown
  ): { message?: string; fieldErrors?: Partial<Record<string, string>> } {
    if (!err) return {};

    try {
      const e = err as Record<string, unknown>;

      if (e?.fieldErrors && typeof e.fieldErrors === "object") {
        return {
          fieldErrors: e.fieldErrors as Partial<Record<string, string>>,
          message: typeof e.message === "string" ? e.message : undefined,
        };
      }

      if (e?.response && typeof e.response === "object") {
        const response = e.response as Record<string, unknown>;
        const d = response.data as Record<string, unknown> | undefined;

        if (d?.errors && typeof d.errors === "object") {
          return {
            fieldErrors: d.errors as Partial<Record<string, string>>,
            message: typeof d.message === "string" ? d.message : undefined,
          };
        }
        if (d?.message) return { message: String(d.message) };
        return { message: JSON.stringify(d) };
      }

      if (typeof e === "object" && e !== null) {
        if (typeof e["message"] === "string") {
          return { message: e["message"] as string };
        }
        return { message: JSON.stringify(e) };
      }

      return { message: String(e) };
    } catch {
      return { message: (err as Error)?.message ?? String(err) };
    }
  }

  // --- validasi realtime ---
  const validateField = (name: keyof ProductFormData, value: string | number) => {
    switch (name) {
      case "name":
        return String(value).trim() ? "" : "Name wajib diisi";
      case "sku":
        return String(value).trim() ? "" : "SKU wajib diisi";
      case "price":
        return Number(value) > 0 ? "" : "Price harus lebih dari 0";
      case "weight_g":
        return Number(value) > 0 ? "" : "Weight harus lebih dari 0";
      case "categoryId":
        return String(value).trim() ? "" : "Category wajib dipilih";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | number = value;

    if (name === "weight_g") {
      newValue = Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue as never, // tetap pakai never karena union
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof ProductFormData, newValue),
    }));
  };

  const handleSubmit = async () => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    (Object.keys(form) as (keyof ProductFormData)[]).forEach((key) => {
      const value = form[key];
      const err = validateField(key, value as string | number);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    if (!onSubmit) {
      alert("No submit handler. Form siap namun parent belum menyediakan onSubmit.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...form });
    } catch (err: unknown) {
      console.error("onSubmit handler error (form):", err);
      const normalized = normalizeSubmitError(err);
      if (normalized.fieldErrors) {
        const mapped: Partial<Record<keyof ProductFormData, string>> = {};
        Object.entries(normalized.fieldErrors).forEach(([k, v]) => {
          if (k in form) mapped[k as keyof ProductFormData] = String(v ?? "");
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      }
      if (normalized.message) {
        alert(normalized.message);
      } else {
        alert("Terjadi error saat submit. Cek console untuk detail.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Product Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}
            `}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.sku ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}
            `}
            placeholder="Enter SKU"
          />
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.price ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}
            `}
            placeholder="0"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Weight (g)</label>
          <input
            type="number"
            name="weight_g"
            value={form.weight_g}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition
              ${errors.weight_g ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}
            `}
            placeholder="0"
          />
          {errors.weight_g && <p className="text-red-500 text-sm mt-1">{errors.weight_g}</p>}
        </div>

        {/* Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-800 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            rows={4}
            placeholder="Enter product description"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-800 font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 transition
              ${errors.categoryId ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"}
            `}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-8 w-full md:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 transition disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
