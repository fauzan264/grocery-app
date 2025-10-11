"use client";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_SIDEBAR_MENUS } from "@/constants/menu";

// Helper function untuk check active menu
function isMenuActive(pathname: string, menuHref: string): boolean {
  const currentPath = pathname.split("/").slice(0, 3).join("/");
  return currentPath === menuHref;
}

// Sub-components
interface SidebarMenuItemProps {
  href: string;
  label: string;
  isActive: boolean;
}

function SidebarMenuItem({ href, label, isActive }: SidebarMenuItemProps) {
  return (
    <li
      className={`
        text-md text-slate-200 font-semibold
        ${isActive ? "bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-md" : ""}
      `}
    >
      <Link href={href}>{label}</Link>
    </li>
  );
}

interface SidebarProps {
  children: React.ReactNode;
}

// Main Component
export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useAuthStore();

  // Filter menu berdasarkan role user
  const accessibleMenus = ADMIN_SIDEBAR_MENUS.filter((menu) =>
    menu.roles.includes(role)
  );

  return (
    <div className="flex flex-1 min-h-screen">
      <div className="drawer lg:drawer-open">
        <input type="checkbox" id="my-drawer" className="drawer-toggle" />

        {/* Main Content */}
        <div className="drawer-content flex flex-col w-full">{children}</div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          />

          <ul className="menu bg-slate-700 min-h-full w-80 p-4 pt-18 md:pt-3 h-full">
            {accessibleMenus.map((menu) => {
              const isActive = isMenuActive(pathname, menu.href);

              return (
                <SidebarMenuItem
                  key={menu.href}
                  href={menu.href}
                  label={menu.label}
                  isActive={isActive}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
