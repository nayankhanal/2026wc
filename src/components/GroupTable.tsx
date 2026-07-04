import { FlagIcon } from "./FlagIcon";
import type { StandingRow } from "@/lib/standings";

export function GroupTable({ groupName, standings }: { groupName: string; standings: StandingRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-card/80 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <h3 className="font-heading uppercase tracking-wide text-sm">Group {groupName}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-xs">
            <th className="text-left font-normal pl-4 py-2">Team</th>
            <th className="font-normal py-2 w-8">P</th>
            <th className="font-normal py-2 w-8">W</th>
            <th className="font-normal py-2 w-8">D</th>
            <th className="font-normal py-2 w-8">L</th>
            <th className="font-normal py-2 w-10">GD</th>
            <th className="font-normal py-2 w-10 pr-4">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr
              key={row.team.id}
              className={`border-t border-border/40 ${i < 2 ? "bg-gold/5" : ""}`}
            >
              <td className="pl-4 py-2">
                <div className="flex items-center gap-2">
                  <FlagIcon code={row.team.flag_code} className="w-5 h-3.5" />
                  <span className="truncate">{row.team.name}</span>
                </div>
              </td>
              <td className="text-center tabular-nums">{row.played}</td>
              <td className="text-center tabular-nums">{row.won}</td>
              <td className="text-center tabular-nums">{row.drawn}</td>
              <td className="text-center tabular-nums">{row.lost}</td>
              <td className="text-center tabular-nums">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
              <td className="text-center tabular-nums font-semibold pr-4">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
