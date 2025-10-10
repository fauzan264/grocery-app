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

export const changePassword = ({
  oldPassword,
  newPassword,
  token,
}: {
  oldPassword: string;
  newPassword: string;
  token: string;
}) => {
  return axiosInstance.post(
    `/auth/change-password`,
    snakecaseKeys({ oldPassword, newPassword }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const resendVerificationEmail = ({ token }: { token: string }) => {
  return axiosInstance.post(
    "/auth/email/resend-verification",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const resendVerificationRegister = ({ email }: { email: string }) => {
  return axiosInstance.post("/auth/register/resend-verification", { email });
};

export const validateToken = ({ token }: { token: string }) => {
  return axiosInstance.post(
    "/auth/validate",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const changeEmail = ({
  newEmail,
  password,
  token,
}: {
  newEmail: string;
  password: string;
  token: string;
}) => {
  return axiosInstance.post(
    "/auth/email/change",
    snakecaseKeys({ newEmail, password }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyChangeEmail = ({ token }: { token: string }) => {
  return axiosInstance.post(
    "/auth/email/verify-email",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
