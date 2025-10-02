import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { ProductDetail } from "../types/product";

const fetchProduct = async (id: string): Promise<ProductDetail> => {
  const res = await api.get(`/api/products/${id}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed fetching product");

  const raw = res.data.data ?? {};
  // DEBUG: lihat payload mentah di console (hapus nanti)
  console.log("[DEBUG] raw product from API:", raw);

  const normalized: Partial<ProductDetail> = {
    ...raw,
    // normalize weight_g => number | null
    weight_g:
      raw.weight_g !== undefined && raw.weight_g !== null && String(raw.weight_g).trim() !== ""
        ? Number(raw.weight_g)
        : null,
    // normalize price & images too
    price: raw.price !== undefined && raw.price !== null ? Number(raw.price) : 0,
    images: Array.isArray(raw.images) ? raw.images : [],
    createdAt: raw.createdAt ?? null,
  };

  // DEBUG: lihat normalized
  console.log("[DEBUG] normalized product:", normalized);

  return normalized as ProductDetail;
};

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
