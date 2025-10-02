"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ProductDetailInner from "@/components/products/ProductDetailInner";

export default function ProductDetailPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductDetailInner />
    </QueryClientProvider>
  );
}
