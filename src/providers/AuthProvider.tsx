"use client";

import { sessionLogin } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, setAuth } = useAuthStore();

  // buat QueryClient sekali per client (tidak recreate tiap render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60, // 1 menit
          },
        },
      })
  );

  const onAuthSessionLogin = async () => {
    try {
      if (!token) return;
      const response = await sessionLogin({ token });

      setAuth({
        token,
        id: response?.data?.data?.id,
        fullName: response?.data?.data?.full_name,
        role: response?.data?.data?.user_role ?? response?.data?.data?.role,
      });

      // -------------------------------------------------------
      // Opsional: jika kamu mau reload/refresh data global setelah login
      // uncomment baris berikut untuk invalidasi query tertentu:
      // queryClient.invalidateQueries({ queryKey: ['users'] });
      // atau invalidateQueries({ queryKey: ['currentUser'] }) dsb.
      // -------------------------------------------------------

    } catch (error) {
      console.log("session login error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      onAuthSessionLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* optional devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
