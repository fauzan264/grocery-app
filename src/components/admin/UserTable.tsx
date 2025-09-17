"use client";
import React from "react";
import Image from "next/image";
import { IUser } from "../../app/types/user";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <p className="mb-4 text-gray-800">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: {
  users: IUser[];
  onEdit: (u: IUser) => void;
  onDelete: (u: IUser) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-800 text-white">
          <tr className="text-left">
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Dibuat</th>
            <th className="p-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="p-3 flex items-center gap-3">
                {u.photo_profile ? (
                  <Image
                    src={u.photo_profile}
                    alt={u.full_name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-medium">
                    {u.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {u.full_name}
                  </div>
                  <div className="text-xs text-gray-500">{u.id}</div>
                </div>
              </td>
              <td className="p-3 text-gray-700">{u.email}</td>
              <td className="p-3 text-gray-700">{u.phone_number ?? "-"}</td>
              <td className="p-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {u.user_role}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="p-3 text-gray-700">
                {new Date(u.created_at).toLocaleString()}
              </td>
              <td className="p-3 text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
