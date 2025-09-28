import FormInput from "@/app/form/FormInput";
import FormSelect from "@/app/form/FormSelect";
import FormInputTextArea from "@/app/form/FormTextArea";
import { getCities, getDistricts, getProvinces } from "@/services/shipping";
import { FormikProps } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export interface IStoreFormProps {
  logo: File | null;
  name: string;
  description: string;
  province_id: string;
  city_id: string;
  district_id: string;
  address: string;
  latitude: string;
  longitude: string;
}

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
});

export default function StoreForm({
  formik,
}: {
  formik: FormikProps<IStoreFormProps>;
}) {
  const [provinces, setProvinces] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [cities, setCities] = useState<{ id: string; name: string }[] | null>(
    null
  );
  const [districts, setDistricts] = useState<
    { id: string; name: string }[] | null
  >(null);
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
    if (!formik.values.city_id) {
      setDistricts([]);
      formik.setFieldValue("city", "");
      formik.setFieldValue("district", "");
    }
  };

  const onGetDistrict = async ({ cityId }: { cityId: number }) => {
    const response = await getDistricts({ cityId });
    setDistricts(response.data.data);
    if (!formik.values.district_id) {
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
    if (formik.values.province_id)
      onGetCities({ provinceId: Number(formik.values.province_id) });
  }, [formik.values.province_id]);

  useEffect(() => {
    if (formik.values.city_id)
      onGetDistrict({ cityId: Number(formik.values.city_id) });
  }, [formik.values.city_id]);

  return (
    <>
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend text-slate-800">
          <input
            type="file"
            name="logo"
            id="logo"
            className="file-input file-input-success"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              formik.setFieldValue("logo", file);
            }}
          />
        </legend>
        {formik.errors.logo && formik.touched.logo && (
          <div className="feedback text-red-600">{formik.errors.logo}</div>
        )}
      </fieldset>
      <FormInput formik={formik} name="name" label="Name" />
      <FormInputTextArea
        formik={formik}
        name="description"
        label="Description"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormSelect
          formik={formik}
          name="province_id"
          label="Province"
          options={
            provinces
              ? provinces?.map((province) => ({
                  value: province.id,
                  label: province.name,
                }))
              : []
          }
        />
        <FormSelect
          formik={formik}
          name="city_id"
          label="City"
          options={
            cities
              ? cities?.map((city) => ({
                  value: city.id,
                  label: city.name,
                }))
              : []
          }
        />
        <FormSelect
          formik={formik}
          name="district_id"
          label="District"
          options={
            districts
              ? districts?.map((district) => ({
                  value: district.id,
                  label: district.name,
                }))
              : []
          }
        />
      </div>
      <FormInputTextArea formik={formik} name="address" label="Address" />
      <fieldset className="fieldset w-full h-62">
        <legend className="fieldset-legend text-slate-800">
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
      <button
        type="submit"
        className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full my-5 focus:outline-none"
      >
        Submit
      </button>
    </>
  );
}
