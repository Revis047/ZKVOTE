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

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
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
        lastErr = new Error(msg || `HTTP ${res.status}`);
        // Try next base on any non-OK status
        continue;
      }
      return (await res.json()) as T;
    } catch (e: any) {
      lastErr = e;
      // Try next base on network failures
      continue;
    }
  }
  throw lastErr ?? new Error("Network error");
}
