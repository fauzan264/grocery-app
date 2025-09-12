import * as yup from "yup";

export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .required("Phone Number is required"),
});
