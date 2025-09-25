"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminProductForm from "@/components/products/AdminProductForm";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

export default function CreateProductPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateInner />
    </QueryClientProvider>
  );
}

function CreateInner() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? undefined : undefined;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create Product</h1>
          <p className="text-sm text-slate-500">Tambahkan produk baru ke katalog.</p>
        </div>

        <AdminProductForm
          token={token}
          onSaved={async () => {
            // setelah berhasil, redirect ke list / atau detail
            alert("Produk berhasil dibuat");
            router.push("/admin/products");
          }}
        />
      </div>
    </div>
  );
}
