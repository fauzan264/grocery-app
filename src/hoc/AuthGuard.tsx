"use client";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect, useState, Suspense } from "react";

function AuthGuardLogic<P extends object>({
  WrappedComponent,
  allowedRoles,
  props,
}: {
  WrappedComponent: ComponentType<P>;
  allowedRoles: string[];
  props: P;
}) {
  const auth = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!auth._hasHydrated) return;

    if (!auth.role) {
      const callbackUrl = window.location.pathname + window.location.search;
      router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (auth.role && !allowedRoles.includes(auth.role)) {
      router.replace(auth.role === "CUSTOMER" ? "/" : "/admin");
      return;
    }

    setIsReady(true);
  }, [auth._hasHydrated, auth.role, router, allowedRoles]);

  if (!auth._hasHydrated || !isReady) {
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
}

function AuthGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[]
) {
  const WithAuthGuardComponent = (props: P) => {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <AuthGuardLogic
          WrappedComponent={WrappedComponent}
          allowedRoles={allowedRoles}
          props={props}
        />
      </Suspense>
    );
  };

  WithAuthGuardComponent.displayName = `withAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuardComponent;
}

export default AuthGuard;
