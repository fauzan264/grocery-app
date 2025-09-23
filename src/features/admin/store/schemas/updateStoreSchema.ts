import * as yup from "yup";

export const updateStoreSchema = yup.object().shape({
  name: yup.string(),
  description: yup.string(),
  province: yup.string(),
  city: yup.string(),
  subdistrict: yup.string(),
  address: yup.string(),
  latitude: yup.string(),
  longitude: yup.string(),
  logo: yup.string(),
});
