import { useEffect, useMemo, useState } from "react";

export default function Countdown({
  target,
}: {
  target: string | number | Date;
}) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetMs - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <TimeSeg label="D" value={days} />
      <span className="opacity-40">:</span>
      <TimeSeg label="H" value={hours} />
      <span className="opacity-40">:</span>
      <TimeSeg label="M" value={minutes} />
      <span className="opacity-40">:</span>
      <TimeSeg label="S" value={seconds} />
    </div>
  );
}

function TimeSeg({ label, value }: { label: string; value: number }) {
  const v = value.toString().padStart(2, "0");
  return (
    <div className="flex items-center gap-1">
      <div className="rounded-md bg-secondary/40 px-2 py-1 font-mono text-lg tabular-nums text-primary-foreground/90 shadow-[0_0_20px_theme(colors.primary.DEFAULT/.15)]">
        {v}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
