"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const adminIndex = segments.indexOf("admin");
  const startIndex = adminIndex !== -1 ? adminIndex + 1 : 0;

  const visibleSegments = segments.slice(startIndex);

  if (visibleSegments.length === 0) return null;

  const formatLabel = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize setiap kata
      .join(" ");
  };

  const breadcrumbItems = visibleSegments.map((segment, index) => {
    const label = formatLabel(segment);

    const actualIndex = startIndex + index;
    const href = "/" + segments.slice(0, actualIndex + 1).join("/");

    return { label, href };
  });

  return (
    <div className="breadcrumbs text-sm mb-4">
      <ul>
        {breadcrumbItems.map((item, idx) => (
          <li key={idx}>
            {idx === breadcrumbItems.length - 1 ? (
              <span className="font-semibold text-gray-800">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
