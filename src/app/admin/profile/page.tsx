"use client";
import UserProfileComponent from "@/features/user/components/UserProfileComponent";
import { IUser } from "@/features/user/type";
import { myProfile } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import camelcaseKeys from "camelcase-keys";
import { useEffect, useState } from "react";

export default function ProfileAdminPage() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<IUser | undefined>(undefined);

  const onGetProfile = async ({ token }: { token: string }) => {
    const response = await myProfile({ token });

    setProfile(camelcaseKeys(response.data.data));
  };

  useEffect(() => {
    if (token) {
      onGetProfile({ token });
    }
  }, [token]);
  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Profile Management</h1>
      <UserProfileComponent profile={profile} />
    </div>
  );
}
