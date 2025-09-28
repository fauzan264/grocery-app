import { OrderStatus } from "@/features/orders/type";

export const normalizeOrderStatus = (status: string | number): OrderStatus => {
  if (typeof status === "number") return status as OrderStatus;
  return OrderStatus[status as keyof typeof OrderStatus];
};
