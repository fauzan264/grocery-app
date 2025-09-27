export interface ICreateOrderPayload {
  storeId: string;
  couponCodes: string[];
  paymentMethod: PaymentMethod;
}


export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  SNAP = "SNAP",
}

export interface IOrderResponse {
  id: string;
  storeId: string;
  status: OrderStatus; 
  sub_total: number 
  discount: number 
  finalPrice: number 
  paymentMethod: string; 
  createdAt: string; 
  user: {
    receiverName: string;
    receiverNumber: string;
    shippingAddress: string;
  };
}

export enum OrderStatus {
  INITIAL,
  WAITING_FOR_PAYMENT,
  WAITING_CONFIRMATION_PAYMENT,
  IN_PROCESS,
  DELIVERED,
  ORDER_CONFIRMATION,
  CANCELLED
}
