import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { ProductDetail } from "../types/product";

const fetchProduct = async (id: string) => {
  const res = await api.get(`/api/products/${id}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed fetching product");
  return res.data.data as ProductDetail;
};

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
