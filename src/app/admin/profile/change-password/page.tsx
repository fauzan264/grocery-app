"use client";
import { changePasswordSchema } from "@/features/auth/change-password/schemas/changePasswordSchema";
import { changePassword } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { TbLockPassword } from "react-icons/tb";
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
      <h1 className="text-2xl text-gray-700">Create Store</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl h-10/12">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Old Password
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  onChange={formik.handleChange}
                  value={formik.values.oldPassword}
                />
              </label>
              {formik.errors.oldPassword && formik.touched.oldPassword && (
                <div className="feedback text-red-600">
                  {formik.errors.oldPassword}
                </div>
              )}
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                New Password
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                />
              </label>
              {formik.errors.newPassword && formik.touched.newPassword && (
                <div className="feedback text-red-600">
                  {formik.errors.newPassword}
                </div>
              )}
            </fieldset>
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Confirm New Password
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  onChange={formik.handleChange}
                  value={formik.values.confirmNewPassword}
                />
              </label>
              {formik.errors.confirmNewPassword &&
                formik.touched.confirmNewPassword && (
                  <div className="feedback text-red-600">
                    {formik.errors.confirmNewPassword}
                  </div>
                )}
            </fieldset>
            <button
              type="submit"
              className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full my-5 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
