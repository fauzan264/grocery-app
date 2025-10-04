import * as yup from "yup";

export const createUserAddressSchema = yup.object().shape({
  provinceId: yup.number().required("Province is required"),
  cityId: yup.number().required("City is required"),
  districtId: yup.number().required("District is required"),
  address: yup.string().required("Address is required"),
  latitude: yup.number().required("Latitude is required"),
  longitude: yup.number().required("Longitude is required"),
  isDefault: yup.boolean().required("Is Default is required"),
});
