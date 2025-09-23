"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import {
  getCities,
  getDistricts,
  getProvinces,
  getSubdistricts,
} from "@/services/shipping";
import { createStoreSchema } from "@/features/admin/store/schemas/createStoreSchema";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
});

export default function CreateStorePage() {
  const [provinces, setProvinces] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [cities, setCities] = useState<{ id: string; name: string }[] | null>(
    null
  );
  const [districts, setDistricts] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [subdistricts, setSubdistricts] = useState<
    { id: string; name: string }[] | null
  >(null);
  const [position, setPosition] = useState<[number, number]>([
    -6.186486, 106.834091,
  ]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      province: "",
      city: "",
      district: "",
      subdistrict: "",
      address: "",
      latitude: "",
      longitude: "",
      logo: "",
    },
    validationSchema: createStoreSchema,
    onSubmit: ({
      name,
      description,
      province,
      city,
      district,
      subdistrict,
      address,
      latitude,
      longitude,
      logo,
    }) => {},
  });

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
    setDistricts([]);
    setSubdistricts([]);
    formik.setFieldValue("city", "");
    formik.setFieldValue("district", "");
    formik.setFieldValue("subdistrict", "");
  };

  const onGetDistrict = async ({ cityId }: { cityId: number }) => {
    const response = await getDistricts({ cityId });
    setDistricts(response.data.data);
    setSubdistricts([]);
    formik.setFieldValue("district", "");
    formik.setFieldValue("subdistrict", "");
  };

  const onGetSubdistrict = async ({ districtId }: { districtId: number }) => {
    const response = await getSubdistricts({ districtId });
    setSubdistricts(response.data.data);
    formik.setFieldValue("subdistrict", "");
  };

  useEffect(() => {
    onGetProvinces();
  }, []);

  useEffect(() => {
    if (formik.values.province)
      onGetCities({ provinceId: Number(formik.values.province) });
  }, [formik.values.province]);

  useEffect(() => {
    if (formik.values.city)
      onGetDistrict({ cityId: Number(formik.values.city) });
  }, [formik.values.city]);

  useEffect(() => {
    if (formik.values.district)
      onGetSubdistrict({ districtId: Number(formik.values.district) });
  }, [formik.values.district]);

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Create Store</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl h-10/12">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">Name</legend>
              <label className="input input-accent validator w-full">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </label>
              {formik.errors.name && formik.touched.name && (
                <div className="feedback text-red-600">
                  {formik.errors.name}
                </div>
              )}
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Description
              </legend>
              <textarea
                className="textarea w-full textarea-accent"
                placeholder="Description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="feedback text-red-600">
                  {formik.errors.description}
                </div>
              )}
            </fieldset>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-slate-800">
                  Province
                </legend>
                <select
                  name="province"
                  id="province"
                  className="select select-accent validator w-full"
                  value={formik.values.province}
                  onChange={formik.handleChange}
                >
                  <option value={""} disabled={true}>
                    Select a province
                  </option>
                  {provinces?.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-slate-800">City</legend>
                <select
                  name="city"
                  id="city"
                  className="select select-accent validator w-full"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                >
                  <option value={""} disabled={true}>
                    Select a city
                  </option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-slate-800">
                  District
                </legend>
                <select
                  name="district"
                  id="district"
                  className="select select-accent validator w-full"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                >
                  <option value={""} disabled={true}>
                    Select a district
                  </option>
                  {districts?.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-slate-800">
                  Subdistrict
                </legend>
                <select
                  name="subdistrict"
                  id="subdistrict"
                  className="select select-accent validator w-full"
                  value={formik.values.subdistrict}
                  onChange={formik.handleChange}
                >
                  <option value={""} disabled={true}>
                    Select a subdistrict
                  </option>
                  {subdistricts?.map((subdistrict) => (
                    <option key={subdistrict.id} value={subdistrict.id}>
                      {subdistrict.name}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Address
              </legend>
              <textarea
                className="textarea w-full textarea-accent"
                placeholder="Address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
              {formik.errors.address && formik.touched.address && (
                <div className="feedback text-red-600">
                  {formik.errors.address}
                </div>
              )}
            </fieldset>
            <fieldset className="fieldset w-full h-62">
              <legend className="fieldset-legend text-slate-800">
                Pick your location
              </legend>
              <MapComponent
                position={position}
                onMarkerChange={handleMarkerChange}
              />
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Latitude
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="text"
                  name="latitude"
                  id="latitude"
                  onChange={formik.handleChange}
                  value={formik.values.latitude}
                  readOnly
                />
              </label>
              {formik.errors.latitude && formik.touched.latitude && (
                <div className="feedback text-red-600">
                  {formik.errors.latitude}
                </div>
              )}
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Longitude
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="text"
                  name="longitude"
                  id="longitude"
                  onChange={formik.handleChange}
                  value={formik.values.longitude}
                  readOnly
                />
              </label>
              {formik.errors.longitude && formik.touched.longitude && (
                <div className="feedback text-red-600">
                  {formik.errors.longitude}
                </div>
              )}
            </fieldset>
            <button
              type="submit"
              className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full my-5 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
