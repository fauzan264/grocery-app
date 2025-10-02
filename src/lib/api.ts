import axios from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { getStoredToken, setStoredToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL;

// header auth fleksibel (default "Authorization")
const AUTH_HEADER = process.env.NEXT_PUBLIC_AUTH_HEADER || "Authorization";

export const api = axios.create({
  baseURL: BASE,
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window === "undefined") return config;

    // handle FormData
if (config.data instanceof FormData && config.headers) {
  const headers = config.headers as Record<string, string>;
  delete headers["Content-Type"];
  delete headers["content-type"];
}


    // inject token
    const token = getStoredToken();
    if (token) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders;
      (config.headers as AxiosRequestHeaders)[AUTH_HEADER] = `Bearer ${token}`;
    }

    return config;
  }
);

// Response interceptor
api.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    if (typeof window === "undefined") return response;

    const url = response.config?.url ?? "";

    // login/google login response → simpan token
    if (
      typeof url === "string" &&
      (url.includes("/api/auth/login") || url.includes("/api/auth/google"))
    ) {
      let token: string | undefined;

      // ambil dari header (pakai AUTH_HEADER env)
      const headerVal =
        response.headers?.[AUTH_HEADER.toLowerCase()] ||
        response.headers?.[AUTH_HEADER];
      if (typeof headerVal === "string") {
        token = headerVal.startsWith("Bearer ")
          ? headerVal.split(" ")[1]
          : headerVal;
      }

      // fallback dari body
      if (!token) {
        token =
          response.data?.token ??
          response.data?.data?.token ??
          response.data?.data?.accessToken;
      }

      if (token) setStoredToken(token);

      // ambil role user
      let role: string | undefined =
        response.data?.data?.user?.user_role ??
        response.data?.data?.user_role ??
        response.data?.user_role ??
        response.data?.role ??
        response.data?.data?.role;

      if (!role && token) {
        try {
          const profileRes = await axios.get(`${BASE}/api/users/me`, {
            headers: { [AUTH_HEADER]: `Bearer ${token}` },
          });
          role =
            profileRes?.data?.data?.user_role ??
            profileRes?.data?.data?.role ??
            profileRes?.data?.user?.user_role;
        } catch {
          // ignore
        }
      }

      // redirect sesuai role
      if (role === "SUPER_ADMIN" || role === "ADMIN_STORE") {
        window.location.href = "/admin/users";
      } else {
        window.location.href = "/";
      }
    }

    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized, token invalid/expired");
      // optional: clearStoredToken();
    }
    return Promise.reject(error);
  }
);

export default api;
