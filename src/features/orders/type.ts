export interface ICreateOrderPayload {
  storeId: string;
  couponCodes: string[];
  paymentMethod: PaymentMethod;
}


export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  SNAP = "SNAP",
}
