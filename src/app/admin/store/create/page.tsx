"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import { getCities, getDistricts, getProvinces } from "@/services/shipping";
import { createStoreSchema } from "@/features/admin/store/schemas/createStoreSchema";
import { createStore } from "@/services/store";
import { IStore } from "@/features/admin/store/types";
import { toast } from "react-toastify";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import StoreForm from "@/features/admin/store/components/StoreForm";

export default function CreateStorePage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const onCreateStore = async ({
    name,
    description,
    provinceId,
    cityId,
    districtId,
    address,
    latitude,
    longitude,
    logo,
    token,
  }: Omit<IStore, "id" | "status"> & { token: string }) => {
    const response = await createStore({
      name,
      description,
      provinceId,
      cityId,
      districtId,
      address,
      latitude,
      longitude,
      logo,
      token,
    });

    if (response.status == 201) {
      router.push("/admin/store");
      toast.success(response.data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      province_id: "",
      city_id: "",
      district_id: "",
      address: "",
      latitude: "",
      longitude: "",
      logo: null as File | null,
    },
    validationSchema: createStoreSchema,
    onSubmit: ({
      name,
      description,
      province_id,
      city_id,
      district_id,
      address,
      latitude,
      longitude,
      logo,
    }) => {
      onCreateStore({
        name,
        description,
        provinceId: Number(province_id),
        cityId: Number(city_id),
        districtId: Number(district_id),
        address,
        latitude,
        longitude,
        logo,
        token,
      });
    },
  });

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Create Store</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl h-10/12">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <StoreForm formik={formik} />
          </form>
        </div>
      </div>
    </div>
  );
}
