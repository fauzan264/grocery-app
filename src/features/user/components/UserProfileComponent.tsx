import { formatDateWithTime } from "@/utils/formatDate";
import AddressComponent from "../address/components/AddressComponent";
import { IUser } from "../type";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";

export default function UserProfileComponent({
  profile,
  token,
  userId,
}: {
  profile?: IUser;
  token: string;
  userId: string;
}) {
  if (!profile) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="tabs tabs-box bg-slate-50 my-5 shadow-md rounded-md h-10/12">
      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Profile"
        defaultChecked
      />
      <div className="tab-content bg-slate-100 p-6">
        <div className="flex my-2">
          <div className="flex w-full justify-start md:justify-end">
            <div
              className="flex flex-col space-y-2 w-full 
                    md:flex-row md:space-x-2 md:space-y-0 md:w-auto gap-2"
            >
              <Link
                href={`/admin/profile/change-password`}
                className="w-4/5 mx-auto md:w-auto btn btn-sm bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 active:bg-emerald-600 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0"
              >
                Change Password
              </Link>
              <Link
                href={`/admin/profile/edit`}
                className="w-4/5 mx-auto md:w-auto btn btn-sm bg-amber-400 text-white text-sm rounded-md hover:bg-amber-500 active:bg-amber-500 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="col-span-full md:col-span-1">
            {/* <figure className="w-40 h-40 block relative rounded-lg">
              {profile?.photoProfile && (
                <Image
                  src={String(profile?.photoProfile)}
                  alt={`${profile?.fullName} image`}
                  fill
                  className="object-cover"
                />
              )}
            </figure> */}
            <div className="col-span-full md:col-span-1 flex flex-col items-start space-y-4 md:pr-6  pb-6 md:pb-0 border-b md:border-b-0">
              <div className="relative mx-auto md:mx-0">
                {/* <img src="URL_FOTO_PROFIL" alt="Christy JKT48" className="w-24 h-24 rounded-full object-cover shadow-md" /> */}
                <figure className="w-59 h-59 block relative rounded-3xl overflow-hidden shadow-md">
                  {profile?.photoProfile && (
                    <Image
                      src={String(profile?.photoProfile)}
                      alt={`${profile?.fullName} image`}
                      fill
                      className="object-cover"
                    />
                  )}
                </figure>
                {profile.verified ? (
                  <FaCheckCircle className="absolute bottom-0 right-0 p-1 bg-white rounded-full border-2 border-emerald-500 text-emerald-500 w-8 h-8" />
                ) : (
                  <FaTimesCircle className="absolute bottom-0 right-0 p-1 bg-white rounded-full border-2 border-red-600 text-red-600 w-8 h-8" />
                )}
              </div>

              <div className="text-center md:text-left w-full">
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                  {profile.fullName}
                </h2>
                <div className="flex items-center space-x-2 justify-center md:justify-start">
                  <span className="text-sm font-medium text-gray-500">
                    {profile.userRole!.split("_").join(" ")}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-full md:col-span-3 space-y-4">
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-sm font-semibold text-slate-900">
                {profile.email}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">Phone Number</p>
              <p className="text-sm font-semibold text-slate-900">
                {profile.phoneNumber}
              </p>
            </div>
            <div className="pb-2 border-b-2 border-slate-200">
              <p className="text-sm-font-medium text-slate-500">
                Date Of Birth
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {formatDateWithTime(profile.dateOfBirth).split("pukul")[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_6"
        className="tab"
        aria-label="Address"
      />
      <div className="tab-content bg-slate-100 p-6">
        <AddressComponent token={token} userId={userId} />
      </div>
    </div>
  );
}
