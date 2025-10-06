"use client";

import { getPublicStoreById, getPublicStoreNearby } from "@/services/public";
import useLocationStore from "@/store/useLocationStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface LocationProviderProps {
  children: React.ReactNode;
  autoFetchStore?: boolean;
  defaultLocation?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  useDefaultOnError?: boolean;
}

export default function LocationProvider({
  children,
  autoFetchStore = true,
  defaultLocation = {
    latitude: -6.2088,
    longitude: 106.8456,
    radius: 15,
  },
  useDefaultOnError = true,
}: LocationProviderProps) {
  const {
    latitude,
    longitude,
    setLocation,
    setSelectedStore,
    setLoadingLocation,
    setLoadingStore,
    setLocationError,
    setStoreError,
  } = useLocationStore();

  const [hasRequested, setHasRequested] = useState(false);

  // fetch 1 store
  const fetchNearestStore = async (lat: number, lng: number) => {
    try {
      setLoadingStore(true);
      const response = await getPublicStoreNearby({
        latitude: lat,
        longitude: lng,
        radius: 15,
      });

      const nearbyStores = response.data.data;

      if (!nearbyStores || nearbyStores.length === 0) {
        setSelectedStore(null);
        setLoadingStore(false);
        return;
      }

      const nearestStore = nearbyStores[0];

      const detailResponse = await getPublicStoreById({ id: nearestStore.id });
      const storeDetail = detailResponse.data.data;

      const fullStoreData = {
        ...storeDetail,
        distance: nearestStore.distance,
      };

      setSelectedStore(fullStoreData);

      setLoadingStore(false);
    } catch (error) {
      const errMessage = `Failed get store data: ${error}`;
      setStoreError(errMessage);
      toast.error(errMessage);
    }
  };

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      const errMessage = "Geolocation is not supported by your browser";
      setLocationError(errMessage);
      toast.error(errMessage);
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation(lat, lng);

        if (autoFetchStore) {
          await fetchNearestStore(lat, lng);
        }

        setLoadingLocation(false);
      },
      (error) => {
        let errMessage = "Failed to get location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errMessage = "Location access denied. Using default location.";
            break;
          case error.POSITION_UNAVAILABLE:
            errMessage =
              "Location information is not available. Using default location.";
            break;
          case error.TIMEOUT:
            errMessage = "Location request timed out. Using default location.";
            break;
        }

        setLocationError(errMessage);
        setLoadingLocation(false);
        toast.warning(errMessage);

        if (useDefaultOnError) {
          setDefaultLocation();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const setDefaultLocation = () => {
    const { latitude: defaultLat, longitude: defaultLng } = defaultLocation;

    setLocation(defaultLat, defaultLng);

    if (autoFetchStore) {
      fetchNearestStore(defaultLat, defaultLng);
    }
  };

  useEffect(() => {
    if (!latitude && !longitude && !hasRequested) {
      setHasRequested(true);
      requestLocationPermission();
    }
  }, [latitude, longitude, hasRequested]);

  return <>{children}</>;
}
