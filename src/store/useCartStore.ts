
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItems } from "@/features/cart/components/type";


interface ICartStoreState {
  cartItems: ICartItems[];
}

interface ICartStore extends ICartStoreState {
  setCartItems: (items: ICartItems[]) => void;
  addItem: (item: ICartItems) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<ICartItems>) => void;
  clearCart: () => void;
}

const useCartStore = create<ICartStore>()(
  persist(
    (set) => ({
      cartItems: [],

      setCartItems: (items) => set({ cartItems: items }),

      addItem: (item) =>
        set((state) => ({
          cartItems: [...state.cartItems, item],
        })),

      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      updateItem: (id, updated) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, ...updated } : item
          ),
        })),

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage", 
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);

export default useCartStore;
