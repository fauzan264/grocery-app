"use client";
import { ErrorResponse } from "@/components/error/types";
import UserAddressForm from "@/features/user/address/components/UserAddressForm";
import { createUserAddressSchema } from "@/features/user/address/schemas/createUserAddressSchema";
import { IAddress } from "@/features/user/address/types";
import { createAddress } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditProfileAddressPage() {
  const router = useRouter();
  const { token, id } = useAuthStore();

  const onCreateAddress = async ({
    token,
    userId,
    provinceId,
    cityId,
    districtId,
    address,
    latitude,
    longitude,
    isDefault,
  }: Pick<
    IAddress,
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
      const response = await createAddress({
        token,
        userId,
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
    validationSchema: createUserAddressSchema,
    onSubmit: ({
      provinceId,
      cityId,
      districtId,
      address,
      latitude,
      longitude,
      isDefault,
    }) => {
      console.log(
        provinceId,
        cityId,
        districtId,
        address,
        latitude,
        longitude,
        isDefault
      );
      onCreateAddress({
        token,
        userId: id,
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

  return (
    <div className="mx-auto py-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Create Address</h1>
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
