import { axiosInstance } from "@/lib/axiosInstances";

const ORDER_URL = "/admin/orders";

export const getStoreOrderList = async (token: string, filters?: {
  storeId?: string;
}) => {
  const res = await axiosInstance.get(`${ORDER_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res?.data.data;
};

export const getOrderDetailAdmin = async (orderId: string, token : string) => {
  const res = await axiosInstance.get(`${ORDER_URL}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res?.data.data
}

export const approvePayment = async (orderId : string, token:string) => {
  const res = await axiosInstance.patch(`${ORDER_URL}/confirmPayment/${orderId}`,
    {},
    {headers: { Authorization: `Bearer ${token}` }}
  );
  return res?.data.data

}
export const declinePayment = async (orderId : string, token:string) => {
  const res = await axiosInstance.patch(`${ORDER_URL}/declinePayment/${orderId}`,
    {},
    {headers: { Authorization: `Bearer ${token}` }}
  );
  return res?.data.data
}

export const cancelOrderAdmin = async (orderId : string, token:string) => {
  const res = await axiosInstance.patch(`${ORDER_URL}/cancelOrder/${orderId}`,
    {},
    {headers: { Authorization: `Bearer ${token}` }}
  );
  return res?.data.data
}

export const getStatusLogs = async (orderId : string, token:string) => {
  const res = await axiosInstance.get(`${ORDER_URL}/${orderId}/statusLog`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res?.data.data
}