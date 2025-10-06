import { IStoreLocation } from "@/features/admin/store/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseLocationStoreState {
  latitude: number | null;
  longitude: number | null;

  // nearby store data
  selectedStore: IStoreLocation | null;
  nearbyStores: IStoreLocation[];

  // loading states
  isLoadingLocation: boolean;
  isLoadingStore: boolean;

  // Errors
  locationError: string | null;
  storeError: string | null;
}

interface IUseLocationStore extends IUseLocationStoreState {
  setLocation: (latitude: number, longitude: number) => void;
  setSelectedStore: (store: IStoreLocation | null) => void;
  setNearbyStores: (stores: IStoreLocation[]) => void;
  setLoadingLocation: (isLoading: boolean) => void;
  setLoadingStore: (isLoading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setStoreError: (error: string | null) => void;
  clearLocation: () => void;
}

const useLocationStore = create<IUseLocationStore>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      nearbyStores: [],
      selectedStore: null,
      isLoadingLocation: false,
      isLoadingStore: false,
      locationError: null,
      storeError: null,

      setLocation: (latitude, longitude) => {
        set({ latitude, longitude, locationError: null });
      },

      setSelectedStore: (store) => {
        set({ selectedStore: store });
      },

      setNearbyStores: (stores) => {
        set({ nearbyStores: stores, storeError: null });
      },

      setLoadingLocation: (isLoading) => {
        set({ isLoadingLocation: isLoading });
      },

      setLoadingStore: (isLoading) => {
        set({ isLoadingStore: isLoading });
      },

      setLocationError: (error) => {
        set({ locationError: error, isLoadingLocation: false });
      },

      setStoreError: (error) => {
        set({ storeError: error, isLoadingStore: false });
      },

      clearLocation: () => {
        set({
          latitude: null,
          longitude: null,
          selectedStore: null,
          nearbyStores: [],
          locationError: null,
          storeError: null,
        });
      },
    }),
    {
      name: "location-storage",
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        selectedStore: state.selectedStore,
        nearbyStores: state.nearbyStores,
      }),
    }
  )
);

export default useLocationStore;
