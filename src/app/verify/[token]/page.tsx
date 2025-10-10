"use client";
import { verifyChangeEmail } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const { role } = useAuthStore();
  const router = useRouter();

  const onGetVerify = async ({ token }: { token: string }) => {
    try {
      const response = await verifyChangeEmail({ token });

      if (response.status == 200) {
        if (role == "CUSTOMER") {
          router.push(`/profile?success=${response.data.message}`);
        } else {
          router.push(`/admin/profile?success=${response.data.message}`);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data.message || "Something went wrong!";
        if (role == "CUSTOMER") {
          router.push(`/profile?error=${message}`);
        } else {
          router.push(`/admin/profile?error=${message}`);
        }
      } else {
        if (role == "CUSTOMER") {
          router.push(`/profile?error=Something went wrong!`);
        } else {
          router.push(`/admin/profile?error=Something went wrong!`);
        }
      }
    }
  };

  useEffect(() => {
    if (role) {
      onGetVerify({ token });
    }
  }, [role]);
  return null;
}
