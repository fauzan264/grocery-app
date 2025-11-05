"use client";
import FormInput from "@/components/form/FormInput";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/button";
import { updateUserSchema } from "@/features/user/schemas/userSchema";
import { IUser } from "@/features/user/type";
import { myProfile, updateProfile } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditProfilePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<IUser | null>(null);

  const onGetProfile = async ({ token }: { token: string }) => {
    const res = await myProfile({ token });

    setProfile(camelcaseKeys(res.data.data));
  };

  useEffect(() => {
    if (token) onGetProfile({ token });
  }, [token]);

  const onEditProfile = async ({
    fullName,
    dateOfBirth,
    phoneNumber,
    photoProfile,
    token,
  }: IUser & {
    token: string;
  }) => {
    try {
      const res = await updateProfile({
        fullName,
        dateOfBirth,
        phoneNumber,
        photoProfile,
        token,
      });

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
      fullName: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
      photoProfile: null as File | null,
    },
    validationSchema: updateUserSchema,
    onSubmit: ({ fullName, dateOfBirth, email, phoneNumber, photoProfile }) => {
      onEditProfile({
        fullName,
        dateOfBirth,
        email,
        phoneNumber,
        photoProfile,
        token,
      });
    },
  });

  useEffect(() => {
    if (profile) {
      formik.setValues({
        photoProfile: null,
        fullName: profile.fullName || "",
        dateOfBirth:
          new Date(profile.dateOfBirth).toISOString().split("T")[0] || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <Breadcrumbs />
      <h1 className="text-2xl text-gray-700">Edit Profile</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl h-10/12">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              {profile?.photoProfile && (
                <figure className="w-40 h-40 block relative rounded">
                  <Image
                    src={String(profile?.photoProfile)}
                    alt={`${profile?.fullName} image`}
                    fill
                    className="object-cover"
                  />
                </figure>
              )}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-slate-900">
                  Image
                </legend>
                <input
                  id="photoProfile"
                  name="photoProfile"
                  type="file"
                  className="file-input file-input-success w-full"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    formik.setFieldValue("photoProfile", file);
                  }}
                />
                {formik.errors.photoProfile && formik.touched.photoProfile && (
                  <div className="feedback text-red-600">
                    {formik?.touched?.photoProfile &&
                      formik?.errors?.photoProfile && (
                        <div>{formik?.errors.photoProfile.toString()}</div>
                      )}
                  </div>
                )}
              </fieldset>
            </div>
            <FormInput formik={formik} name="fullName" label="Full Name" />
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Date Of Birth
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  onChange={formik.handleChange}
                  value={formik.values.dateOfBirth}
                />
              </label>
              {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                <div className="feedback text-red-600">
                  {formik.errors.dateOfBirth}
                </div>
              )}
            </fieldset>
            <FormInput
              formik={formik}
              name="phoneNumber"
              label="Phone Number"
              type="tel"
            />
            <Button type="submit" name="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
