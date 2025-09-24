import * as yup from "yup";

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Password is required"),
  newPassword: yup
    .string()
    .required("New Password is required")
    .notOneOf(
      [yup.ref("oldPassword")],
      "New password cannot be the same as old password"
    ),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});
