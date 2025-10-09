import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseAuthStoreState {
  id: string;
  fullName: string;
  role: string;
  token: string;
}

interface IUseAuthStore extends IUseAuthStoreState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: ({ token, id, fullName, role }: IUseAuthStoreState) => void;
  logout: () => void;
}

const useAuthStore = create<IUseAuthStore>()(
  persist(
    (set) => ({
      token: "",
      id: "",
      fullName: "",
      role: "",
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      setAuth: ({
        token,
        id,
        fullName,
        role,
      }: {
        token: string;
        id: string;
        fullName: string;
        role: string;
      }) => {
        set({ token, id, fullName, role });
      },
      logout: () => {
        set({ token: "", id: "", fullName: "", role: "" });
        localStorage.removeItem("authToken");
      },
    }),
    {
      name: "authToken",
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
