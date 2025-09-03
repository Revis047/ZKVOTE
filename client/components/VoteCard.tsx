import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  id: "climate" | "health" | "space" | "ai" | "freedom";
  label: string;
  emoji: string;
  active?: boolean;
  onClick?: () => void;
}

export default function VoteCard({ id, label, emoji, active, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-pressed={!!active}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-gradient-to-b p-0.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "from-primary/40 to-primary/5",
        active
          ? "shadow-[0_0_40px_theme(colors.primary.DEFAULT/.35)]"
          : "shadow-[0_0_20px_theme(colors.primary.DEFAULT/.15)]",
      )}
    >
      <div className="relative h-full w-full rounded-[1rem] bg-card p-5 transition-colors group-hover:bg-card/95">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="flex items-start justify-between">
          <div className="text-4xl" aria-hidden>
            {emoji}
          </div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400/80 shadow-[0_0_10px_theme(colors.emerald.400/.8)]" />
        </div>
        <div className="mt-6 text-xl font-semibold text-foreground">
          {label}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Tap to cast your encrypted vote
        </div>
      </div>
    </motion.button>
  );
}
