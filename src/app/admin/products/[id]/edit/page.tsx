"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProduct } from "@/app/hooks/useProduct";
import AdminProductForm from "@/components/products/AdminProductForm";
import ImageGallery from "@/components/products/ImageGallery";
import ImageUploader from "@/components/products/ImageUploader";
import StockEditor from "@/components/stocks/StockEditor";
import type { ProductDetail as FormProductDetail } from "@/components/products/AdminProductForm";

const queryClient = new QueryClient();

interface ApiProduct {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  price?: number;
  weight_g?: number | null;
  categoryId?: string | null;
  category?: { id: string };
  initialStock?: number | null;
  store?: { id: string };
  images?: ApiProductImage[];
}

interface ApiProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

function mapApiProductToForm(prod: ApiProduct): FormProductDetail {
  return {
    id: prod.id,
    name: prod.name,
    sku: prod.sku ?? undefined,
    description: prod.description ?? undefined,
    price: prod.price ?? 0,
    weight_g: prod.weight_g ?? undefined,
    categoryId: prod.category?.id ?? prod.categoryId ?? undefined,
    initialStock: prod.initialStock ?? undefined,
    storeId: prod.store?.id ?? undefined,
    images: (prod.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? "",
      isPrimary: Boolean(img.isPrimary),
    })),
  };
}

export default function ProductEditPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductEditInner />
    </QueryClientProvider>
  );
}

function ProductEditInner() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const { data: product, isLoading, isError, refetch } = useProduct(id);

  useEffect(() => {}, []);

  if (!id) return <div className="p-8 text-gray-900">Invalid product id</div>;
  if (isLoading) return <div className="p-8 text-gray-900">Loading product...</div>;
  if (isError || !product) return <div className="p-8 text-gray-900">Product not found</div>;

  const initialDataForForm = mapApiProductToForm(product);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? undefined : undefined;

  return (
    <div className="p-8 min-h-screen bg-slate-100 text-gray-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-700">
              Perbarui data produk, gambar, dan stok.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/products`)}
              className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50 text-gray-800"
            >
              Back to list
            </button>
            <button
              onClick={() => router.push(`/admin/products/${id}`)}
              className="px-3 py-1 bg-gray-900 text-white rounded text-sm hover:bg-gray-700"
            >
              View detail
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: images */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Images</h3>
              <ImageGallery
                images={initialDataForForm.images ?? []}
                productName={initialDataForForm.name}
                onDeleted={async () => {
                  await refetch();
                }}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Upload Images</h3>
              <ImageUploader
                productId={id}
                token={token}
                onUploaded={async () => {
                  await refetch();
                }}
              />
            </div>

            <div className="bg-white rounded-xl shadow p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Stocks</h3>
              <StockEditor productId={id} token={token} />
            </div>
          </aside>

          {/* Right column: main form */}
          <main className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <AdminProductForm
                token={token}
                initialData={initialDataForForm}
                onSaved={async () => {
                  await refetch();
                  alert("Perubahan tersimpan");
                  router.push(`/admin/products/${id}`);
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
