export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  const candidates = ["auth_token", "authToken", "token", "auth"];
  for (const key of candidates) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    // langsung token JWT?
    if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(raw)) {
      return raw;
    }
    try {
      const obj = JSON.parse(raw);
      const paths = [
        obj?.token,
        obj?.data?.token,
        obj?.data?.accessToken,
        obj?.state?.token,
        obj?.auth?.token,
        obj?.value?.token,
      ];
      for (const p of paths) {
        if (typeof p === "string" && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(p)) {
          return p;
        }
      }
    } catch {
      // not JSON -> ignore
    }
  }

  // fallback: scan seluruh localStorage (opsional)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const v = localStorage.getItem(k);
      if (!v) continue;
      if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(v)) return v;
      try {
        const obj = JSON.parse(v);
        const maybe = obj?.token ?? obj?.data?.token ?? obj?.state?.token;
        if (typeof maybe === "string" && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(maybe)) return maybe;
      } catch {}
    }
  } catch {}

  return null;
}
