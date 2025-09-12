"use client";

import { sessionLogin } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, setAuth } = useAuthStore();

  const onAuthSessionLogin = async () => {
    try {
      const response = await sessionLogin({ token });

      setAuth({
        token,
        id: response?.data.data.id,
        fullName: response?.data.data.full_name,
        role: response?.data.data.role,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      onAuthSessionLogin();
    }
  }, [token]);

  return <>{children}</>;
}
