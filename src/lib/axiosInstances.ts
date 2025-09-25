import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper to attach token easily
export function setAuthToken(token?: string) {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
}