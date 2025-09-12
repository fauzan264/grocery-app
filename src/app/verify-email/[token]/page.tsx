"use client";
import { useParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/services/auth";
import { useFormik } from "formik";
import { verifyEmailSchema } from "@/features/auth/verify-email/schemas/verifyEmailSchema";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const onVerifyEmail = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) => {
    try {
      const response = await verifyEmail({ password, token });

      toast.info(response.data.message);
      router.push("/login");
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: verifyEmailSchema,
    onSubmit: ({ password }) => {
      onVerifyEmail({ password, token });
    },
  });

  return (
    <div className="min-screen flex items-center justify-center mt-15">
      <div className="card card-border card-md bg-teal-100 shadow-sm p-5 rounded-xl">
        <div className="card-body">
          <div className="card-title justify-center text-gray-800">
            Verify Email
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-800">
                    Password
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
              </div>
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-800">
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
              </div>
              <button
                type="submit"
                className="btn border-0 bg-teal-500 hover:bg-teal-600 active:bg-teal-600 transition ease-in-out duration-300 text-gray-100 w-full mt-5 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
