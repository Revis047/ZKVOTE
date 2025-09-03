import Globe from "@/components/Globe";
import Countdown from "@/components/Countdown";
import VoteCard from "@/components/VoteCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import type { Credential, OptionId, Proof, PollInfo } from "@shared/api";
import { fetchJson } from "@/lib/api";

const OPTIONS: { id: OptionId; label: string; emoji: string }[] = [
  { id: "climate", label: "Climate Tech Breakthroughs", emoji: "🌱" },
  { id: "health", label: "Universal Health Access", emoji: "🧬" },
  { id: "space", label: "Space Exploration", emoji: "🛰️" },
  { id: "ai", label: "Ethical AI", emoji: "🧠" },
  { id: "freedom", label: "Digital Freedom", emoji: "🌐" },
];

export default function Index() {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alreadyOpen, setAlreadyOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poll, setPoll] = useState<PollInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("zkvote-credential");
    if (saved) setCredential(JSON.parse(saved));
    fetchPoll();
    const id = setInterval(fetchPoll, 15000);
    return () => clearInterval(id);
  }, []);

  const deadline = useMemo(() => {
    return poll ? new Date(poll.endsAt).toISOString() : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  }, [poll]);

  async function fetchPoll() {
    const p = await fetchJson<PollInfo>("/poll");
    setPoll(p);
  }

  async function ensureCredential() {
    if (credential) return credential;
    const res = await fetch("/api/credential", { method: "POST" });
    const cred = (await res.json()) as Credential;
    setCredential(cred);
    localStorage.setItem("zkvote-credential", JSON.stringify(cred));
    return cred;
  }

  async function castVote(opt: OptionId) {
    setSelected(opt);
    setBusy(true);
    setError(null);
    try {
      const cred = await ensureCredential();
      const proofRes = await fetch("/api/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cred.token, option: opt, pollId: poll?.id }),
      });
      const proof = (await proofRes.json()) as (Proof & { tokenHash?: string; error?: string });
      if ((proof as any).error) throw new Error((proof as any).error);
      const voteRes = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...proof, pollId: poll?.id, tokenHash: (proof as any).tokenHash, region: (credential ?? { region: "NA" as any }).region }),
      });
      const v = await voteRes.json();
      if (v?.error) throw new Error(v.error);
      setConfirmOpen(true);
    } catch (e: any) {
      const msg = String(e?.message || "Something went wrong");
      if (/nullifier already used/i.test(msg)) {
        setAlreadyOpen(true);
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/60 text-foreground">
      <Header />
      <main className="relative">
        <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-20">
          <Globe />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_10%,rgba(124,58,237,0.25)_0%,rgba(0,0,0,0)_60%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <div className="max-w-3xl">
              <h1 className="bg-gradient-to-r from-primary via-cyan-400 to-fuchsia-400 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-6xl">
                ZKVote — The Future We Choose
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                One world. One vote. Total privacy. 🌍 Vote anonymously with zero-knowledge proofs on the Midnight Network.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button onClick={ensureCredential} disabled={!!credential} className="shadow-[0_0_30px_theme(colors.cyan.400/.35)]">
                  {credential ? "Credential Ready" : "Generate ZK Credential"}
                </Button>
                <Countdown target={deadline} />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-4 py-14">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Which global innovation should humanity prioritize next?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OPTIONS.map((o) => (
              <VoteCard
                key={o.id}
                id={o.id}
                emoji={o.emoji}
                label={o.label}
                active={selected === o.id}
                onClick={() => castVote(o.id)}
              />
            ))}
          </div>
          {error && (
            <div role="alert" className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
          {busy && (
            <div className="mt-6 text-sm text-muted-foreground">Encrypting your vote…</div>
          )}
        </section>

        <section id="learn" className="relative z-10 mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-card/70 p-6 shadow-[0_0_20px_theme(colors.primary.DEFAULT/.15)]">
              <h3 className="text-xl font-semibold">Privacy by Design</h3>
              <p className="mt-2 text-muted-foreground">
                Eligibility is verified using zero-knowledge proofs. Your identity and vote remain private, while the
                system enforces one-vote-per-user with nullifiers.
              </p>
            </div>
            <div className="rounded-2xl border bg-card/70 p-6 shadow-[0_0_20px_theme(colors.accent/.15)]">
              <h3 className="text-xl font-semibold">Built for Midnight</h3>
              <p className="mt-2 text-muted-foreground">
                Powered by MidnightJS smart contracts and Compact circuits. This demo uses a mocked credential system to
                simulate ZK flows without exposing identities.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your vote has been encrypted</DialogTitle>
            <DialogDescription>
              Thank you for participating. Your eligibility was verified without revealing your identity. You can view live results.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-3">
            <Button asChild>
              <a href="/results">View Live Results</a>
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={alreadyOpen} onOpenChange={setAlreadyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Already voted</DialogTitle>
            <DialogDescription>
              Our ZK nullifier detected a previous ballot from your credential. Each person can vote once. You can still view the live results.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-3">
            <Button asChild>
              <a href="/results">View Live Results</a>
            </Button>
            <Button variant="secondary" onClick={() => setAlreadyOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
