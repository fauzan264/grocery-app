import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Product } from "../types/product";

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
};

export const fetchProducts = async (params: ListParams = {}) => {
  const res = await api.get("/api/products", { params });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed fetching products");
  return { items: res.data.data as Product[], meta: res.data.meta };
};

export function useProducts(params: ListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev, 
    staleTime: 1000 * 60, // 1 menit
  });
}
