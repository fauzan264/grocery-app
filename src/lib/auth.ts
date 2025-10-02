type AnyObj = Record<string, unknown>;

const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

export function findTokenInObject(
  obj: AnyObj,
  depth = 0,
  maxDepth = 3,
  visited: Set<object> = new Set()
): string | null {
  if (!obj || typeof obj !== "object") return null;
  if (visited.has(obj)) return null;
  visited.add(obj);

  // direct common properties
  const directCandidates: unknown[] = [
    obj["token"],
    obj["accessToken"],
    obj["authToken"],
    (obj["data"] as AnyObj | undefined)?.["token"],
    (obj["data"] as AnyObj | undefined)?.["accessToken"],
    (obj["state"] as AnyObj | undefined)?.["token"],
    (obj["value"] as AnyObj | undefined)?.["token"],
    (obj["auth"] as AnyObj | undefined)?.["token"],
  ];

  for (const c of directCandidates) {
    if (typeof c === "string" && c.trim()) return c;
  }

  if (depth >= maxDepth) return null;

  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) {
      if (jwtRegex.test(v) || v.length > 20) return v;
    } else if (typeof v === "object" && v !== null) {
      const nested = findTokenInObject(v as AnyObj, depth + 1, maxDepth, visited);
      if (nested) return nested;
    }
  }

  return null;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  const candidates = [
    "authToken",
    "auth_token",
    "authToken_v2",
    "authTokenStorage",
    "token",
    "auth",
  ];

  for (const key of candidates) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed: unknown = JSON.parse(raw);

        if (typeof parsed === "string" && parsed.trim()) {
          return parsed.trim();
        }

        if (typeof parsed === "object" && parsed !== null) {
          const obj = parsed as AnyObj;

          if (typeof obj["token"] === "string") return obj["token"];
          if (typeof obj["accessToken"] === "string") return obj["accessToken"];

          const data = obj["data"] as AnyObj | undefined;
          if (data) {
            if (typeof data["token"] === "string") return data["token"];
            if (typeof data["accessToken"] === "string") return data["accessToken"];
          }

          const auth = obj["auth"] as AnyObj | undefined;
          if (auth && typeof auth["token"] === "string") return auth["token"];

          const state = obj["state"] as AnyObj | undefined;
          if (state && typeof state["token"] === "string") return state["token"];
        }
      } catch {
        if (typeof raw === "string" && raw.length > 20) return raw.trim();
      }
    } catch {
      // abaikan error per key
    }
  }

  return null;
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) {
    try {
      localStorage.removeItem("auth_token");
    } catch {}
    try {
      localStorage.removeItem("authToken");
    } catch {}
    return;
  }

  try {
    localStorage.setItem("auth_token", token);
  } catch {}

  try {
    localStorage.setItem("authToken", JSON.stringify({ token }));
  } catch {}
}

export function clearStoredToken() {
  setStoredToken(null);
}
