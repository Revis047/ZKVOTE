import type { Results } from "@shared/api";

function intensity(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.min(1, value / max);
}

const regions: { id: keyof Results["regions"]; name: string }[] = [
  { id: "NA", name: "North America" },
  { id: "SA", name: "South America" },
  { id: "EU", name: "Europe" },
  { id: "AF", name: "Africa" },
  { id: "AS", name: "Asia" },
  { id: "OC", name: "Oceania" },
];

export default function RegionHeat({ data }: { data: Results }) {
  const totals = Object.fromEntries(
    regions.map((r) => [
      r.id,
      Object.values(data.regions[r.id]).reduce((a, b) => a + b, 0),
    ]),
  ) as Record<string, number>;
  const max = Math.max(1, ...Object.values(totals));

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
      {regions.map((r) => {
        const t = totals[r.id];
        const x = intensity(t, max);
        return (
          <div
            key={r.id}
            className="relative overflow-hidden rounded-xl border bg-card/80 p-4"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  `radial-gradient(120% 120% at 50% 0%, hsl(var(--accent)/${0.25 * x}) 0%, transparent 60%), ` +
                  `radial-gradient(120% 120% at 80% 100%, hsl(var(--primary)/${0.35 * x}) 0%, transparent 60%)`,
                filter: "saturate(1.1)",
              }}
            />
            <div className="relative z-[1]">
              <div className="text-sm text-muted-foreground">{r.name}</div>
              <div className="mt-2 text-2xl font-bold">{t}</div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent to-primary"
                  style={{ width: `${Math.max(6, x * 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
