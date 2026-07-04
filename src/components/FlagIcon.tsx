export function FlagIcon({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-[3px] shadow-sm ring-1 ring-white/10 ${className ?? ""}`}
      style={{ display: "inline-block" }}
      aria-hidden
    />
  );
}
