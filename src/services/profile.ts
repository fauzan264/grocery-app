import { IAddress } from "@/features/user/address/types";
import { axiosInstance } from "@/lib/axiosInstances";

const USER_URL = "/users";

export interface IUserProfile {
  id: string;
  full_name: string;
  phone_number: string | null;
  email: string;
  photoProfile?: string;
  UserAddress: IAddress[];
}

export const getUserProfile = async (token: string): Promise<IUserProfile> => {
  const res = await axiosInstance.get(`${USER_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const getUserAddresses = async (token: string): Promise<IAddress[]> => {
  const res = await axiosInstance.get(`${USER_URL}/me/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getUserProfileWithAddress = async (
  token: string
): Promise<IUserProfile> => {
  const profileRes = await getUserProfile(token);
  const addresses = await getUserAddresses(token);

  return {
    ...profileRes,
    UserAddress: addresses,
  };
};
