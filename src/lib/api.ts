// lib/api.ts
import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { getStoredToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: BASE,
  // NOTE: jangan set Content-Type default di sini karena ada request yang memakai FormData
  // headers: { "Content-Type": "application/json" }, <-- removed on purpose
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // hanya jalankan di browser
  if (typeof window === "undefined") return config;

  // jika body adalah FormData, pastikan kita tidak memaksakan Content-Type
  // supaya browser bisa menambahkan boundary untuk multipart/form-data
  try {
    if (config.data instanceof FormData) {
      if (config.headers) {
        // delete Content-Type if present
        // use both lowercase and standard names to be safe
        delete (config.headers as any)["Content-Type"];
        delete (config.headers as any)["content-type"];
      }
    }
  } catch (e) {
    // ignore - just a safety guard
    // console.warn("request interceptor FormData check failed", e);
  }

  const token = getStoredToken();
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    const headers = config.headers as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
  }

  return config;
});

// Response interceptor (keep your existing logic)
api.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    try {
      if (typeof window === "undefined") return response;

      const url = response.config?.url ?? "";

      if (typeof url === "string" && (url.includes("/api/auth/login") || url.includes("/api/auth/google"))) {
        const authHeader = (response.headers && (response.headers["authorization"] || response.headers["Authorization"])) as string | undefined;

        let token: string | undefined;

        if (authHeader && typeof authHeader === "string") {
          if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
          else token = authHeader;
        }

        if (!token) {
          token = response.data?.token ?? response.data?.data?.token ?? response.data?.data?.accessToken ?? undefined;
        }

        if (token) {
          try {
            localStorage.setItem("auth_token", token);
          } catch (e) {
            console.warn("Failed to store auth token:", e);
          }
        }

        let role: string | undefined;
        role =
          response.data?.data?.user?.user_role ??
          response.data?.data?.user_role ??
          response.data?.user_role ??
          response.data?.role ??
          response.data?.data?.role;

        if (!role && token) {
          try {
            const tmp = axios.create({ baseURL: BASE });
            const profileRes = await tmp.get("/api/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            role = profileRes?.data?.data?.user_role ?? profileRes?.data?.data?.role ?? profileRes?.data?.user?.user_role;
          } catch (e) {
            // ignore
          }
        }

        if (typeof window !== "undefined") {
          if (role === "SUPER_ADMIN" || role === "ADMIN_STORE") {
            window.location.href = "/admin/users";
          } else {
            window.location.href = "/";
          }
        }
      }
    } catch (err) {
      console.error("post-login interceptor error:", err);
    }

    return response;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;
