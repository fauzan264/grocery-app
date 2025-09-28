import { axiosInstance } from "@/lib/axiosInstances";

const PAYMENT_URL = "/payment"

// 1. Gateway payment (Snap)
export const createGatewayPayment = async (orderId: string, token: string) => {
  const res = await axiosInstance.post(
    `${PAYMENT_URL}/gateway/${orderId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res?.data?.data; 
};

// Upload manual transfer proof
export const uploadPaymentProof = async (
  orderId: string,
  file: File,
  token: string
) => {
  const formData = new FormData();
  formData.append("paymentProof", file);

  const res = await axiosInstance.patch(
    `${PAYMENT_URL}/upload/${orderId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res?.data; 
};
