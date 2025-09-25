"use client";
import { useState } from "react";
import { useUsers, useDeleteUser } from "@/app/hooks/useUsers";
import RoleGuard from "@/components/auth/RoleGuard";

export default function UserListPage() {
  // hanya super admin boleh masuk halaman ini
  // RoleGuard akan redirect kalau role bukan SUPER_ADMIN
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const { data, isLoading } = useUsers(page, 10, q, roleFilter);
  const deleteMut = useDeleteUser();

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
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
            onChange={(e) => setRoleFilter(e.target.value || undefined)}
            value={roleFilter}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN_STORE">Store Admin</option> {/* diperbaiki */}
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>

        {/* Table ... tetap sama */}
        {/* Pastikan aksi Delete/Edit hanya bisa dilakukan user dengan hak (tapi RoleGuard sudah memaksa SUPER_ADMIN) */}
      </div>
    </RoleGuard>
  );
}
