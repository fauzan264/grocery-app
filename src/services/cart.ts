import { AxiosInstance } from "axios";
import { ICartItems } from "@/features/cart/components/type";
import { axiosInstance } from "@/lib/axiosInstances";


// GET all cart items
export const getCartItems = async (token: string): Promise<ICartItems[]> => {
  const res = await axiosInstance.get("/cart/items", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.items;
};

// PATCH increment / decrement
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const updateCartItemQty = async (
  id: string,
  action: "increment" | "decrement",
  token: string,
  delayMs = 300
) => {
  await sleep(delayMs); 
  const res = await axiosInstance.patch(
    "/cart/items",
    { id, action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};


// DELETE item
export const deleteCartItem = async (id: string, token: string) => {
  const res = await axiosInstance.delete(`/cart/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
