import * as yup from "yup";

export const updateUserAddressSchema = yup.object().shape({
  provinceId: yup.number(),
  cityId: yup.number(),
  districtId: yup.number(),
  address: yup.string(),
  latitude: yup.number(),
  longitude: yup.number(),
  is_default: yup.boolean(),
});
