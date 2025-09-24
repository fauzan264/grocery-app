import UserProfileComponent from "@/features/user/components/UserProfileComponent";
import Link from "next/link";

export default function ProfileAdminPage() {
  return (
    <div className="mx-auto my-10 w-11/12 h-full">
      <div className="flex">
        <h1 className="text-2xl text-gray-700">Profile Management</h1>
        <div className="ml-auto">
          <Link
            href={`/admin/profile/change-password`}
            className="btn btn-sm ml-auto bg-emerald-500 text-white text-sm rounded-md hover:bg-emerald-600 active:bg-emerald-600 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0 mr-1"
          >
            Change Password
          </Link>
          <Link
            href={`/admin/profile/edit`}
            className="btn btn-sm ml-auto bg-amber-400 text-white text-sm rounded-md hover:bg-amber-500 active:bg-amber-500 transition ease-in-out duration-300 focus:outline-none focus:ring-0 border-0"
          >
            Edit
          </Link>
        </div>
      </div>
      <UserProfileComponent />
    </div>
  );
}
