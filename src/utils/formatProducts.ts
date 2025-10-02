export function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function formatCurrencyRupiah(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "-";
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

export function formatWeight(value: unknown) {
  const w = safeNumber(value);
  return w !== null ? `${w.toLocaleString("id-ID")} g` : "-";
}