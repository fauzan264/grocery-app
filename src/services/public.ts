import { axiosInstance } from "@/lib/axiosInstances";

interface IGetStoreNearbyParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export const getPublicStoreNearby = async ({
  latitude,
  longitude,
  radius,
}: IGetStoreNearbyParams) => {
  return await axiosInstance.get("/public/stores/nearby", {
    params: {
      latitude,
      longitude,
      radius,
    },
  });
};

export const getPublicStoreById = ({ id }: { id: string }) => {
  return axiosInstance.get(`/public/stores/${id}`);
};
