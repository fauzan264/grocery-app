"use client";
import CartIcon from "@/features/cart/components/CartIcon";
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import useAuthStore from "@/store/useAuthStore";
import UserDropdown from "./UserDropdown";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { id } = useAuthStore();
  const isAuthenticated = !!id;
  const pathname = usePathname();

  return (
    <nav className="navbar fixed font-bold shadow-sm transition duration-300 left-0 top-0 z-99 px-10 bg-emerald-900 text-gray-200">
      <div className="navbar-start gap-5">
        <Link href="/" className="hover:text-amber-400 transition">
          My Grocery
        </Link>
      </div>

      <div className="navbar-end hidden lg:flex items-center gap-6">
        {!pathname.startsWith("/admin") && <CartIcon />}
        {isAuthenticated ? <UserDropdown /> : <AuthButtons />}
      </div>
    </nav>
  );
}
