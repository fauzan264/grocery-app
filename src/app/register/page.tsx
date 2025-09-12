"use client";
import { ErrorResponse } from "@/components/error/types";
import { registerSchema } from "@/features/auth/register/schemas/registerSchema";
import { register } from "@/services/auth";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();

  const onRegister = async ({
    fullName,
    email,
    phoneNumber,
  }: {
    fullName: string;
    email: string;
    phoneNumber: string;
  }) => {
    try {
      const response = await register({
        fullName,
        email,
        phoneNumber,
      });

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
      fullName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: registerSchema,
    onSubmit: ({ fullName, email, phoneNumber }) => {
      onRegister({
        fullName,
        email,
        phoneNumber,
      });
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center mt-15">
      <div className="card card-border card-md bg-teal-100 shadow-sm p-5 rounded-xl">
        <div className="card-body">
          <div className="card-title justify-center text-gray-800">
            Register
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-800">
                    Full Name
                  </legend>
                  <label className="input input-accent validator w-full">
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      onChange={formik.handleChange}
                      value={formik.values.fullName}
                    />
                  </label>
                  {formik.errors.fullName && formik.touched.fullName && (
                    <div className="feedback text-red-600">
                      {formik.errors.fullName}
                    </div>
                  )}
                </fieldset>
              </div>
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-800">
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
              </div>
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-800">
                    Phone Number
                  </legend>
                  <label className="input input-accent validator w-full">
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      onChange={formik.handleChange}
                      value={formik.values.phoneNumber}
                    />
                  </label>
                  {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                    <div className="feedback text-red-600">
                      {formik.errors.phoneNumber}
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
          <p className="mt-3 text-gray-800">
            You have an account?{" "}
            <Link href="/login" className="text-teal-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
