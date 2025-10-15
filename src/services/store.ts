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
  provinceId,
  cityId,
  districtId,
  address,
  latitude,
  longitude,
  logo,
  token,
}: Omit<IStore, "id" | "status"> & {
  token: string;
}) => {
  const formData = new FormData();
  if (logo) {
    formData.append("logo", logo);
  }

  formData.append("name", String(name));
  formData.append("description", String(description));
  formData.append("province_id", String(provinceId));
  formData.append("city_id", String(cityId));
  formData.append("district_id", String(districtId));
  formData.append("address", String(address));
  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));

  return axiosInstance.post(STORES_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStore = ({
  id,
  name,
  description,
  provinceId,
  cityId,
  districtId,
  address,
  latitude,
  longitude,
  logo,
  status,
  token,
}: IStore & { token: string }) => {
  const formData = new FormData();
  if (logo) {
    formData.append("logo", logo);
  }

  formData.append("name", String(name));
  formData.append("description", String(description));
  formData.append("province_id", String(provinceId));
  formData.append("city_id", String(cityId));
  formData.append("district_id", String(districtId));
  formData.append("address", String(address));
  formData.append("latitude", String(latitude));
  formData.append("longitude", String(longitude));
  formData.append("status", String(status));

  return axiosInstance.put(`${STORES_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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

export const getStoreAdmins = ({
  id,
  name,
  page,
  limit,
  token,
}: {
  id: string;
  name: string;
  page: number;
  limit: number;
  token: string;
}) => {
  return axiosInstance.get(`/stores/${id}/assign-user`, {
    params: { name, page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteStoreAdmin = ({
  id,
  userId,
  token,
}: {
  id: string;
  userId: string;
  token: string;
}) => {
  return axiosInstance.delete(`${STORES_URL}/${id}/assign-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
