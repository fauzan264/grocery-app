import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IOrderResponse } from "@/features/orders/type";
import { RajaOngkirDataResponse } from "@/features/shipping/types";
import { IAddress } from "@/features/user/address/types";

interface IOrderStore {
    currentOrder: IOrderResponse | null;
    setCurrentOrder: (order: IOrderResponse) => void;
    clearCurrentOrder: () => void;

    orders: IOrderResponse[];
    setOrders: (orders: IOrderResponse[]) => void;

    currentShipping: RajaOngkirDataResponse | null;
    setCurrentShipping: (shipping: RajaOngkirDataResponse | null) => void;

    currentAddress: IAddress | null;                
    setCurrentAddress: (address: IAddress | null) => void; 
}

export const useOrderStore = create<IOrderStore>()(
    persist(
        (set) => ({
            currentOrder: null,
            orders: [],
            currentShipping: null,
            currentAddress: null,

            setCurrentOrder: (order) => set({ currentOrder: order }),
            clearCurrentOrder: () => set({ currentOrder: null }),
            setOrders: (orders) => set({ orders }),
            setCurrentShipping: (shipping) => set({ currentShipping: shipping }),
            setCurrentAddress: (address) => set({ currentAddress: address }),
        }),
        { name: "order-store" }
    )
);
