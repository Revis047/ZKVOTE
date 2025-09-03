export function apiBases() {
  const netlify = "/.netlify/functions/api";
  const local = "/api";
  const prod = "https://zkvote.netlify.app/.netlify/functions/api";
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h.endsWith("netlify.app")) {
      return [netlify, prod];
    }
  }
  return [local, netlify, prod];
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const bases = apiBases();
  let lastErr: any;
  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) {
        let msg = "";
        try {
          const data = await res.json();
          msg = (data as any)?.error || "";
        } catch {}
        // Server responded; stop fallback and surface message
        throw new Error(msg || `HTTP ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (e: any) {
      lastErr = e;
      // Only try next base on network errors
      if (
        typeof e?.message === "string" &&
        /failed to fetch|network/i.test(e.message)
      ) {
        continue;
      }
      break;
    }
  }
  throw lastErr ?? new Error("Network error");
}
