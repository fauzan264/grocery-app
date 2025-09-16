"use client";
import React, { useState } from "react";
import { useDeleteUser } from "../../app/hooks/useUsers";
import UserTable from "../../components/admin/UserTable";
import UserFormModal from "../../components/admin/UserFormModal";
// gunakan axios instance yang sudah ada (supaya header Authorization ikut)
import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "../types/user";

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
async function fetchUsers(page: number, q?: string): Promise<PaginatedUsers> {
  const params: Record<string, string | number> = { page };
  if (q) params.q = q;
  const res = await api.get("/api/users", { params });
  return res.data;
}

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<IUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IUser | null>(null);

  // react-query v5 usage
  const { data, isLoading, isFetching } = useQuery<PaginatedUsers, Error>({
    queryKey: ["users", page, q],
    queryFn: () => fetchUsers(page, q),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    staleTime: 1000 * 60,
  });

  const deleteMut = useDeleteUser();

  const totalUsers = data?.meta.total ?? 0;
  const pageNum = data?.meta.page ?? 1;
  const totalPages = data?.meta.pages ?? 1;

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
            <h1 className="text-2xl font-semibold text-slate-700">
              Manajemen Akun
            </h1>
            <p className="text-sm text-slate-700/70">
              Kelola akun pengguna — buat, edit, dan hapus.
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
              className="outline-none w-56 sm:w-80 text-sm"
            />
            <button
              onClick={onSearch}
              className="px-3 py-1 rounded text-white font-medium bg-amber-400 hover:opacity-95 transition"
            >
              Cari
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-sm">
              <div className="text-xs text-slate-700/70">Total Pengguna</div>
              <div className="text-lg font-semibold text-emerald-900">
                {totalUsers}
              </div>
            </div>

            <button
              onClick={() => setOpenCreate(true)}
              className="px-4 py-2 rounded bg-emerald-200 hover:opacity-95 transition font-medium"
            >
              Tambah User
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <section>
        <div className="rounded shadow overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">Daftar pengguna</div>
              {isFetching && (
                <div className="text-xs text-slate-700/60">Memuat...</div>
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
              <div className="text-sm mb-4">{`Tambahkan pengguna baru dengan tombol "Tambah User".`}</div>
              <button
                onClick={() => setOpenCreate(true)}
                className="px-4 py-2 rounded bg-emerald-200"
              >
                Buat User
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <UserTable
                  users={data?.data ?? []}
                  onEdit={(u) => setEditing(u)}
                  onDelete={(u) => setConfirmDelete(u)}
                />
              </div>

              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-700">
                  Menampilkan {data?.data?.length ?? 0} dari {totalUsers}{" "}
                  pengguna
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={!data || pageNum === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <div className="text-sm px-3">
                    Hal {pageNum} dari {totalPages}
                  </div>
                  <button
                    disabled={!data || pageNum >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
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
