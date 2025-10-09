"use client";
import { ErrorResponse } from "@/components/error/types";
import { resetPasswordSchema } from "@/features/auth/reset-password/schemas/resetPasswordSchema";
import PublicOnlyGuard from "@/hoc/PublicOnlyGuard";
import { resetPassword } from "@/services/auth";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const onForgotPassword = async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) => {
    try {
      const response = await resetPassword({ token, password });

      toast.info(response.data.message);
      router.push("/login");
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: ({ password }: { password: string; confirmPassword: string }) => {
      onForgotPassword({ token: token, password });
    },
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center mt-15">
        <div className="card w-4/5 md:w-2/5 card-border card-md bg-slate-50 shadow-sm p-5 rounded-xl">
          <div className="card-body">
            <div className="card-title justify-center text-slate-800">
              Reset Password
            </div>
            <form onSubmit={formik.handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-slate-800">
                  New Password
                </legend>
                <label className="input input-accent validator w-full">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </label>
                {formik.errors.password && formik.touched.password && (
                  <div className="feedback text-red-600">
                    {formik.errors.password}
                  </div>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-slate-800">
                  Confirm Password
                </legend>
                <label className="input input-accent validator w-full">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                </label>
                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <div className="feedback text-red-600">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </fieldset>
              <button
                type="submit"
                className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full mt-5 focus:outline-none"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicOnlyGuard(ResetPasswordPage);
