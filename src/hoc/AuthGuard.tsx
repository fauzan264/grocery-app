"use client";
import useAuthStore from "@/store/useAuthStore";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ComponentType, useEffect, useState } from "react";

function AuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthGuardComponent = (props: P) => {
    const auth = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // Wait until Zustand is finished hydrating
      if (!auth._hasHydrated) return;

      // User not logged in - redirect to login
      if (!auth.role) {
        const search = searchParams.toString();
        const callbackUrl = search ? `${pathname}?${search}` : pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      // User role does not match - redirect
      if (!allowedRoles.includes(auth.role)) {
        if (auth.role === "CUSTOMER") {
          router.replace("/");
        } else {
          router.replace("/admin");
        }
        return;
      }

      // ✅ Authorized - show component
      setIsReady(true);
    }, [
      auth._hasHydrated,
      auth.role,
      pathname,
      searchParams,
      router,
      allowedRoles,
    ]);

    // Render nothing during hydration to avoid flash
    if (!auth._hasHydrated) {
      return null;
    }

    // Loading screen saat checking auth
    if (!isReady) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Loading screen when checking auth
    return <WrappedComponent {...props} />;
  };

  WithAuthGuardComponent.displayName = `withAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuardComponent;
}

export default AuthGuard;
