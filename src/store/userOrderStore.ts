import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IOrderResponse } from "@/features/orders/type";

interface IOrderStore {
    currentOrder: IOrderResponse | null;
    setCurrentOrder: (order: IOrderResponse) => void;
    clearCurrentOrder: () => void;
    orders: IOrderResponse[];
    setOrders: (orders: IOrderResponse[]) => void;
}

export const useOrderStore = create<IOrderStore>()(
    persist(
        (set) => ({
            currentOrder: null,
            orders: [],
            setCurrentOrder: (order) => set({ currentOrder: order }),
            clearCurrentOrder: () => set({ currentOrder: null }),
            setOrders: (orders) => set({ orders }),
        }),
        { name: "order-store" }
    )
);
