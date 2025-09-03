export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} ZKVote — Built on Midnight</p>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
