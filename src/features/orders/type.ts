import { IShipping } from "../shipping/types";

export interface ICreateOrderPayload {
  storeId: string;
  couponCodes: string[];
  paymentMethod: PaymentMethod;
  shipment : IShipping
}


export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  SNAP = "SNAP",
}

export interface IOrderItem {
  quantity: number;
  price: string;       
  subTotal: string;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface IOrderResponse {
  id: string;
  order_number : string;
  storeId: string;
  status: OrderStatus; 
  sub_total: number 
  discount: number 
  finalPrice: number 
  paymentMethod: string; 
  createdAt: string; 
  expiredAt : string;
  items: IOrderItem[];
  totalItems : number
  user: {
    receiverName: string;
    receiverPhone: string;
    shippingAddress: string;
  };
  shipment : IShipping
}

export enum OrderStatus {
  WAITING_FOR_PAYMENT,
  WAITING_CONFIRMATION_PAYMENT,
  IN_PROCESS,
  DELIVERED,
  ORDER_CONFIRMATION,
  CANCELLED
}

