"use client";

import { useState } from "react";
import { useUsers, useDeleteUser } from "@/app/hooks/useUsers";

export default function UserListPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string | undefined>();

  const { data, isLoading } = useUsers(page, 10, q, role);
  const deleteMut = useDeleteUser();

  return (
  <div className="p-6 text-gray-900 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-semibold mb-4">User Management</h1>

    {/* Search & Filter */}
    <div className="flex items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search user..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-64 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      <select
        onChange={(e) => setRole(e.target.value || undefined)}
        value={role}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Roles</option>
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="ADMIN">Admin</option>
        <option value="CUSTOMER">Customer</option>
      </select>
    </div>

    {/* Table */}
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Full Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created At</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : (
            data?.data.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{u.full_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone_number || "-"}</td>
                <td className="p-3">{u.user_role}</td>
                <td
                  className={`p-3 font-medium ${
                    u.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {u.status}
                </td>
                <td className="p-3">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => deleteMut.mutate(u.id)}
                    disabled={deleteMut.isPending}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {data?.meta.page} of {data?.meta.pages}
      </span>
      <button
        onClick={() =>
          setPage((p) => (p < (data?.meta.pages || 1) ? p + 1 : p))
        }
        disabled={page === data?.meta.pages}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);
}
