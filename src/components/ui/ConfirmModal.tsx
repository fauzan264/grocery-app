"use client";

import React from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onCancel,
  onConfirm,
  loading = false,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode | string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-6 transform transition-all">
        <h3 id="confirm-modal-title" className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        <div className="text-sm text-slate-600 mb-5">{message}</div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50 transition"
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
