"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();

    // Tampilkan breadcrumb hanya untuk halaman orders
    if (!pathname.startsWith("/orders")) return null;

    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbItems = [{ label: "Home", href: "/" }];

    // Jika di /orders/order-list
    if (pathname === "/orders/order-list") {
        breadcrumbItems.push({
            label: "Order List",
            href: "/orders/order-list",
        });
    }
    // Jika di /orders/[id]
    else if (segments.length === 2 && segments[0] === "orders") {
        breadcrumbItems.push(
            { label: "Order List", href: "/orders/order-list" },
            { label: "Order Detail", href: pathname }
        );
    }

    return (
        <div className="breadcrumbs text-sm mb-4">
            <ul className="flex items-center gap-1 text-gray-600">
                {breadcrumbItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                        {idx !== breadcrumbItems.length - 1 ? (
                            <>
                                <Link
                                    href={item.href}
                                    className="hover:text-black"
                                >
                                    {item.label}
                                </Link>
                            </>
                        ) : (
                            <span className="font-semibold text-gray-800">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
