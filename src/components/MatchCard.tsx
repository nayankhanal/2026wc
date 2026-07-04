import { FlagIcon } from "./FlagIcon";
import type { MatchWithTeams } from "@/types/db";

function TeamRow({
  name,
  code,
  flag,
  score,
  penalties,
  winner,
}: {
  name: string;
  code?: string;
  flag?: string;
  score: number | null;
  penalties: number | null;
  winner: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-2 py-1 ${winner ? "font-semibold" : ""}`}>
      <div className="flex items-center gap-2 min-w-0">
        {flag ? <FlagIcon code={flag} className="w-5 h-3.5 shrink-0" /> : <span className="w-5 h-3.5 shrink-0 rounded-[3px] bg-muted" />}
        <span className="truncate text-sm">{name}</span>
        {code && <span className="text-xs text-muted-foreground shrink-0">{code}</span>}
      </div>
      <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
        {penalties != null && <span className="text-xs text-muted-foreground">({penalties})</span>}
        <span className={`text-sm ${winner ? "text-gold" : ""}`}>{score ?? "–"}</span>
      </div>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-muted text-muted-foreground",
  live: "bg-host-red/20 text-host-red animate-pulse",
  finished: "bg-gold/15 text-gold",
};

export function MatchCard({ match, compact }: { match: MatchWithTeams; compact?: boolean }) {
  const home = match.home_team;
  const away = match.away_team;
  const finished = match.status === "finished";
  const homeWin = finished && match.home_score != null && match.away_score != null &&
    (match.home_score > match.away_score || (match.home_score === match.away_score && (match.home_pen ?? 0) > (match.away_pen ?? 0)));
  const awayWin = finished && match.home_score != null && match.away_score != null &&
    (match.away_score > match.home_score || (match.home_score === match.away_score && (match.away_pen ?? 0) > (match.home_pen ?? 0)));

  const date = match.kickoff_at
    ? new Date(match.kickoff_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  return (
    <div className="rounded-lg border border-border bg-card/80 px-3 py-2 hover:border-gold/40 transition-colors">
      <TeamRow
        name={home?.name ?? match.home_source ?? "TBD"}
        code={home?.fifa_code}
        flag={home?.flag_code}
        score={match.home_score}
        penalties={match.home_pen}
        winner={!!homeWin}
      />
      <TeamRow
        name={away?.name ?? match.away_source ?? "TBD"}
        code={away?.fifa_code}
        flag={away?.flag_code}
        score={match.away_score}
        penalties={match.away_pen}
        winner={!!awayWin}
      />
      {!compact && (
        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{date ?? "TBD"}{match.venue ? ` · ${match.venue}` : ""}</span>
          <span className={`px-1.5 py-0.5 rounded ${statusStyles[match.status]}`}>
            {match.status === "live" ? "LIVE" : match.status === "finished" ? "FT" : "Scheduled"}
          </span>
        </div>
      )}
    </div>
  );
}
