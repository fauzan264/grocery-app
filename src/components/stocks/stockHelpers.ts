export function normalizeApiList<T>(resp?: { items?: T[] } | T[]): T[] {
  if (!resp) return [];
  return Array.isArray(resp) ? resp : resp.items ?? [];
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === "string") return maybeMsg;
    return JSON.stringify(maybeMsg);
  }
  return String(err ?? "Unknown error");
}
