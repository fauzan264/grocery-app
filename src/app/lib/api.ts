import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { getStoredToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // kalau pakai httpOnly cookie, ubah ini dan backend harus support cookie
});

// request interceptor dengan typing yang sesuai
api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // hanya jalankan di browser
  if (typeof window === "undefined") return config;

  const token = getStoredToken();
  if (token) {
    // pastikan headers ada dan bertipe AxiosRequestHeaders
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    const headers = config.headers as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
  }

  return config;
});

// ------------------------------
// response interceptor: handle login responses (store token + redirect)
// ------------------------------
api.interceptors.response.use(
  // on fulfilled
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    try {
      if (typeof window === "undefined") return response;

      const url = response.config?.url ?? "";

      // Hanya jalankan logic ini untuk response dari endpoint login (sesuaikan jika perlu)
      if (typeof url === "string" && (url.includes("/api/auth/login") || url.includes("/api/auth/google"))) {
        // 1) coba ambil token dari header Authorization
        const authHeader = (response.headers && (response.headers["authorization"] || response.headers["Authorization"])) as string | undefined;

        let token: string | undefined;

        if (authHeader && typeof authHeader === "string") {
          if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
          else token = authHeader;
        }

        // 2) jika belum ada, coba ambil dari body (beberapa API return token di body)
        if (!token) {
          token = response.data?.token ?? response.data?.data?.token ?? response.data?.data?.accessToken ?? undefined;
        }

        // simpan token jika ditemukan
        if (token) {
          try {
            localStorage.setItem("auth_token", token);
          } catch (e) {
            console.warn("Failed to store auth token:", e);
          }
        }

        // 3) coba deteksi role dari response (beberapa shape)
        let role: string | undefined;
        role =
          response.data?.data?.user?.user_role ??
          response.data?.data?.user_role ??
          response.data?.user_role ??
          response.data?.role ??
          response.data?.data?.role;

        // 4) jika role belum ketemu, dan token ada, fetch profil singkat
        if (!role && token) {
          try {
            const tmp = axios.create({ baseURL: BASE });
            const profileRes = await tmp.get("/api/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            role = profileRes?.data?.data?.user_role ?? profileRes?.data?.data?.role ?? profileRes?.data?.user?.user_role;
          } catch (e) {
            // gagal fetch profile -> ignore
          }
        }

        // 5) redirect berdasarkan role (hanya di browser)
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

  // on rejected
  (error) => {
    // optional: handle global 401 / token expired here
    return Promise.reject(error);
  }
);

export default api;
