"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";

export type ProductImage = {
  id: string;
  url: string;
  altText?: string;
  isExisting?: boolean; // true kalau dari database
};

type Props = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void; // optional callback untuk hapus existing image
};

export default function ProductImages({
  images,
  setImages,
  existingUrls = [],
  onRemoveExisting,
}: Props) {
  const previews = useMemo<ProductImage[]>(() => {
    const newPreviews = images.map((file, idx) => ({
      id: `file-${idx}-${file.name}`,
      url: URL.createObjectURL(file),
      altText: `New image: ${file.name}`,
      isExisting: false,
    }));

    const existingPreviews = existingUrls.map((url, idx) => ({
      id: `existing-${idx}`,
      url,
      altText: `Existing image ${idx + 1}`,
      isExisting: true,
    }));

    return [...existingPreviews, ...newPreviews];
  }, [images, existingUrls]);

  // cleanup URL blob untuk file baru
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (!p.isExisting) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [previews]);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemove = (img: ProductImage) => {
    if (img.isExisting) {
      onRemoveExisting?.(img.url);
    } else {
      setImages((prev) =>
        prev.filter((file, idx) => img.id !== `file-${idx}-${file.name}`)
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Product Images</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleSelectFiles}
        className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((p) => (
            <div
              key={p.id}
              className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <Image
                src={p.url}
                alt={p.altText ?? "Product image"}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemove(p)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow hover:bg-red-600 transition"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
