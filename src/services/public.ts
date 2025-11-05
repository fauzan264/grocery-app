import { axiosInstance } from "@/lib/axiosInstances";
import camelcaseKeys from "camelcase-keys";
import { snakeCase } from "lodash";
import snakecaseKeys from "snakecase-keys";

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

export const getPublicProducts = async ({
  storeId,
  page,
  limit,
}: {
  storeId?: string;
  page?: string;
  limit?: string;
}) => {
  return await axiosInstance.get("/public/products", {
    params: snakecaseKeys({
      storeId,
      page,
      limit,
    }),
  });
};

export const getPublicProductById = async ({ id }: { id: string }) => {
  return await axiosInstance.get(`/public/products/${id}`);
};
