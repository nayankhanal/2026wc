import { getAllMatches } from "@/lib/data";
import { updateMatchResult, logout, syncNow } from "./actions";
import { FlagIcon } from "@/components/FlagIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MatchWithTeams } from "@/types/db";

export const revalidate = 0;

const STAGE_LABEL: Record<string, string> = {
  group: "Group Stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarterfinals",
  sf: "Semifinals",
  third_place: "3rd Place",
  final: "Final",
};

function MatchRow({ match }: { match: MatchWithTeams }) {
  return (
    <form
      action={updateMatchResult}
      className="grid grid-cols-[1fr_auto_1fr_auto_auto_auto] sm:grid-cols-[1fr_1fr_auto_auto_auto_auto] items-center gap-2 sm:gap-3 py-2 px-3 rounded-md odd:bg-card/50"
    >
      <input type="hidden" name="id" value={match.id} />
      <div className="flex items-center gap-2 min-w-0 text-sm">
        {match.home_team ? <FlagIcon code={match.home_team.flag_code} className="w-5 h-3.5 shrink-0" /> : null}
        <span className="truncate">{match.home_team?.name ?? match.home_source ?? "TBD"}</span>
      </div>
      <div className="flex items-center gap-2 min-w-0 text-sm">
        {match.away_team ? <FlagIcon code={match.away_team.flag_code} className="w-5 h-3.5 shrink-0" /> : null}
        <span className="truncate">{match.away_team?.name ?? match.away_source ?? "TBD"}</span>
      </div>
      <Input
        name="home_score"
        type="number"
        min={0}
        defaultValue={match.home_score ?? ""}
        className="w-14 h-8"
        disabled={!match.home_team_id || !match.away_team_id}
      />
      <Input
        name="away_score"
        type="number"
        min={0}
        defaultValue={match.away_score ?? ""}
        className="w-14 h-8"
        disabled={!match.home_team_id || !match.away_team_id}
      />
      <select
        name="status"
        defaultValue={match.status}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
      >
        <option value="scheduled">Scheduled</option>
        <option value="live">Live</option>
        <option value="finished">Finished</option>
      </select>
      <Button type="submit" size="sm" variant="secondary" disabled={!match.home_team_id || !match.away_team_id}>
        Save
      </Button>
    </form>
  );
}

export default async function AdminDashboardPage() {
  const matches = await getAllMatches();
  const stages = ["group", "r32", "r16", "qf", "sf", "third_place", "final"] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl uppercase tracking-wide">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <form action={syncNow}>
            <Button size="sm" type="submit">
              Sync from API
            </Button>
          </form>
          <form action={logout}>
            <Button variant="outline" size="sm" type="submit">
              Log out
            </Button>
          </form>
        </div>
      </div>

      {stages.map((stage) => {
        const stageMatches = matches.filter((m) => m.stage === stage);
        if (stageMatches.length === 0) return null;
        return (
          <div key={stage} className="mb-8">
            <h2 className="font-heading text-sm uppercase tracking-wide text-gold mb-2">
              {STAGE_LABEL[stage]}
            </h2>
            <div className="flex flex-col gap-1">
              {stageMatches.map((m) => (
                <MatchRow key={`${m.id}-${m.home_score}-${m.away_score}-${m.status}`} match={m} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
