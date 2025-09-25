import React, { useRef, useState, useEffect } from "react";
import api from "@/lib/api";
import type { AxiosProgressEvent } from "axios";

// DEBUG: set to true while testing; set to false before committing to production
const DEBUG = true;

export default function ImageUploader({
  productId,
  token,
  onUploaded,
}: {
  productId: string;
  token?: string | null;
  onUploaded?: () => Promise<void> | void;
}) {
  const previewsRef = useRef<string[]>([]);
  const MAX_FILES = 5;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      // revoke any remaining blob URLs when component unmounts
      previewsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previewsRef.current = [];
    };
  }, []);

  const onFilesSelected = (filesList: FileList | null) => {
    if (!filesList) return;
    const arr = Array.from(filesList);

    // enforce backend limit
    if (arr.length > MAX_FILES) {
      alert(`Maksimal ${MAX_FILES} file per upload. Hapus beberapa file atau pilih ulang.`);
      // clear input to allow reselect
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // validation: size
    const tooLarge = arr.find((f) => f.size > 1_000_000);
    if (tooLarge) {
      alert("Salah satu file lebih besar dari 1MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // validation: mime type
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const bad = arr.find((f) => !allowed.includes(f.type));
    if (bad) {
      alert("Tipe file tidak didukung. Gunakan jpg/png/gif/webp");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // revoke previously created blob URLs (from ref), then create new previews
    previewsRef.current.forEach((u) => URL.revokeObjectURL(u));
    const urls = arr.map((f) => URL.createObjectURL(f));
    previewsRef.current = urls;

    setSelectedFiles(arr);
    setPreviewUrls(urls);

    // reset input so selecting the same files again will trigger onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function uploadSelectedImages(): Promise<void> {
    if (!productId) {
      alert("Product ID tidak tersedia.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Pilih gambar dulu");
      return;
    }

    // enforce backend limit (multer: upload.array("files", 5))
    if (selectedFiles.length > MAX_FILES) {
      alert(`Maksimal ${MAX_FILES} file. Pilih ulang atau hapus beberapa file.`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fd = new FormData();
    // append all files using the exact field name backend expects: "files"
    selectedFiles.forEach((f) => fd.append("files", f));
    fd.append("productId", productId);

    // --- DEBUG: print FormData entries (temporary) ---
    if (DEBUG) {
      console.log("=== Debug FormData (before send) ===");
      for (const pair of fd.entries()) {
        if (pair[1] instanceof File) {
          console.log("FormData:", pair[0], "=> file:", (pair[1] as File).name, (pair[1] as File).size);
        } else {
          console.log("FormData:", pair[0], "=>", pair[1]);
        }
      }
    }
    // --- END DEBUG ---

    // try to get token from prop first, fallback ke localStorage (opsional)
    const headers: Record<string, string> = {};
    const effectiveToken = token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;

    try {
      // --- DEBUG: inspect axios defaults (temporary) ---
      if (DEBUG) {
        try {
          console.log("axios defaults headers (post):", (api as any).defaults?.headers?.post);
        } catch (e) {
          console.log("could not read axios defaults", e);
        }
      }
      // --- END DEBUG ---

      const res = await api.post("/api/uploads", fd, {
        headers,
        onUploadProgress: (ev: AxiosProgressEvent) => {
          // ev.total bisa undefined di beberapa environment, guard dulu
          const loaded = Number(ev.loaded ?? 0);
          const total = Number(ev.total ?? 0);
          const percent =
            total > 0
              ? Math.round((loaded / total) * 100)
              : Math.round(
                  Math.min((loaded / (selectedFiles.reduce((s, f) => s + f.size, 0) || 1)) * 100, 100)
                );
          setUploadProgress(percent);
        },
        validateStatus: () => true,
      });

      if (DEBUG) console.log("upload response (axios):", res.status, res.data);

      if (res.status >= 200 && res.status < 300) {
        // sukses
        setSelectedFiles([]);
        previewUrls.forEach((u) => URL.revokeObjectURL(u));
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";

        if (onUploaded) await onUploaded();
        alert("Gambar berhasil di-upload");
      } else {
        const serverMsg = res.data?.message ?? `Upload gagal (HTTP ${res.status})`;
        throw new Error(serverMsg);
      }
    } catch (err) {
      console.error("upload error", err);

      // --- DEBUG: fallback test using fetch (temporary) ---
      if (DEBUG) {
        try {
          console.log("Attempting debug fallback using fetch to isolate axios issues...");
          const fetchHeaders: Record<string, string> = {};
          if (effectiveToken) fetchHeaders["Authorization"] = `Bearer ${effectiveToken}`;

          const fetchRes = await fetch("/api/uploads", {
            method: "POST",
            headers: fetchHeaders,
            body: fd,
          });

          const text = await fetchRes.text();
          console.log("fetch fallback status:", fetchRes.status);
          console.log("fetch fallback body (text):", text);

          // If fetch succeeded, show user a different message to help debug
          if (fetchRes.ok) {
            setSelectedFiles([]);
            previewUrls.forEach((u) => URL.revokeObjectURL(u));
            setPreviewUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (onUploaded) await onUploaded();
            alert("(DEBUG) Upload berhasil via fetch fallback — berarti masalah ada di axios instance. Cek axios defaults.");
          } else {
            // rethrow original error after logging fetch results
            console.warn("fetch fallback also failed (see logs)");
            if (err instanceof Error) alert(err.message);
            else alert("Upload gagal");
          }
        } catch (fe) {
          console.error("fetch fallback error", fe);
          if (err instanceof Error) alert(err.message);
          else alert("Upload gagal");
        }
      } else {
        if (err instanceof Error) alert(err.message);
        else alert("Upload gagal");
      }
      // --- END DEBUG ---
    } finally {
      setUploading(false);
      // show bar 100% sebentar jika sukses lalu reset
      setTimeout(() => setUploadProgress(0), 700);
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
        aria-label="Pilih gambar"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
        >
          Add images
        </button>

        <button
          type="button"
          onClick={uploadSelectedImages}
          disabled={uploading || selectedFiles.length === 0}
          className="px-3 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-50"
        >
          {uploading ? `Uploading... ${uploadProgress}%` : "Upload images"}
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedFiles([]);
            previewUrls.forEach((u) => URL.revokeObjectURL(u));
            setPreviewUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="px-3 py-2 rounded border text-gray-500"
        >
          Clear
        </button>
      </div>

      {uploading && (
        <div className="w-full mt-2 bg-gray-100 rounded h-2 overflow-hidden">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {previewUrls.map((u, i) => (
            <div key={i} className="relative w-full h-24 rounded overflow-hidden border">
              {/* Use a plain <img> for blob URLs (more reliable for previews) */}
              <img src={u} alt={`preview-${i}`} className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
