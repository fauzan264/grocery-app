import { OrderStatus } from "@/features/orders/type";

// 🧾 Payment method
export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  SNAP = "SNAP",
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  needGlobalStockRequest : boolean;
  imageUrl: string;
  subTotal: number;
}

;

export interface IOrderUser {
  fullName: string;
  phoneNumber: string;
  email : string
  adresses: string;
}

export interface IOrderStore {
  id: string;
  name: string;
}


export interface IOrderAdminResponse {
  orderId: string;
  storeId: string;
  status: OrderStatus;
  totalPrice: number;
  discount: number;
  shipment : number;
  finalPrice: number;
  paymentMethod: PaymentMethod;
  paymentProof: string;
  createdAt: string;
  customer: IOrderUser;
  items: IOrderItem[];
  store: IOrderStore | null;
}

export interface IStatusLogs {
  id: string;
  orderId : string;
  oldStatus: string;
  newStatus: string;
  note: string ;
  changedBy: string 
  createdAt: string;
}
