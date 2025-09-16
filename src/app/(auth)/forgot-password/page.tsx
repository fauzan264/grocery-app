"use client";
import { ErrorResponse } from "@/components/error/types";
import { forgotPasswordSchema } from "@/features/auth/forgot-password/schemas/forgotPasswordSchema";
import { requestResetPassword } from "@/services/auth";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const onForgotPassword = async ({ email }: { email: string }) => {
    try {
      const response = await requestResetPassword({ email });

      toast.info(response.data.message);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: ({ email }: { email: string }) => {
      onForgotPassword({ email });
    },
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center mt-15">
        <div className="card w-1/2 md:w-2/5 card-border card-md bg-slate-50 shadow-sm p-5 rounded-xl">
          <div className="card-body">
            <div className="card-title justify-center text-slate-800">
              Forgot Password
            </div>
            <form onSubmit={formik.handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-slate-800">
                  Email
                </legend>
                <label className="input input-accent validator w-full">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </label>
                {formik.errors.email && formik.touched.email && (
                  <div className="feedback text-red-600">
                    {formik.errors.email}
                  </div>
                )}
              </fieldset>
              <button
                type="submit"
                className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full mt-5 focus:outline-none"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
