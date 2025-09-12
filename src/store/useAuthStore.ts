import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseAuthStoreState {
  id: string;
  fullName: string;
  role: string;
  token: string;
}

interface IUseAuthStore extends IUseAuthStoreState {
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
    }
  )
);

export default useAuthStore;
