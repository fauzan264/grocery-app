"use client";
import UserProfileTabs from "@/features/user/components/UserProfileTabs";
import { IUser } from "@/features/user/type";
import { myProfile } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import camelcaseKeys from "camelcase-keys";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ProfileAdminPage() {
  const { _hasHydrated, token, id } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<IUser | undefined>(undefined);
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);

  const onGetProfile = async ({ token }: { token: string }) => {
    const response = await myProfile({ token });

    setProfile(camelcaseKeys(response.data.data));
  };

  useEffect(() => {
    if (!_hasHydrated || !token || hasShownToast.current) return;

    hasShownToast.current = true; // ✅ kunci supaya tidak double

    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) toast.success(success);
    if (error) toast.error(error);

    if (success || error) {
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }

    onGetProfile({ token });
  }, [_hasHydrated, token]);
  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Profile Management</h1>
      <UserProfileTabs profile={profile} token={token} userId={id} />
    </div>
  );
}
