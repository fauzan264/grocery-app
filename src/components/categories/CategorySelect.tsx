"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { api } from "../../lib/api";
import CategoryTree, { CategoryNode } from "./CategoryTree";
import AddCategoryModal from "./AddCategoryModal";

type CategoryFlat = { id: string; name: string };

type Props<T extends FieldValues> = {
  register?: UseFormRegister<T>;
  // setValue left optional for backward compat but not required in this implementation
  setValue?: UseFormSetValue<T>;
  name?: Path<T>;
  token?: string | null;
  placeholder?: string;
  label?: string;
  // controlled props (for Controller)
  value?: string | null;
  onChange?: (id: string | null) => void;
};

export default function CategorySelect<T extends FieldValues>({
  register,
  // setValue not required; kept for signature compatibility
  setValue,
  name,
  token,
  placeholder = "Pilih kategori (opsional)",
  label = "Kategori",
  value: controlledValue,
  onChange: controlledOnChange,
}: Props<T>) {
  const [options, setOptions] = useState<CategoryFlat[]>([]);
  const [tree, setTree] = useState<CategoryNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const timerRef = useRef<number | null>(null);

  // helper: get auth header if token provided
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  // initial load (flat options + tree)
  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [listRes, treeRes] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/categories/tree"),
        ]);

        if (!mounted) return;

        const listData = Array.isArray(listRes.data?.data) ? listRes.data.data : [];
        const list: CategoryFlat[] = listData.map((c: unknown) => {
          // defensive mapping
          const obj = c as { id?: unknown; name?: unknown };
          return { id: String(obj.id ?? ""), name: String(obj.name ?? "") };
        });

        setOptions(list);

        const treeData: CategoryNode[] = Array.isArray(treeRes.data?.data) ? treeRes.data.data : [];
        setTree(treeData);
      } catch (err) {
        console.error("fetch categories error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  // search with debounce using backend search endpoint
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      if (!query) {
        try {
          const res = await api.get("/api/categories");
          const listData = Array.isArray(res.data?.data) ? res.data.data : [];
          const list: CategoryFlat[] = listData.map((c: unknown) => {
            const obj = c as { id?: unknown; name?: unknown };
            return { id: String(obj.id ?? ""), name: String(obj.name ?? "") };
          });
          setOptions(list);
        } catch (err) {
          console.error("search categories error", err);
        }
        return;
      }
      try {
        const res = await api.get("/api/categories", { params: { search: query } });
        const listData = Array.isArray(res.data?.data) ? res.data.data : [];
        const list: CategoryFlat[] = listData.map((c: unknown) => {
          const obj = c as { id?: unknown; name?: unknown };
          return { id: String(obj.id ?? ""), name: String(obj.name ?? "") };
        });
        setOptions(list);
      } catch (err) {
        console.error("search categories error", err);
      }
    }, 350);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [query]);

  // register hidden input if register provided (legacy integration)
  const reg = name && register ? register(name) : undefined;

  // when controlledValue (Controller) changes, find label and set it
  useEffect(() => {
    let mounted = true;
    const resolveLabel = async () => {
      if (!controlledValue) {
        if (mounted) setSelectedLabel("");
        return;
      }
      // try find in loaded options first
      const found = options.find((o) => o.id === controlledValue);
      if (found) {
        if (mounted) setSelectedLabel(found.name);
        return;
      }
      // fallback: fetch single category detail
      try {
        const res = await api.get(`/api/categories/${controlledValue}`);
        const nameFromServer = res.data?.data?.name ?? "";
        if (mounted) setSelectedLabel(String(nameFromServer));
      } catch (err) {
        console.warn("failed to fetch single category name", err);
        if (mounted) setSelectedLabel("");
      }
    };
    resolveLabel();
    return () => {
      mounted = false;
    };
  }, [controlledValue, options]);

  // called when a category is selected from list / tree / created
  const handleSelect = (id: string, label: string) => {
    setSelectedLabel(label);
    setOpenDropdown(false);

    // 1) Controlled mode (Controller) -> call provided onChange
    if (typeof controlledOnChange === "function") {
      controlledOnChange(id);
      return;
    }

    // 2) If register is used (hidden input), call its onChange to notify RHF
    if (reg && typeof reg.onChange === "function") {
      // simulate synthetic event to keep compatibility with register
      reg.onChange({ target: { value: id } } as unknown as Event);
      return;
    }

    // 3) As last resort, if setValue is provided and name exists, use it.
    //    We try to call setValue but keep typing safe by casting Path<T> for the name.
    if (setValue && name) {
      // Type coercion minimal and safe here — react-hook-form expects the field name and value.
      setValue(name as Path<T>, id as unknown as T[Extract<typeof name, string>], { shouldValidate: true });
      return;
    }

    console.warn("CategorySelect: no handler available to propagate selected category");
  };

  const handleCreated = (created: { id: string; name: string }) => {
    setOptions((prev) => [created, ...prev]);
    // optionally re-fetch tree if desired — left as no-op for now
    setTree((prev) => prev);
    handleSelect(created.id, created.name);
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-800">{label}</label>

      <div className="relative">
        <input
          type="text"
          value={selectedLabel || query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedLabel("");
            setOpenDropdown(true);
          }}
          onFocus={() => setOpenDropdown(true)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Tombol tambah kategori */}
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition text-gray-700"
            title="Tambah kategori"
          >
            + Tambah
          </button>
        </div>

        {/* render hidden input only if register is provided (legacy) */}
        {name && register && <input type="hidden" {...register(name)} />}

        {/* Dropdown */}
        {openDropdown && (
          <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-56 overflow-auto shadow-lg">
            {loading ? (
              <div className="p-3 text-sm text-slate-500">Memuat...</div>
            ) : options.length === 0 ? (
              <div className="p-3 text-sm text-slate-500">Tidak ada kategori</div>
            ) : (
              options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.id, opt.name)}
                  className="p-3 text-sm text-gray-800 hover:bg-slate-100 cursor-pointer"
                >
                  {opt.name}
                </div>
              ))
            )}
            <div className="p-2 border-t text-xs text-slate-500 bg-gray-50">Atau pilih dari tree di bawah</div>
            <div className="p-2">
              <CategoryTree
                tree={tree ?? []}
                onSelect={(id, name) => {
                  handleSelect(id, name);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-1">Cari kategori atau tambah baru. Data diambil dari server.</p>

      <AddCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        token={token}
        parentOptions={options}
        onCreated={handleCreated}
      />
    </div>
  );
}
