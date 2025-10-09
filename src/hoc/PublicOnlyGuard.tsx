"use client";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

function PublicOnlyGuard<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithPublicOnlyGuard = (props: P) => {
    const auth = useAuthStore();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // Tunggu hydration
      if (!auth._hasHydrated) return;

      // Kalau sudah login, redirect sesuai role
      if (auth.role) {
        if (auth.role === "CUSTOMER") {
          router.replace("/");
        } else {
          router.replace("/admin");
        }
        return;
      }

      // Belum login - boleh akses
      setIsReady(true);
    }, [auth._hasHydrated, auth.role, router]);

    // Render nothing saat hydration
    if (!auth._hasHydrated) {
      return null;
    }

    // Loading saat checking
    if (!isReady) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithPublicOnlyGuard.displayName = `withPublicOnlyGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithPublicOnlyGuard;
}

export default PublicOnlyGuard;
