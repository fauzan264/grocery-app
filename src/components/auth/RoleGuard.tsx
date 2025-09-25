"use client";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

type Props = {
  children: ReactNode;
  allowedRoles?: string[]; // e.g. ['SUPER_ADMIN', 'ADMIN_STORE']
  redirectTo?: string; // default: '/403'
};

/**
 * RoleGuard
 * - Jika token tidak ada -> redirect ke /login
 * - Jika role tersedia tapi tidak ada di allowedRoles -> redirect ke redirectTo (/403)
 * - Selama role/token belum tersedia -> tampilkan loading placeholder
 */
export default function RoleGuard({
  children,
  allowedRoles = [],
  redirectTo = "/403",
}: Props) {
  const { token, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // kalau belum login -> push ke login
    if (!token) {
      router.replace("/login");
      return;
    }

    // kalau sudah ada token & role diketahui dan role tidak diizinkan -> ke forbidden
    if (role && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.replace(redirectTo);
      return;
    }
  }, [token, role, router, allowedRoles, redirectTo]);

  // show loading sementara token/role belum ready
  if (!token || !role) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600">Memeriksa otorisasi...</div>
      </div>
    );
  }

  // kalau role ada dan diizinkan -> render children
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // redirect sudah dipanggil di effect, jangan render apa-apa
    return null;
  }

  return <>{children}</>;
}
