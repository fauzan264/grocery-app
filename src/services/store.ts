import { IStore } from "@/features/admin/store/types";
import { axiosInstance } from "@/lib/axiosInstances";
import snakecaseKeys from "snakecase-keys";

const STORES_URL = "/stores";

export const getStores = ({
  name,
  page,
  limit,
  token,
}: Pick<IStore, "name"> & { page: number; limit: number; token: string }) => {
  return axiosInstance.get(STORES_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      name,
      page,
      limit,
    },
  });
};

export const getStoreById = ({ id, token }: { id: string; token: string }) => {
  return axiosInstance.get(`${STORES_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStore = ({
  name,
  description,
  province_id,
  city_id,
  district_id,
  address,
  latitude,
  longitude,
  logo,
  token,
}: Omit<IStore, "id" | "status"> & {
  token: string;
}) => {
  const formData = new FormData();
  formData.append("name", String(name));
  formData.append("description", String(description));
  formData.append("city", String(province_id));
  formData.append("province", String(city_id));
  formData.append("subdistrict", String(district_id));
  formData.append("address", String(address));
  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("logo", String(logo));

  return axiosInstance.post(STORES_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStore = ({
  id,
  name,
  description,
  province_id,
  city_id,
  district_id,
  address,
  latitude,
  longitude,
  logo,
  status,
  token,
}: IStore & { token: string }) => {
  const formData = new FormData();
  formData.append("name", String(name));
  formData.append("description", String(description));
  formData.append("city", String(province_id));
  formData.append("province", String(city_id));
  formData.append("subdistrict", String(district_id));
  formData.append("address", String(address));
  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("logo", String(logo));
  formData.append("status", String(status));

  return axiosInstance.put(`${STORES_URL}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteStore = ({ id, token }: { id: string; token: string }) => {
  return axiosInstance.delete(`${STORES_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const assignStoreAdmin = ({
  id,
  userId,
  token,
}: {
  id: string;
  userId: string;
  token: string;
}) => {
  return axiosInstance.post(
    `${STORES_URL}/${id}/assign-user`,
    snakecaseKeys({ userId }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
