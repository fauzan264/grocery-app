import { OrderStatus } from "@/features/orders/type";

export const getPaymentStatus = (orderStatus: OrderStatus) => {
  if (orderStatus === OrderStatus.WAITING_FOR_PAYMENT) {
    return { label: "Unpaid", type: "badge-error" }; // merah
  }
  return { label: "Paid", type: "badge-success" }; // hijau
};

