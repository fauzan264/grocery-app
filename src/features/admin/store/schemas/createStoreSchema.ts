import * as yup from "yup";

export const createStoreSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  province_id: yup.string().required("Province is required"),
  city_id: yup.string().required("City is required"),
  district_id: yup.string().required("Subdistrict is required"),
  address: yup.string().required("Address is required"),
  latitude: yup.string().required("Latitude is required"),
  longitude: yup.string().required("Longitude is required"),
  logo: yup.string(),
});
