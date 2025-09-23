import * as yup from "yup";

export const createStoreSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  province: yup.string().required("Province is required"),
  city: yup.string().required("City is required"),
  subdistrict: yup.string().required("Subdistrict is required"),
  address: yup.string().required("Address is required"),
  latitude: yup.string().required("Latitude is required"),
  longitude: yup.string().required("Longitude is required"),
  logo: yup.string(),
});
