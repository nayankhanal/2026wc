function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

export function CountdownBanner() {
  const days = daysUntil("2026-07-19T00:00:00Z");

  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 via-transparent to-host-blue/10 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          MetLife Stadium · East Rutherford, NJ
        </p>
        <p className="font-heading text-lg uppercase tracking-wide">Final: July 19, 2026</p>
      </div>
      <div className="text-right">
        <p className="font-heading text-3xl text-gradient-gold leading-none">{days}</p>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">days to go</p>
      </div>
    </div>
  );
}
