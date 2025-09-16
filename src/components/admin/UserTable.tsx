"use client";
import React from "react";
import Image from "next/image";
import { IUser } from "../../app/types/user";

export function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: ()=>void; onCancel: ()=>void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <p className="mb-3">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Batal</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-500 text-white">Hapus</button>
        </div>
      </div>
    </div>
  );
}

export default function UserTable({
  users,
  onEdit,
  onDelete
}: {
  users: IUser[];
  onEdit: (u:IUser)=>void;
  onDelete: (u:IUser)=>void;
}) {
  return (
    <table className="w-full table-auto text-sm bg-white">
      <thead>
        <tr className="text-left">
          <th className="p-2">User</th>
          <th className="p-2">Email</th>
          <th className="p-2">Phone</th>
          <th className="p-2">Role</th>
          <th className="p-2">Status</th>
          <th className="p-2">Dibuat</th>
          <th className="p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} className="border-t">
            <td className="p-2 flex items-center gap-3">
              {u.photo_profile ? (
                <Image src={u.photo_profile} alt={u.full_name} width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center">{u.full_name.charAt(0).toUpperCase()}</div>
              )}
              <div>
                <div className="font-medium text-slate-700">{u.full_name}</div>
                <div className="text-xs text-slate-700/60">{u.id}</div>
              </div>
            </td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.phone_number ?? "-"}</td>
            <td className="p-2">{u.user_role}</td>
            <td className="p-2">{u.status}</td>
            <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
            <td className="p-2">
              <div className="flex gap-2">
                <button onClick={()=>onEdit(u)} className="px-2 py-1 rounded border text-xs">Edit</button>
                <button onClick={()=>onDelete(u)} className="px-2 py-1 rounded border text-xs bg-red-500 text-white">Hapus</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
