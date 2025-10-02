import { api } from "@/lib/api";

export type ImageRef = {
  url: string;
  publicId?: string | null;
  isPrimary?: boolean;
  alt?: string | null;
};

export type CreateProductInput = {
  name: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  weight_g?: number | null;
  categoryId?: string | null;
  images?: ImageRef[];
};

export type CreateStockInput = {
  productId: string;
  storeId: string;
  qty: number;
};

export async function createProduct(payload: CreateProductInput) {
  const res = await api.post("/api/products", payload);
  return res.data;
}

export async function deleteProduct(productId: string) {
  return api.delete(`/api/products/${productId}`);
}

export async function createStock(payload: CreateStockInput) {
  return api.post("/api/stocks", payload);
}
