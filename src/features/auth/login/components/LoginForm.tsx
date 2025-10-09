"use client";
import { ErrorResponse } from "@/components/error/types";
import { loginSchema } from "@/features/auth/login/schemas/loginSchema";
import { login, sessionLogin } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await login({ email, password });
      setAuth({
        token: response.data.data.token,
        id: response.data.data.id,
        fullName: response.data.data.full_name,
        role: response.data.data.role,
      });

      toast.info(response.data.message);
      router.push(decodeURIComponent(callbackUrl));
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: ({ email, password }) => {
      onLogin({ email, password });
    },
  });

  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const onLoginSocialMedia = async ({ token }: { token: string }) => {
    try {
      const response = await sessionLogin({ token });

      setAuth({
        token: token,
        id: response.data.data.id,
        fullName: response.data.data.full_name,
        role: response.data.data.role,
      });

      toast.info(response.data.message);
      router.push(decodeURIComponent(callbackUrl));
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (error == "email_already_registered") {
      toast.error(
        "Your account was registered using email and password. Please sign in with your email and password."
      );
    }
  }, [error]);

  useEffect(() => {
    if (token) {
      onLoginSocialMedia({ token });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center mt-15">
      <div className="card w-4/5 md:w-2/5 card-border card-md bg-slate-50 shadow-sm p-5 rounded-xl">
        <div className="card-body">
          <div className="card-title justify-center text-slate-800">Login</div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full">
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
              </div>
              <div className="w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Password</legend>
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
              <div className="ml-auto mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="btn border-0 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 transition ease-in-out duration-300 text-slate-100 w-full mt-5 focus:outline-none"
              >
                Login
              </button>
            </div>
          </form>
          <p className="mt-3 text-slate-800 mb-5">
            You have an account?{" "}
            <Link href="/register" className="text-emerald-600">
              Register
            </Link>
          </p>
          <Link
            href={`${process.env.NEXT_PUBLIC_LINK_AUTH_GOOGLE}`}
            className="w-full"
          >
            <figure className="w-full h-12 relative">
              <Image
                src={"/images/sign-in-with-google.png"}
                fill
                className="object-contain"
                alt={"Sign in with google"}
              />
            </figure>
          </Link>
        </div>
      </div>
    </div>
  );
}
