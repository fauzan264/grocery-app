import { axiosInstance } from "@/lib/axiosInstances";
import snakecaseKeys from "snakecase-keys";

const AUTH_URL = "/auth";

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
    `${AUTH_URL}/register`,
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
    `${AUTH_URL}/verify-email`,
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

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return axiosInstance.post(`${AUTH_URL}/login`, {
    email,
    password,
  });
};

export const sessionLogin = ({ token }: { token: string }) => {
  return axiosInstance.get(`${AUTH_URL}/session`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const requestResetPassword = ({ email }: { email: string }) => {
  return axiosInstance.post(`${AUTH_URL}/request-reset-password`, {
    email,
  });
};

export const resetPassword = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return axiosInstance.post(
    `${AUTH_URL}/reset-password`,
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
