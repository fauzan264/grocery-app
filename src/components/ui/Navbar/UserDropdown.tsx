"use client";
import { USER_DROPDOWN_MENUS } from "@/constants/menu";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import { useOrderStore } from "@/store/userOrderStore";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function UserDropdown() {
  const { fullName, role, logout } = useAuthStore();
  const router = useRouter();
  const {clearCart} = useCartStore()
  const {clearCurrentOrder, clearCurrentAddress, clearCurrentShipping, clearOrders} = useOrderStore()


  const handleLogout = () => {
    clearCart()
    clearCurrentOrder()
    clearOrders()
    clearCurrentAddress()
    clearCurrentShipping()
    logout();
    router.push("/");
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const firstName = fullName.split(" ")[0];

  const filteredMenus = USER_DROPDOWN_MENUS.filter((menu) =>
    menu.roles.includes(role)
  );

  return (
    <div className="dropdown dropdown-center lg:dropdown-end w-full lg:w-auto">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-md avatar flex w-full lg:w-auto justify-start lg:justify-center"
      >
        <div className="w-7 rounded-full">
          <FaUserCircle className="w-full h-full" />
        </div>
        <span className="ml-1 my-auto">{firstName}</span>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-emerald-700 rounded-box z-1 mt-3 w-full lg:w-52 p-2 shadow text-slate-200"
      >
        {filteredMenus.map((menu) => (
          <li key={menu.href}>
            <button onClick={() => handleNavigation(menu.href)}>
              {menu.label}
            </button>
          </li>
        ))}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
