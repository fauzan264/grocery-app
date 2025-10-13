"use client";
import { ErrorResponse } from "@/components/error/types";
import UserAddressForm from "@/features/user/address/components/UserAddressForm";
import { updateUserAddressSchema } from "@/features/user/address/schemas/updateUserAddressSchema";
import { IAddress } from "@/features/user/address/types";
import { getAddressById, updateAddress } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditProfileAddressPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { token, id } = useAuthStore();
  const [address, setAddress] = useState<IAddress | null>(null);

  const getDetailAddress = async ({
    token,
    userId,
    addressId,
  }: {
    token: string;
    userId: string;
    addressId: string;
  }) => {
    try {
      const response = await getAddressById({ token, userId, addressId });
      setAddress(camelcaseKeys(response.data.data));
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (token && id) {
      getDetailAddress({ token, userId: id, addressId: params.id });
    }
  }, [token, id]);

  const onUpdateAddress = async ({
    token,
    userId,
    id,
    provinceId,
    cityId,
    districtId,
    address,
    latitude,
    longitude,
    isDefault,
  }: Pick<
    IAddress,
    | "id"
    | "provinceId"
    | "cityId"
    | "districtId"
    | "address"
    | "latitude"
    | "longitude"
    | "isDefault"
  > & {
    token: string;
    userId: string;
  }) => {
    try {
      const response = await updateAddress({
        token,
        userId,
        id,
        provinceId,
        cityId,
        districtId,
        address,
        latitude,
        longitude,
        isDefault,
      });
      toast.success(response.data.message);
      router.push("/profile");
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const formik = useFormik<
    Pick<
      IAddress,
      | "provinceId"
      | "cityId"
      | "districtId"
      | "address"
      | "latitude"
      | "longitude"
      | "isDefault"
    >
  >({
    initialValues: {
      provinceId: "",
      cityId: "",
      districtId: "",
      address: "",
      latitude: 0,
      longitude: 0,
      isDefault: false,
    },
    validationSchema: updateUserAddressSchema,
    onSubmit: ({
      provinceId,
      cityId,
      districtId,
      address,
      latitude,
      longitude,
      isDefault,
    }) => {
      onUpdateAddress({
        token,
        userId: id,
        id: params.id,
        provinceId: provinceId,
        cityId: cityId,
        districtId: districtId,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        isDefault,
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (address) {
      formik.setValues({
        provinceId: address.province.id,
        cityId: address.city.id,
        districtId: address.district.id,
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
        isDefault: address.isDefault,
      });
    }
  }, [address]);

  return (
    <div className="mx-auto py-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Edit Address</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <UserAddressForm formik={formik} />
          </form>
        </div>
      </div>
    </div>
  );
}
