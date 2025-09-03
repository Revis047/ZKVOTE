import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        <h1 className="text-4xl font-extrabold">Terms & Privacy</h1>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Fair voting</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>One vote per person enforced via cryptographic nullifiers.</li>
            <li>
              Attempts to vote again will be rejected with an "Already voted"
              message.
            </li>
            <li>Use of automation or manipulation is prohibited.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Privacy</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              All ballots are encrypted; raw selections are never stored as
              plaintext.
            </li>
            <li>No personally identifiable information (PII) is collected.</li>
            <li>
              Server receives only a proof and a nullifier; it cannot link votes
              to people.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Data retention</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              We retain only aggregated tallies by option and anonymous regional
              counts.
            </li>
            <li>Ephemeral credentials may be discarded after the poll ends.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Security</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Zero-knowledge verification prevents double voting without
              exposing identities.
            </li>
            <li>Transport security via HTTPS is required.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Questions? Email admin@zkvote.example
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
