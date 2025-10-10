"use client";
import { useParams, useRouter } from "next/navigation";
import {
  resendVerificationRegister,
  validateToken,
  verifyEmail,
} from "@/services/auth";
import { useFormik } from "formik";
import { verifyEmailSchema } from "@/features/auth/verify-email/schemas/verifyEmailSchema";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/components/error/types";
import PublicOnlyGuard from "@/hoc/PublicOnlyGuard";
import { useEffect, useState } from "react";
import FormInput from "@/components/form/FormInput";
import { resendVerificationRegisterSchema } from "@/features/auth/verify-email/schemas/resendVerificationRegisterSchema";

interface VerifyValues {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [validationState, setValidationState] = useState<
    "loading" | "valid" | "invalid"
  >("loading");

  const onCheckValidateToken = async ({ token }: { token: string }) => {
    try {
      const response = await validateToken({ token });

      if (response.status == 200) {
        setValidationState("valid");
      } else {
        setValidationState("invalid");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }

      setValidationState("invalid");
    }
  };

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

  const onResendVerify = async ({ email }: { email: string }) => {
    try {
      const response = await resendVerificationRegister({ email });

      toast.info(response.data.message);
      router.push("/login");
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  let initialValues: VerifyValues = {};
  let schema;
  if (validationState === "valid") {
    initialValues = { password: "", confirmPassword: "" };
    schema = verifyEmailSchema;
  } else if (validationState === "invalid") {
    initialValues = { email: "" };
    schema = resendVerificationRegisterSchema;
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (validationState === "valid") {
        onVerifyEmail({ password: values.password!, token });
      } else if (validationState === "invalid") {
        onResendVerify({ email: values.email! });
      }
    },
  });

  useEffect(() => {
    if (token) {
      onCheckValidateToken({ token });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {validationState == "loading" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {validationState == "valid" && (
        <div className="card w-4/5 md:w-2/5 card-border card-md bg-slate-50 shadow-sm p-5 rounded-xl">
          <div className="card-body">
            <div className="card-title justify-center text-slate-800">
              Verify Email
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap">
                <FormInput
                  formik={formik}
                  name={"password"}
                  label="Password"
                  type="password"
                />
                <FormInput
                  formik={formik}
                  name={"confirmPassword"}
                  label="Password"
                  type="password"
                />
                <button
                  type="submit"
                  className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full mt-5 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {validationState == "invalid" && (
        <div className="card w-4/5 md:w-2/5 card-border card-md bg-slate-50 shadow-sm p-5 rounded-xl">
          <div className="card-body">
            <div className="card-title justify-center text-slate-800">
              Verify Email
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-wrap">
                <FormInput
                  formik={formik}
                  name={"email"}
                  label="Email"
                  type="email"
                />
                <button
                  type="submit"
                  className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full mt-5 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicOnlyGuard(VerifyEmailPage);
