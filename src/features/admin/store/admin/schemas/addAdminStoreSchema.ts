import * as yup from "yup";

export const addAdminStoreSchema = yup.object().shape({
  userId: yup.string().required("Store Admin is required"),
});
