import { IUser } from "@/features/user/type";
import { axiosInstance } from "@/lib/axiosInstances";

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
