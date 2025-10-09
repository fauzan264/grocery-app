// types/menu.ts
export interface MenuItem {
  label: string;
  href: string;
  roles: string[];
  icon?: React.ReactNode;
}

export const ADMIN_SIDEBAR_MENUS: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    roles: ["SUPER_ADMIN", "ADMIN_STORE"],
  },
  {
    label: "Store",
    href: "/admin/store",
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Product",
    href: "/admin/products",
    roles: ["SUPER_ADMIN", "ADMIN_STORE"],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    roles: ["SUPER_ADMIN", "ADMIN_STORE"],
  },
  {
    label: "Account Management",
    href: "/admin/users",
    roles: ["SUPER_ADMIN"],
  },
];

export const AUTH_MENUS: MenuItem[] = [
  { label: "Register", href: "/register", roles: [] },
  { label: "Login", href: "/login", roles: [] },
];

export const USER_DROPDOWN_MENUS = [
  {
    label: "Dashboard",
    href: "/admin",
    roles: ["SUPER_ADMIN", "ADMIN_STORE"],
  },
  {
    label: "Profile",
    href: "/admin/profile",
    roles: ["SUPER_ADMIN", "ADMIN_STORE"],
  },
  { label: "Profile", href: "/profile", roles: ["CUSTOMER"] },
  { label: "Orders", href: "/orders/order-list", roles: ["CUSTOMER"] },
];
