import api from "./api";

export async function uploadFileToServer(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post<{ success:boolean; data: { url: string; publicId: string } }>("/api/uploads", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data.data;
}
