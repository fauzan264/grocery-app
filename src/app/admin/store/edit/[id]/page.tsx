"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { updateStoreSchema } from "@/features/admin/store/schemas/updateStoreSchema";
import { getStoreById, updateStore } from "@/services/store";
import { toast } from "react-toastify";
import camelcaseKeys from "camelcase-keys";
import { useParams, useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { IStore } from "@/features/admin/store/types";
import StoreForm from "@/features/admin/store/components/StoreForm";
import Image from "next/image";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";

export default function EditStorePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuthStore();
  const [store, setStore] = useState<IStore | null>(null);

  const getDetailStore = async () => {
    const response = await getStoreById({ id, token });
    if (response.status == 200) {
      setStore(camelcaseKeys(response.data.data));
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      getDetailStore();
    }
  }, [token]);

  const onUpdateStore = async ({
    id,
    name,
    description,
    provinceId,
    cityId,
    districtId,
    address,
    latitude,
    longitude,
    logo,
    status,
    token,
  }: IStore & { token: string }) => {
    try {
      const response = await updateStore({
        id,
        name,
        description,
        provinceId,
        cityId,
        districtId,
        address,
        latitude,
        longitude,
        logo,
        status,
        token,
      });
      router.push("/admin/store");
      toast.success(response.data.message);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
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
      // status: store?.status || "",
    },
    validationSchema: updateStoreSchema,
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
      // status,
    }) => {
      onUpdateStore({
        id,
        name,
        description,
        provinceId: Number(province_id),
        cityId: Number(city_id),
        districtId: Number(district_id),
        address,
        latitude,
        longitude,
        logo,
        status: "ACTIVE",
        token,
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (store) {
      formik.setValues({
        ...formik.values,
        name: store?.name || "",
        description: store?.description || "",
        province_id: String(store?.province?.id),
        city_id: String(store?.city?.id),
        district_id: String(store?.district?.id),
        address: store?.address || "",
        latitude: store?.latitude || "",
        longitude: store?.longitude || "",
      });
    }
  }, [store]);

  return (
    <div className="mx-auto py-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Edit Store</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              {store?.logo && (
                <figure className="w-40 h-40 block relative rounded">
                  <Image
                    src={`${store.logo}`}
                    alt={`${formik.values.name} image`}
                    fill
                    className="object-cover"
                  />
                </figure>
              )}
            </div>
            <StoreForm formik={formik} />
          </form>
        </div>
      </div>
    </div>
  );
}
