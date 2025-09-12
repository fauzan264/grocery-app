import { axiosInstance } from "@/lib/axiosInstances";
import snakecaseKeys from "snakecase-keys";

export const register = ({
  fullName,
  email,
  phoneNumber,
}: {
  fullName: string;
  email: string;
  phoneNumber: string;
}) => {
  return axiosInstance.post(
    "/auth/register",
    snakecaseKeys({
      fullName,
      email,
      phoneNumber,
    })
  );
};

export const verifyEmail = ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  return axiosInstance.post(
    "/auth/verify-email",
    {
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
