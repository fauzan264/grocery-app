import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false // kalau pakai httpOnly cookie, ubah ini dan backend harus support cookie
});

// attach Authorization header automatically (request interceptor)
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
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
            // jika sudah sama token di localStorage, tidak perlu overwrite — tapi overwrite juga aman
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
            // redirect ke halaman admin (sesuaikan path kalau perlu)
            window.location.href = "/admin/users";
          } else {
            // bukan admin -> redirect ke dashboard user (atau home)
            window.location.href = "/";
          }
        }
      }
    } catch (err) {
      // jangan crash aplikasi kalau interceptor error
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
