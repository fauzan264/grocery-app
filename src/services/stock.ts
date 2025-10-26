import { axiosInstance } from "@/lib/axiosInstances";
import axios from "axios";

const ORDER_URL ="/stocks"
interface StockRequestPayload {
  productId: string;
  storeId: string;
  orderId?: string;
  quantity: number;
}

export const requestStock = async (payload: StockRequestPayload, token: string) => {
  const res = await axiosInstance.post(`${ORDER_URL}/request`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data; 
};
