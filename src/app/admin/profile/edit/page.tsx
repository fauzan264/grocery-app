"use client";
import { updateUserSchema } from "@/features/user/schemas/userSchema";
import { myProfile, updateProfile } from "@/services/user";
import useAuthStore from "@/store/useAuthStore";
import { AxiosError } from "axios";
import camelcaseKeys from "camelcase-keys";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegUser, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { toast } from "react-toastify";

export default function EditProfilePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [profile, setProfile] = useState(null);

  const onGetProfile = async () => {
    const res = await myProfile({ token });

    setProfile(camelcaseKeys(res.data.data));
  };

  useEffect(() => {
    if (token) onGetProfile();
  }, [token]);

  const onEditProfile = async ({
    fullName,
    dateOfBirth,
    email,
    phoneNumber,
    photoProfile,
    token,
  }: {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    photoProfile: File;
    token: string;
  }) => {
    try {
      const res = await updateProfile({
        fullName,
        dateOfBirth,
        email,
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
      photoProfile: File | null,
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
        dateOfBirth: profile.dateOfBirth || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
  }, [profile]);

  return (
    <div className="mx-auto my-10 w-11/12 min-h-full">
      <h1 className="text-2xl text-gray-700">Edit Profile</h1>
      <div className="card bg-slate-50 my-5 shadow-md rounded-md rounded-t-4xl h-10/12">
        <div className="card-body w-11/12 md:w-3/5 mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              {profile?.photoProfile && (
                <figure className="w-40 h-40 block relative rounded">
                  <Image
                    src={profile?.photoProfile}
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
                  className="file-input file-input-success w-full md:w-1/3"
                  onChange={(event) => {
                    const files = Array.from(event?.currentTarget.files || []);
                    formik.setFieldValue("photoProfile", files);
                  }}
                  multiple
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
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                FullName
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
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">Email</legend>
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
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-slate-800">
                Phone Number
              </legend>
              <label className="input input-accent validator w-full">
                <input
                  type="tel"
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
