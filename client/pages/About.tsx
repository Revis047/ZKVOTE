import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16">
        <h1 className="text-4xl font-extrabold">About ZKVote</h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          ZKVote is a privacy-first, global voting prototype built for the
          Midnight Network. It demonstrates how zero-knowledge proofs enable
          one-person–one-vote without revealing identity or raw ballots.
        </p>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card/70 p-6">
            <h2 className="text-xl font-semibold">Purpose</h2>
            <p className="mt-2 text-muted-foreground">
              Provide a safe, global way to prioritize innovations while
              preserving civil liberties. Anyone can participate using anonymous
              credentials and cryptographic verification.
            </p>
          </div>
          <div className="rounded-2xl border bg-card/70 p-6">
            <h2 className="text-xl font-semibold">How it works</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Issue: you receive a credential with a secret token and region
                flag.
              </li>
              <li>
                Prove: client generates a ZK proof of eligibility for a chosen
                option.
              </li>
              <li>
                Verify: server checks the proof and a nullifier (prevents double
                voting).
              </li>
              <li>
                Tally: only aggregated counts are stored; ballots remain
                encrypted/ephemeral.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Information use</h2>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            We store only anonymous tallies per option and region. Your
            credential token never leaves your device in plain text; the server
            sees a proof and a nullifier derived from it. No names, emails, or
            personal identifiers are collected.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">Voting workflow</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Step title="Credential" desc="Anonymous token issued" />
            <Arrow />
            <Step title="Proof" desc="ZK proof generated client-side" />
            <Arrow />
            <Step title="Verify" desc="Server validates proof + nullifier" />
            <Arrow />
            <Step title="Tally" desc="Only counts are updated" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card/70 p-4 text-center shadow-[0_0_20px_theme(colors.primary.DEFAULT/.12)]">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center sm:flex">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        className="text-muted-foreground"
      >
        <path fill="currentColor" d="M10 17l5-5l-5-5v10z" />
      </svg>
    </div>
  );
}
