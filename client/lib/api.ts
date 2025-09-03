export function apiBases() {
  const netlify = "/.netlify/functions/api";
  const local = "/api";
  const prod = "https://zkvote.netlify.app/.netlify/functions/api";
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h.endsWith("netlify.app")) {
      // On Netlify prod, hit functions directly to avoid redirect/proxy quirks
      return [netlify, prod];
    }
  }
  // Prefer same-origin /api in dev or Builder preview; fall back to functions
  return [local, netlify, prod];
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const bases = apiBases();
  const errors: any[] = [];
  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      errors.push(e);
      continue;
    }
  }
  throw errors[errors.length - 1] ?? new Error("Network error");
}
