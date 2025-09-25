"use client";
import React, { useEffect, useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import Image from "next/image";
import { api } from "../../lib/api";

type ProductImage = { id: string; url: string; isPrimary?: boolean; altText?: string | null };
export type ProductDetail = {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  weight_g?: number;
  categoryId?: string | null;
  initialStock?: number;
  storeId?: string | null;
  images?: ProductImage[];
};

type FormValues = {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  weight_g?: number;
  categoryId?: string | null;
  initialStock?: number;
  storeId?: string | null;
};

export default function AdminProductForm({
  initialData,
  token,
  onSaved,
}: {
  initialData?: ProductDetail;
  token?: string;
  onSaved?: (res: ProductDetail) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      sku: initialData?.sku ?? "",
      description: initialData?.description ?? "",
      price: initialData ? Number(initialData.price) : 0,
      weight_g: initialData?.weight_g ?? 0,
      categoryId: initialData?.categoryId ?? null,
      initialStock: undefined,
      storeId: initialData?.storeId ?? null,
    },
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(
    initialData?.images?.find((i) => i.isPrimary)?.id ?? null
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setExistingImages(initialData?.images ?? []);
    setPrimaryImageId(initialData?.images?.find((i) => i.isPrimary)?.id ?? null);
  }, [initialData]);

  // watch nama untuk validasi unik (sama seperti sebelumnya)
  const watchName = watch("name");
  useEffect(() => {
    if (!watchName || watchName.trim().length < 2) {
      clearErrors("name");
      return;
    }
    let mounted = true;
    const t = setTimeout(async () => {
      try {
        const res = await api.get("/api/products", { params: { search: watchName.trim(), limit: 10 } });
        if (!mounted) return;
        const items: ProductDetail[] = res.data?.items ?? res.data?.data ?? [];
        const nameExists = items.some(
          (p) => p.name?.toLowerCase() === watchName.trim().toLowerCase() && p.id !== initialData?.id
        );
        if (nameExists) setError("name", { type: "validate", message: "Nama produk sudah digunakan" });
        else clearErrors("name");
      } catch (err) {
        console.warn("Name check failed", err);
      }
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [watchName, initialData?.id, setError, clearErrors]);

  const handleToggleRemove = (id: string) => {
    setRemoveImageIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // jika kita menandai primary untuk di-remove, reset primary
      if (next.includes(id) && primaryImageId === id) setPrimaryImageId(null);
      return next;
    });
  };

  const submitCreate = async (values: FormValues) => {
    setIsSubmitting(true);
    clearErrors();
    setLocalError(null);

    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("price", String(values.price ?? 0));
      if (values.sku) fd.append("sku", values.sku);
      if (values.description) fd.append("description", values.description);
      if (values.categoryId) fd.append("categoryId", values.categoryId);
      if (values.weight_g) fd.append("weight_g", String(values.weight_g));
      if (values.initialStock) fd.append("initialStock", String(values.initialStock));
      if (values.storeId) fd.append("storeId", String(values.storeId));

      // hanya kirimkan instruksi terkait gambar — upload actual dilakukan oleh komponennya sendiri
      if (primaryImageId) fd.append("primaryImageId", primaryImageId);
      if (removeImageIds.length) fd.append("removeImageIds", JSON.stringify(removeImageIds));

      const finalToken = token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (finalToken) api.defaults.headers.common["Authorization"] = `Bearer ${finalToken}`;
      else delete api.defaults.headers.common["Authorization"];

      let res;
      if (initialData?.id) res = await api.patch(`/api/products/${initialData.id}`, fd);
      else res = await api.post("/api/products", fd);

      if (res.data?.success) {
        // update state gambar kalau server mengembalikan data baru
        const returned: ProductDetail | undefined = res.data?.data;
        if (returned?.images) setExistingImages(returned.images);
        // reset remove list
        setRemoveImageIds([]);
        setLocalError(null);
        onSaved?.(res.data.data as ProductDetail);
      } else {
        const msg = res.data?.message ?? "Unknown error";
        setLocalError(msg);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setLocalError(err.message ?? "Submission failed");
      else if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error safe best effort to extract axios response
        setLocalError(err.response?.data?.message ?? "Submission failed");
      } else setLocalError("Submission failed");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitCreate)}
      className="max-w-2xl mx-auto space-y-6 p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200"
    >
      {/* Name & SKU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">Name</label>
          <input
            {...register("name", { required: "Nama wajib diisi" })}
            className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan nama produk"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{(errors.name as FieldError).message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">SKU</label>
          <input
            {...register("sku")}
            className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Masukkan SKU (opsional)"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-800">Price</label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true, required: "Harga wajib diisi" })}
          className="border border-gray-300 rounded-lg p-3 w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Masukkan harga produk"
        />
        {errors.price && <p className="text-red-600 text-sm mt-1">{(errors.price as FieldError).message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-800">Description</label>
        <textarea
          {...register("description")}
          className="border border-gray-300 rounded-lg p-3 w-full h-28 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
          placeholder="Deskripsi produk"
        />
      </div>

      {/* Existing Images management (no upload here) */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-800">Images</label>

        <div className="flex flex-wrap gap-4 mt-2 max-h-48 overflow-y-auto">
          {existingImages.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada gambar untuk produk ini.</div>
          ) : (
            existingImages.map((img) => {
              const removed = removeImageIds.includes(img.id);
              return (
                <div
                  key={img.id}
                  className={`relative w-28 h-28 border rounded-xl overflow-hidden flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                    removed ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-24 h-24 relative">
                    <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover rounded-lg" unoptimized />
                  </div>

                  <div className="flex flex-col items-center mt-1 text-xs text-gray-700">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" checked={removed} onChange={() => handleToggleRemove(img.id)} />
                      Remove
                    </label>

                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="primary"
                        checked={primaryImageId === img.id}
                        onChange={() => setPrimaryImageId(img.id)}
                        disabled={removed}
                      />
                      Primary
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {localError && <p className="text-red-600 mt-2">{localError}</p>}
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 font-semibold shadow-lg"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
