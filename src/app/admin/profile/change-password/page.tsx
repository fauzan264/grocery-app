"use client";
import Button from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import { changePasswordSchema } from "@/features/auth/change-password/schemas/changePasswordSchema";
import { changePassword } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const onResetPassword = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
    token: string;
  }) => {
    try {
      const res = await changePassword({ oldPassword, newPassword, token });

      toast.success(res.data.message);

      router.push("/admin/profile");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data.message || "Something went wrong!";
        toast.error(message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: ({ oldPassword, newPassword }) => {
      if (!token) {
        toast.error("Token not found!");
        return;
      }

      onResetPassword({ oldPassword, newPassword, token });
    },
  });

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Change Password</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <FormInput
              formik={formik}
              name="oldPassword"
              label="Old Password"
              type="password"
            />
            <FormInput
              formik={formik}
              name="newPassword"
              label="New Password"
              type="password"
            />
            <FormInput
              formik={formik}
              name="confirmNewPassword"
              label="Confirm New Password"
              type="password"
            />
            <Button type="submit" name="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
