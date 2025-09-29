import { ICreateOrderPayload, IOrderResponse } from "@/features/orders/type";
import { axiosInstance } from "@/lib/axiosInstances";

const ORDER_URL = "/orders";


export const createOrders = async (
  payload: ICreateOrderPayload,
  token: string
): Promise<IOrderResponse> => {
  const res = await axiosInstance.post<{ data: IOrderResponse }>(
    `${ORDER_URL}/checkout`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.data;
};

export const getOrderDetail = async (
    orderId: string,
    token: string
) => {
  const res = await axiosInstance.get(
    `${ORDER_URL}/${orderId}/detail`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data.data;
}

export const getUsersOrderList = async (token : string) => {
  const res = await axiosInstance.get (`${ORDER_URL}/me`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res?.data?.data
}



