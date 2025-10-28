import { IAddress } from "@/features/user/address/types";
import { IUser } from "@/features/user/type";
import { axiosInstance } from "@/lib/axiosInstances";
import snakecaseKeys from "snakecase-keys";

export const myProfile = ({ token }: { token: string }) => {
  return axiosInstance.get(`/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = ({
  fullName,
  dateOfBirth,
  phoneNumber,
  photoProfile,
  token,
}: Pick<IUser, "fullName" | "dateOfBirth" | "phoneNumber" | "photoProfile"> & {
  token: string;
}) => {
  const formData = new FormData();
  formData.append("full_name", String(fullName));
  formData.append("date_of_birth", String(dateOfBirth));
  formData.append("phone_number", String(phoneNumber));
  if (photoProfile) {
    formData.append("photo_profile", photoProfile);
  }

  return axiosInstance.put(`/users/me`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAddresses = ({
  search,
  provinceId,
  page,
  limit,
  token,
  userId,
}: {
  search?: string;
  provinceId?: number;
  token: string;
  userId: string;
  page: number;
  limit: number;
}) => {
  return axiosInstance.get(`/users/${userId}/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: snakecaseKeys({
      search,
      provinceId,
      page,
      limit,
    }),
  });
};

export const getAddressById = ({
  token,
  userId,
  addressId,
}: {
  token: string;
  userId: string;
  addressId: string;
}) => {
  return axiosInstance.get(`/users/${userId}/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAddress = ({
  token,
  userId,
  provinceId,
  cityId,
  districtId,
  address,
  latitude,
  longitude,
  isDefault,
}: Pick<
  IAddress,
  | "provinceId"
  | "cityId"
  | "districtId"
  | "address"
  | "latitude"
  | "longitude"
  | "isDefault"
> & {
  token: string;
  userId: string;
}) => {
  return axiosInstance.post(
    `/users/${userId}/addresses`,
    snakecaseKeys({
      provinceId,
      cityId,
      districtId,
      address,
      latitude,
      longitude,
      isDefault,
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateAddress = ({
  token,
  userId,
  id,
  provinceId,
  cityId,
  districtId,
  address,
  latitude,
  longitude,
  isDefault,
}: Pick<
  IAddress,
  | "id"
  | "provinceId"
  | "cityId"
  | "districtId"
  | "address"
  | "latitude"
  | "longitude"
  | "isDefault"
> & {
  token: string;
  userId: string;
}) => {
  return axiosInstance.put(
    `/users/${userId}/addresses/${id}`,
    snakecaseKeys({
      provinceId,
      cityId,
      districtId,
      address,
      latitude,
      longitude,
      isDefault,
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteAddress = ({
  token,
  userId,
  addressId,
}: {
  token: string;
  userId: string;
  addressId: string;
}) => {
  return axiosInstance.delete(`/users/${userId}/addresses/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUsers = ({
  q,
  role,
  token,
  isAvailable = false,
}: {
  q: string;
  role: string;
  token: string;
  isAvailable?: boolean;
}) => {
  return axiosInstance.get(`/users`, {
    params: snakecaseKeys({
      q,
      role,
      isAvailable,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMyStore = ({ token }: { token: string }) => {
  return axiosInstance.get(`/users/me/store`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
