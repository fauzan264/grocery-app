import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IOrderResponse } from "@/features/orders/type";

interface IOrderStore {
    currentOrder: IOrderResponse | null;
    setCurrentOrder: (order: IOrderResponse) => void;
    orders : IOrderResponse[]
}

export const useOrderStore = create<IOrderStore>()(
    persist(
        (set) => ({
            currentOrder: null,
            orders: [],
            
            setCurrentOrder: (order) => set({ currentOrder: order }),
        }),
        {
            name: "order-store",
        }
    )
);
