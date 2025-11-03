"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); 

    const breadcrumbItems = segments.map((segment, index) => {
        let label = segment;

        if (segment === "admin") label = "Home";
        else if (segment === "orders") label = "Orders";
        else if (index === segments.length - 1) label = "Order Detail";

        const href = "/" + segments.slice(0, index + 1).join("/");

        return { label, href };
    });

    return (
        <div className="breadcrumbs text-sm mb-4">
            <ul>
                {breadcrumbItems.map((item, idx) => (
                    <li key={idx}>
                        {idx === breadcrumbItems.length - 1 ? (
                            <span className="font-semibold text-gray-800">
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href}>{item.label}</Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
