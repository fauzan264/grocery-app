"use client";
import React, { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import { useDeleteUser } from "@/app/hooks/useUsers";
import UserTable from "@/components/admin/UserTable";
import UserFormModal from "@/components/admin/UserFormModal";
import { IUser } from "@/app/types/user";
import api from "@/lib/api";

// ---- TYPINGS ----
type PaginatedUsers = {
  data: IUser[];
  meta: {
    page: number;
    pages: number;
    total: number;
  };
};

// ---- API CALL ----
async function fetchUsers(
  page: number,
  q?: string,
  limit = 6
): Promise<PaginatedUsers> {
  const params: Record<string, string | number> = { page, limit };
  if (q) params.q = q;

  const res = await api.get<{
    success: boolean;
    message?: string;
    data: PaginatedUsers;
  }>("/api/users", { params });

  return res.data.data;
}

export default function UserListPage() {
  // ambil role untuk conditional UI (mis. hide Create untuk non-super)
  const { role } = useAuthStore();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<IUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IUser | null>(null);

  // react-query v5 usage
  const pageSize = 6;

  const { data, isLoading, isFetching } = useQuery<PaginatedUsers, Error>({
    queryKey: ["users", page, q, pageSize], // ⬅️ masukin pageSize biar cache unik per ukuran
    queryFn: () => fetchUsers(page, q, pageSize), // ⬅️ lempar limit ke fetchUsers
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });

  const deleteMut = useDeleteUser();

  const meta = data?.meta ?? { total: 0, page: 1, pages: 1 };
  const totalUsers = meta.total;
  const pageNum = meta.page;
  const totalPages = meta.pages;
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);

  const onSearch = () => {
    setPage(1);
    // queryKey includes `q` so react-query will refetch automatically
  };

  return (
    <div className="p-8 min-h-screen bg-emerald-900/5">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-emerald-900 text-white inline-flex items-center justify-center shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                fill="currentColor"
              />
              <path d="M4 22c0-4 4-7 8-7s8 3 8 7" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-300">
              Account Management
            </h1>
            <p className="text-sm text-slate-200/70">
              Manage user accounts — create, edit, and delete.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex items-center gap-2 bg-white rounded shadow px-3 py-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              placeholder="Cari nama atau email..."
              className="outline-none w-56 sm:w-80 text-sm text-zinc-500"
            />
            <button
              onClick={onSearch}
              className="px-3 py-1 rounded text-white font-medium bg-amber-400 hover:opacity-95 transition"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-sm">
              <div className="text-s text-emerald-400">Total Users</div>
              <div className="text-lg font-semibold text-emerald-400">
                {totalUsers}
              </div>
            </div>

            {/* Hanya SUPER_ADMIN yang melihat tombol Create User (manage user) */}
            {role === "SUPER_ADMIN" ? (
              <button
                onClick={() => setOpenCreate(true)}
                className="px-4 py-2 rounded bg-emerald-200 hover:opacity-95 transition font-medium text-zinc-800"
              >
                Create User
              </button>
            ) : (
              <div className="text-xs text-slate-500 px-3 py-2 rounded border">
                Limited access
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <section>
        <div className="rounded shadow overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">List of users</div>
              {isFetching && (
                <div className="text-xs text-slate-700/60">Load...</div>
              )}
            </div>
            <div className="text-sm text-slate-700/70">
              Hal {pageNum} / {totalPages}
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-700/10 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (data?.data?.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-slate-700">
              <div className="text-lg font-semibold mb-2">
                Belum ada pengguna
              </div>
              <div className="text-sm mb-4">
                {`Tambahkan pengguna baru dengan tombol "Tambah User".`}
              </div>

              {/* hanya SUPER_ADMIN yang bisa buat user */}
              {role === "SUPER_ADMIN" ? (
                <button
                  onClick={() => setOpenCreate(true)}
                  className="px-4 py-2 rounded bg-emerald-200"
                >
                  Buat User
                </button>
              ) : (
                <div className="text-sm text-slate-500">
                  Tidak ada aksi tersedia.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* wrapper untuk efek slide */}
              <div
                className={`overflow-x-auto transition-transform duration-300 ease-out ${
                  isFetching && slideDir === "left"
                    ? "-translate-x-6 opacity-80"
                    : ""
                } ${isFetching && slideDir === "right" ? "translate-x-6 opacity-80" : ""}`}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <UserTable
                    users={data?.data ?? []}
                    // hanya pass handler kalau SUPER_ADMIN, dan beri flag canManage
                    onEdit={
                      role === "SUPER_ADMIN" ? (u) => setEditing(u) : undefined
                    }
                    onDelete={
                      role === "SUPER_ADMIN"
                        ? (u) => setConfirmDelete(u)
                        : undefined
                    }
                    canManage={role === "SUPER_ADMIN"}
                  />
                </Suspense>
              </div>

              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-700">
                  Displaying {data?.data?.length ?? 0} from {totalUsers} users
                </div>

                {/* Kontrol pagination */}
                <div className="flex items-center gap-2">
                  <button
                    aria-label="previous page"
                    disabled={!data || pageNum === 1 || isFetching}
                    onClick={() => {
                      if (!data || pageNum === 1 || isFetching) return;
                      setSlideDir("right");
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    className="flex items-center justify-center w-9 h-9 rounded border disabled:opacity-50 hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-slate-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 16.293a1 1 0 01-1.414 0l-5-5.875a1 1 0 010-1.287l5-5.875a1 1 0 011.507 1.287L9.586 9H16a1 1 0 110 2H9.586l3.627 4.293a1 1 0 01-.506 1.0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="text-gray-600 px-3">
                    Page {pageNum} from {totalPages}
                  </div>

                  <button
                    aria-label="next page"
                    disabled={!data || pageNum >= totalPages || isFetching}
                    onClick={() => {
                      if (!data || pageNum >= totalPages || isFetching) return;
                      setSlideDir("left");
                      setPage((p) => p + 1);
                    }}
                    className="flex items-center justify-center w-9 h-9 rounded border disabled:opacity-50 hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-slate-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 3.707a1 1 0 011.414 0l5 5.875a1 1 0 010 1.287l-5 5.875a1 1 0 01-1.507-1.287L10.414 11H4a1 1 0 110-2h6.414L7.2 5.0a1 1 0 01.093-1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Modals */}
      {openCreate && <UserFormModal onClose={() => setOpenCreate(false)} />}

      {editing && (
        <UserFormModal
          mode="edit"
          defaultValues={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {/* delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">
              Konfirmasi Hapus
            </h3>
            <p className="text-sm text-slate-700/80 mb-4">
              Yakin ingin menghapus user{" "}
              <span className="font-medium">{confirmDelete.full_name}</span>?
              Tindakan ini bisa dikembalikan (soft delete).
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteMut.mutateAsync(confirmDelete.id);
                  } catch (err) {
                    console.error(err);
                    alert("Gagal menghapus user");
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
