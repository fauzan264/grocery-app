import { axiosInstance } from "@/lib/axiosInstances";

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

export const getSubdistricts = ({ districtId }: { districtId: number }) => {
  return axiosInstance.get(`${SHIPPING_URL}/subdistricts/${districtId}`);
};

export const getDomesticDestination = ({ search }: { search: string }) => {
  return axiosInstance.get(`${SHIPPING_URL}/destination/domestic-destination`, {
    params: { search, limit: 10, offset: 0 },
  });
};
