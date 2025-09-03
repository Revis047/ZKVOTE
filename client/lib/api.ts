export function apiBases() {
  const local = "/api";
  const netlify = "/.netlify/functions/api";
  const prod = "https://zkvote.netlify.app/.netlify/functions/api";
  // Prefer same-origin routes in dev; fall back to Netlify prod if needed
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
