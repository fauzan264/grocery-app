import { AUTH_MENUS } from "@/constants/menu";
import Link from "next/link";

export default function AuthButtons() {
  return (
    <>
      {AUTH_MENUS.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className="btn btn-sm border-0 bg-amber-400 hover:bg-amber-500 active:bg-amber-500 transition ease-in-out duration-300 text-slate-900 focus:outline-none focus:ring-0"
        >
          {menu.label}
        </Link>
      ))}
    </>
  );
}
