"use client";
import CartIcon from "@/features/cart/components/CartIcon";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { logout } = useAuthStore();
  const auth = useAuthStore();
  const router = useRouter();

  const onLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="navbar fixed font-bold shadow-sm transition duration-300 left-0 top-0 z-99 px-10 bg-emerald-900 text-gray-200">
      <div className="navbar-start gap-5">My Grocery</div>
      <div className="navbar-end hidden lg:flex items-center gap-6">
        <CartIcon />
        {auth.fullName && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-md avatar flex"
            >
              <div className="w-7 rounded-full">
                <FaUserCircle className="w-full h-full" />
              </div>
              <span className="ml-1 my-auto">
                {auth.fullName.split(" ")[0]}
              </span>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-emerald-700 rounded-box z-1 mt-3 w-52 p-2 shadow text-slate-200"
            >
              <li>
                <Link href={"/admin/profile"}>Profile</Link>
              </li>
              <li>
                <button onClick={() => onLogout()}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
