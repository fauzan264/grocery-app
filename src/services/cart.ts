import { ICartItems } from "@/features/cart/components/type";
import { axiosInstance } from "@/lib/axiosInstances";

export const getCartItems = async (token: string): Promise<ICartItems[]> => {
  const res = await axiosInstance.get("/cart/items", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.items;
};


export const updateCartItemQty = async (
  id: string,
  action: "increment" | "decrement",
  token: string,
) => {
  const res = await axiosInstance.patch(
    "/cart/items",
    { id, action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};



export const deleteCartItem = async (id: string, token: string) => {
  const res = await axiosInstance.delete(`/cart/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
