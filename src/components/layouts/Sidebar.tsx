import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menus = [
    { label: "Dashboard", href: "/admin" },
    { label: "Store", href: "/admin/store" },
    { label: "Product", href: "/admin/products" }
  ];

  return (
    <div className="flex flex-1 pt-16 min-h-screen">
      <div className="drawer lg:drawer-open">
        <input type="checkbox" id="my-drawer" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center">
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-slate-700 min-h-full w-80 p-4 pt-18 md:pt-3">
            {menus.map((menu, i) => (
              <li
                key={i}
                className={`text-md text-slate-200 font-semibold  ${pathname.split("/").slice(0, 3).join("/") == menu.href ? "bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-md" : ""}`}
              >
                <Link href={menu.href}>{menu.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
