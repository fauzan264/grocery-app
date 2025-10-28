"use client";
import Button from "@/components/ui/button";
import FormInput from "@/components/form/FormInput";
import { changeEmail } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { changeEmailSchema } from "@/features/auth/change-email/schemas/changeEmailSchema";

export default function ChangeEmailPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const onChangeEmail = async ({
    newEmail,
    password,
    token,
  }: {
    newEmail: string;
    password: string;
    token: string;
  }) => {
    try {
      const res = await changeEmail({ newEmail, password, token });

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
      newEmail: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: changeEmailSchema,
    onSubmit: ({ newEmail, password }) => {
      if (!token) {
        toast.error("Token not found!");
        return;
      }

      onChangeEmail({ newEmail, password, token });
    },
  });

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Change Email</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <FormInput
              formik={formik}
              name="newEmail"
              label="New Email"
              type="email"
            />
            <FormInput
              formik={formik}
              name="password"
              label="Password"
              type="password"
            />
            <FormInput
              formik={formik}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />
            <Button type="submit" name="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
