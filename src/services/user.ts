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
  email,
  phoneNumber,
  photoProfile,
  token,
}: IUser & {
  token: string;
}) => {
  const formData = new FormData();
  formData.append("full_name", String(fullName));
  formData.append("date_of_birth", String(dateOfBirth));
  formData.append("email", String(email));
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
  token,
  userId,
}: {
  token: string;
  userId: string;
}) => {
  return axiosInstance.get(`/users/${userId}/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
