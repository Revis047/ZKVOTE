import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Globe from "@/components/Globe";
import Countdown from "@/components/Countdown";
import type { Results } from "@shared/api";

const END_DATE = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
})();

export default function ResultsPage() {
  const [data, setData] = useState<Results | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const res = await fetch("/api/results");
      const json = (await res.json()) as Results;
      if (mounted) setData(json);
    }
    fetchData();
    const id = setInterval(fetchData, 2500);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="relative pt-20">
        <section className="relative min-h-[70vh] overflow-hidden">
          <Globe />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_10%,rgba(34,211,238,0.2)_0%,rgba(0,0,0,0)_60%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-bold">Live Results</h1>
                <p className="mt-2 text-muted-foreground">Encrypted, aggregated, and globally verifiable.</p>
              </div>
              <Countdown target={END_DATE} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {data ? (
                Object.entries(data.tallies).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border bg-card/80 p-4 shadow-[0_0_20px_theme(colors.primary.DEFAULT/.15)]"
                  >
                    <div className="text-sm text-muted-foreground">{labelFor(k)}</div>
                    <div className="mt-2 text-3xl font-extrabold">{v}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">Loading…</div>
              )}
            </div>

            <div className="mt-10 text-xs text-muted-foreground">
              Regional breakdown updates every few seconds based on anonymous tallies.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
