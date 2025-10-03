import { axiosInstance } from "@/lib/axiosInstances";
import axios from "axios";

const SHIPPING_URL = "/shipping";

export const getProvinces = () => {
  return axiosInstance.get(`${SHIPPING_URL}/provinces`);
};

export const getProvinceById = ({ id }: { id: string }) => {
  return axiosInstance.get(`${SHIPPING_URL}/provinces/${id}`);
};

export const getCities = ({
  provinceId,
  cityId,
}: {
  provinceId: number;
  cityId?: number | undefined;
}) => {
  return axiosInstance.get(`${SHIPPING_URL}/cities/${provinceId}`, {
    params: {
      city_id: cityId,
    },
  });
};

export const getDistricts = ({
  cityId,
  districtId,
}: {
  cityId: number;
  districtId?: number | undefined;
}) => {
  return axiosInstance.get(`${SHIPPING_URL}/districts/${cityId}`, {
    params: {
      district_id: districtId,
    },
  });
};

export const getDomesticDestination = ({ search }: { search: string }) => {
  return axiosInstance.get(`${SHIPPING_URL}/destination/domestic-destination`, {
    params: { search, limit: 10, offset: 0 },
  });
};

export const getShippingCost = ({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: string;
  destination: string;
  weight: string;
  courier: string;
}) => {
  return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shipping-cost`, {
    origin,
    destination,
    weight,
    courier,
  });
};
