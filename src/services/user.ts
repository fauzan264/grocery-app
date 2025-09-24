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
}: {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  photoProfile: File;
  token: string;
}) => {
  const formData = new FormData();
  formData.append("full_name", String(fullName));
  formData.append("date_of_birth", String(dateOfBirth));
  formData.append("email", String(email));
  formData.append("phone_number", String(phoneNumber));
  formData.append("photo_profile", photoProfile);

  return axiosInstance.put(`/users/me`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
