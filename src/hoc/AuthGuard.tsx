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
      if (!auth._hasHydrated) return;

      if (!auth.role) {
        const search = searchParams.toString();
        const callbackUrl = search ? `${pathname}?${search}` : pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      if (auth.role && !allowedRoles.includes(auth.role)) {
        if (auth.role === "CUSTOMER") {
          router.replace("/");
        } else {
          router.replace("/admin");
        }
        return;
      }

      setIsReady(true);
    }, [auth._hasHydrated, auth.role, pathname, searchParams, router]);

    if (!auth._hasHydrated) {
      return null;
    }

    if (!isReady) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthGuardComponent.displayName = `withAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuardComponent;
}

export default AuthGuard;
