import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground max-w-3xl">
          ZKVote is designed so that your identity and your ballot remain
          private at all times. We store only aggregated counts and do not
          collect personal identifiers.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">What we process</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Anonymous credential token (never stored in plaintext on the
              server).
            </li>
            <li>
              Zero-knowledge proof and nullifier for double-vote prevention.
            </li>
            <li>Aggregated option and regional tallies.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p className="mt-2 text-muted-foreground">
            You may revoke your local credential by clearing your browser
            storage.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
