import dynamic from "next/dynamic";
import {
  IAddress,
  IAddressCity,
  IAddressDistrict,
  IAddresssProvince,
} from "../types";
import { useEffect, useState } from "react";
import { FormikProps } from "formik";
import { getCities, getDistricts, getProvinces } from "@/services/shipping";
import FormSelect from "@/components/form/FormSelect";
import FormInput from "@/components/form/FormInput";
import FormInputTextArea from "@/components/form/FormTextArea";
import Button from "@/components/ui/button";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
});

export default function UserAddressForm({
  formik,
}: {
  formik: FormikProps<
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
  >;
}) {
  const [provinces, setProvinces] = useState<IAddresssProvince[] | null>(null);
  const [cities, setCities] = useState<IAddressCity[] | null>(null);
  const [districts, setDistricts] = useState<IAddressDistrict[] | null>(null);
  const [position, setPosition] = useState<[number, number]>([
    -6.186486, 106.834091,
  ]);

  const handleMarkerChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    formik.setFieldValue("latitude", lat.toString());
    formik.setFieldValue("longitude", lng.toString());
  };

  const onGetProvinces = async () => {
    const response = await getProvinces();
    setProvinces(response.data.data);
  };

  const onGetCities = async ({ provinceId }: { provinceId: number }) => {
    const response = await getCities({ provinceId });
    setCities(response.data.data);
    if (!formik.values.cityId) {
      setDistricts([]);
      formik.setFieldValue("city", "");
      formik.setFieldValue("district", "");
    }
  };

  const onGetDistricts = async ({ cityId }: { cityId: number }) => {
    const response = await getDistricts({ cityId });
    setDistricts(response.data.data);
    if (!formik.values.districtId) {
      formik.setFieldValue("district", "");
    }
  };

  useEffect(() => {
    onGetProvinces();
    if (formik.values.latitude) {
      handleMarkerChange(
        Number(formik.values.latitude),
        Number(formik.values.longitude)
      );
    }
  }, [formik.values]);

  useEffect(() => {
    if (formik.values.provinceId) {
      onGetCities({ provinceId: Number(formik.values.provinceId) });
    }
  }, [formik.values.provinceId]);

  useEffect(() => {
    if (formik.values.cityId) {
      onGetDistricts({ cityId: Number(formik.values.cityId) });
    }
  }, [formik.values.cityId]);

  return (
    <>
      <FormSelect
        formik={formik}
        name="provinceId"
        label="Province"
        options={
          provinces
            ? provinces?.map((province) => ({
                value: province.id,
                label: province.name ?? "",
              }))
            : []
        }
      />
      <FormSelect
        formik={formik}
        name="cityId"
        label="City"
        options={
          cities
            ? cities?.map((city) => ({
                value: city.id,
                label: city.name ?? "",
              }))
            : []
        }
      />
      <FormSelect
        formik={formik}
        name="districtId"
        label="District"
        options={
          districts
            ? districts?.map((district) => ({
                value: district.id,
                label: district.name ?? "",
              }))
            : []
        }
      />
      <FormInputTextArea formik={formik} name="address" label="Address" />
      <fieldset className="fieldset w-full h-62">
        <legend className="fieldset-legend text-slate 800">
          Pick your location
        </legend>
        <MapComponent position={position} onMarkerChange={handleMarkerChange} />
      </fieldset>
      <FormInput
        formik={formik}
        name="latitude"
        label="Latitude"
        readOnly={true}
      />
      <FormInput
        formik={formik}
        name="longitude"
        label="Longitude"
        readOnly={true}
      />
      <FormSelect
        formik={formik}
        name="isDefault"
        label="Is Default"
        options={[
          {
            value: "true",
            label: "Ya",
          },
          {
            value: "false",
            label: "Tidak",
          },
        ]}
      />
      <Button type="submit" name="Submit" />
    </>
  );
}
