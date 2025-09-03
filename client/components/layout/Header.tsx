import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { pathname } = useLocation();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 shadow-[0_0_20px_theme(colors.fuchsia.500/.4)]" />
          <span>ZKVote</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={
              "rounded-md px-3 py-2 text-sm " +
              (pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground")
            }
          >
            Vote
          </Link>
          <Link
            to="/results"
            className={
              "rounded-md px-3 py-2 text-sm " +
              (pathname.startsWith("/results")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            Results
          </Link>
          <Button size="sm" variant="secondary" asChild>
            <Link to="/about" aria-label="Learn about privacy">About</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
