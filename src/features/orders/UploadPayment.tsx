"use client";
import { useState, useEffect, DragEvent, ChangeEvent } from "react";
import { uploadPaymentProof } from "@/services/payment";
import useAuthStore from "@/store/useAuthStore";
import { useOrderStore } from "@/store/userOrderStore";
import toast from "react-hot-toast";
import Image from "next/image";

export default function UploadPayment({ onSuccess }: { onSuccess: () => void }) {
  const { token } = useAuthStore();
  const currentOrder = useOrderStore((s) => s.currentOrder);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (!currentOrder?.expiredAt) return;

    const end = new Date(currentOrder.expiredAt).getTime();

    const updateRemaining = () => {
      const now = Date.now();
      const diff = Math.floor((end - now) / 1000);
      setRemainingTime(diff > 0 ? diff : 0);
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [currentOrder?.expiredAt]);

  const handleFile = (f: File) => {
    if (f.type.startsWith("image/")) setFile(f);
    else toast.error("Only image files are allowed!");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const expired = remainingTime <= 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleUpload = async () => {
    if (!currentOrder?.id || !file || !token) return;
    setIsUploading(true);
    try {
      await uploadPaymentProof(currentOrder.id, file, token);
      toast.success("Payment proof uploaded! ✅");
      onSuccess();
    } catch {
      toast.error("Upload failed! ❌");
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentOrder) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Upload Proof of Payment</span>
        <span className={`text-sm font-bold ${expired ? "text-red-500" : "text-green-600"}`}>
          {expired ? "Expired" : formatTime(remainingTime)}
        </span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); if (!expired) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={expired ? undefined : handleDrop}
        className={`border-2 border-dashed rounded-md p-6 text-center transition ${expired ? "border-gray-300 bg-gray-100 cursor-not-allowed" : isDragging ? "border-green-500 bg-green-50 cursor-pointer" : "border-gray-300 cursor-pointer"}`}
        onClick={() => !expired && document.getElementById("fileInput")?.click()}
      >
        {file ? (
          <Image src={URL.createObjectURL(file)} alt="Preview" width={200} height={200} className="mx-auto h-32 w-auto object-contain" unoptimized />
        ) : (
          <p className="text-gray-500">
            {expired ? "Time's up, upload disabled" : "Drag & drop image here or "}
            {!expired && <span className="text-green-600 font-semibold">browse</span>}
          </p>
        )}
      </div>

      <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={expired} />

      <button
        onClick={handleUpload}
        disabled={!file || expired || isUploading}
        className={`font-semibold py-2 px-4 rounded-md w-full transition ${expired ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
      >
        {expired ? "Upload Expired" : "Submit Payment"}
      </button>
    </div>
  );
}
