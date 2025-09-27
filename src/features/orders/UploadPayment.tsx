"use client";
import { useState, useEffect, DragEvent, ChangeEvent } from "react";

export default function UploadPayment() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [remainingTime, setRemainingTime] = useState(60 * 60); 

    const handleFile = (f: File) => {
        if (f && f.type.startsWith("image/")) {
            setFile(f);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    // Countdown Timer
    useEffect(() => {
        if (remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const expired = remainingTime <= 0;

    return (
        <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
                <span className="font-semibold">Upload Proof of Payment</span>
                <span className={`text-sm font-bold ${expired ? "text-red-500" : "text-green-600"}`}>
                    {expired ? "Expired" : formatTime(remainingTime)}
                </span>
            </div>

            {/* Drag & Drop Area */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!expired) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={expired ? undefined : handleDrop}
                className={`border-2 border-dashed rounded-md p-6 text-center transition 
                    ${expired ? "border-gray-300 bg-gray-100 cursor-not-allowed" :
                    isDragging ? "border-green-500 bg-green-50 cursor-pointer" : "border-gray-300 cursor-pointer"}`}
                onClick={() => !expired && document.getElementById("fileInput")?.click()}
            >
                {file ? (
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="mx-auto h-32 object-contain"
                    />
                ) : (
                    <p className="text-gray-500">
                        {expired ? "Time's up, upload disabled" : "Drag & drop image here or "}
                        {!expired && <span className="text-green-600 font-semibold">browse</span>}
                    </p>
                )}
            </div>

            {/* Hidden Input */}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
                disabled={expired}
            />

            {/* Upload Button */}
            <button
                className={`font-semibold py-2 px-4 rounded-md w-full transition 
                    ${expired ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
                disabled={!file || expired}
            >
                {expired ? "Upload Expired" : "Submit Payment"}
            </button>
        </div>
    );
}
