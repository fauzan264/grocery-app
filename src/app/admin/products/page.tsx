"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProducts } from "@/app/hooks/useProducts";
import { api } from "@/lib/api";
import ProductTable from "@/components/products/ProductTable";

const queryClient = new QueryClient();

export default function ProductsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full min-h-screen bg-emerald-900/5">
        <main className="px-6 overflow-y-auto">
          <ProductsInner />
        </main>
      </div>
    </QueryClientProvider>
  );
}

function ProductsInner() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    categoryId: undefined as string | undefined,
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const queryParams = useMemo(
    () => ({
      page: filters.page,
      limit: 5,
      search: filters.search || undefined,
      categoryId: filters.categoryId,
    }),
    [filters.page, filters.search, filters.categoryId]
  );

  const { data, isLoading, refetch, isFetching } = useProducts(queryParams);

  // token handling (sama seperti sebelumnya)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  const deleteSingle = async (id: string) => {
    try {
      await api.delete(`/api/products/${id}`);
      await refetch();
      alert("Produk berhasil dihapus");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Gagal menghapus produk: " + err.message);
        console.error(err);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        alert(
          "Gagal menghapus produk: "
          // +
          // (err.response?.data?.message ?? "Unknown error")
        );
        console.error(err.response ?? err);
      } else {
        alert("Gagal menghapus produk: Unknown error");
        console.error(err);
      }
    }
  };

  const deleteBulk = async (ids: string[]) => {
    if (
      !confirm(`Hapus ${ids.length} produk terpilih? Ini tidak bisa di-undo.`)
    )
      return;
    try {
      await Promise.all(ids.map((id) => api.delete(`/api/products/${id}`)));
      await refetch();
      alert("Produk terpilih berhasil dihapus");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Gagal menghapus beberapa produk: " + err.message);
        console.error(err);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        alert(
          "Gagal menghapus beberapa produk: "
          // +
          //   (err.response?.data?.message ?? "Unknown error")
        );
        console.error(err.response ?? err);
      } else {
        alert("Gagal menghapus beberapa produk: Unknown error");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => {
        if (res.data?.success) setCategories(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const totalProducts = data?.meta?.total ?? 0;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full p-3 bg-blue-600 text-white inline-flex items-center justify-center shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 7h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 11h10v8a1 1 0 01-1 1H8a1 1 0 01-1-1v-8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Product Management
            </h1>
            <p className="text-sm text-slate-600">
              Manage product catalog — add, filter, and remove products.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search + Category */}
          <div className="flex items-center gap-2 bg-white rounded shadow px-3 py-2">
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Search products..."
              className="outline-none w-56 sm:w-60 text-sm text-zinc-800"
            />

            {/* Category select */}
            <select
              value={filters.categoryId ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  categoryId: e.target.value || undefined,
                  page: 1,
                }))
              }
              className="ml-2 border rounded px-2 py-1 text-zinc-800"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="px-3 py-1 rounded text-white font-medium bg-blue-500 hover:opacity-95 transition"
            >
              Search
            </button>
          </div>

          {/* Total & Create */}
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <div className="text-xs text-slate-500">Total Products</div>
              <div className="text-lg font-semibold text-slate-700">
                {totalProducts}
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/products/create")}
              className="px-3 py-1 rounded bg-blue-600 hover:opacity-95 transition font-medium text-white text-sm"
            >
              Create
            </button>
          </div>
        </div>
      </header>

      {/* Main card */}
      <section>
        <div className="rounded shadow overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">List of products</div>
              {isFetching && (
                <div className="text-xs text-slate-700/60">Load...</div>
              )}
            </div>
            <div className="text-sm text-slate-700/70">
              Hal {data?.meta?.page ?? filters.page} /{" "}
              {data?.meta?.totalPages ?? 1}
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
          ) : (data?.items?.length ?? 0) === 0 ? (
            <div className="p-8 text-center text-slate-700">
              <div className="text-lg font-semibold mb-2">Belum ada produk</div>
              <div className="text-sm mb-4">
                {`Tambahkan produk baru menggunakan tombol "Create Product".`}
              </div>
              <button
                onClick={() => router.push("/admin/products/create")}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Buat Produk
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductTable
                    products={data?.items ?? []}
                    onDelete={deleteSingle}
                    onBulkDelete={deleteBulk}
                    // catatan: tidak meneruskan onEdit lagi — edit di-handle lewat halaman terpisah
                  />
                </Suspense>
              </div>

              {/* Pagination */}
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-slate-700">
                  Displaying {data?.items?.length ?? 0} from {totalProducts}{" "}
                  products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-label="previous page"
                    disabled={
                      !data || (data?.meta?.page ?? 1) === 1 || isFetching
                    }
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        page: Math.max(1, p.page - 1),
                      }))
                    }
                    className="flex items-center justify-center w-9 h-9 rounded border disabled:opacity-50 hover:bg-gray-100 text-gray-800"
                  >
                    ←
                  </button>

                  <div className="text-gray-800 px-4">
                    Page {data?.meta?.page ?? filters.page} of{" "}
                    {data?.meta?.totalPages ?? 1}
                  </div>

                  <button
                    aria-label="next page"
                    disabled={
                      !data ||
                      (data?.meta?.page ?? 1) >=
                        (data?.meta?.totalPages ?? 1) ||
                      isFetching
                    }
                    onClick={() =>
                      setFilters((p) => ({ ...p, page: p.page + 1 }))
                    }
                    className="flex items-center justify-center w-9 h-9 rounded border disabled:opacity-50 hover:bg-gray-100 text-gray-800"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* NOTE: Edit modal removed — editing handled on separate page /admin/products/[id]/edit */}
    </div>
  );
}
