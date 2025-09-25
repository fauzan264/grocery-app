import axios from "axios";
import api from "./api";
import { getStoredToken } from "./auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 1 * 1024 * 1024; // 1MB

export async function uploadFileToServer(file: File) {
  if (!file) throw new Error("No file provided");

  // quick client-side validation (sama dengan server)
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Invalid file type. Gunakan JPG/PNG/WEBP/GIF");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File terlalu besar. Maks 1MB");
  }

  console.log("uploadFileToServer -> file:", file.name, file.type, file.size);
  const fd = new FormData();
  // pastikan menggunakan nama field 'file' karena backend pake upload.single("file")
  fd.append("file", file, file.name);

  const token = getStoredToken();
  console.log("upload -> base:", api.defaults.baseURL, " token:", token);

  try {
    // Karena instance axios punya header default JSON, kita set Content-Type multipart di request ini.
    // Browser akan mengurus boundary walaupun kita set 'multipart/form-data' di header.
    const res = await api.post<{ success: boolean; data: { url: string; publicId?: string } }>(
      "/api/uploads",
      fd,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("upload success ->", res.data);
    return res.data.data;
  } catch (err) {
    // logging error yang jelas
    if (axios.isAxiosError(err)) {
      console.error("uploadFileToServer error:", err.response?.status, err.response?.data);
      // lemparkan response message agar UI bisa tunjukin pesan server
      throw new Error(
        err.response?.data?.message ??
        (err.response?.data ? JSON.stringify(err.response.data) : err.message)
      );
    } else {
      console.error("uploadFileToServer unknown error:", err);
      throw err;
    }
  }
}
