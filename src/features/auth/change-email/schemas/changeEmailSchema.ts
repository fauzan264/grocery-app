import * as yup from "yup";

export const changeEmailSchema = yup.object().shape({
  newEmail: yup
    .string()
    .email("Invalid email format")
    .required("New Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
