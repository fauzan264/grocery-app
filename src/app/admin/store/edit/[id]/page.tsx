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

    if (response.status == 200) {
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
        province_id: String(store?.provinceId),
        city_id: String(store?.cityId),
        district_id: String(store?.districtId),
        address: store?.address || "",
        latitude: store?.latitude || "",
        longitude: store?.longitude || "",
      });
    }
  }, [store]);

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Edit Store</h1>
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
