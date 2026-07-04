import Link from "next/link";
import { CountdownBanner } from "@/components/CountdownBanner";
import { AutoRefresh } from "@/components/AutoRefresh";
import { buttonVariants } from "@/components/ui/button";
import { getAllMatches } from "@/lib/data";
import { MatchCard } from "@/components/MatchCard";

export const revalidate = 0;

export default async function Home() {
  const matches = await getAllMatches();
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches
    .filter((m) => m.status === "scheduled" && m.home_team_id && m.away_team_id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
          USA · Canada · Mexico
        </p>
        <h1 className="font-heading text-4xl sm:text-6xl uppercase tracking-wide leading-tight mb-4">
          <span className="text-gradient-gold">2026</span> World Cup
          <br />
          Wallchart
        </h1>
        <p className="text-muted-foreground">
          Live groups, an auto-advancing knockout bracket, and results updated as the matches happen.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link href="/bracket" className={buttonVariants({ size: "lg" })}>
            View Bracket
          </Link>
          <Link href="/groups" className={buttonVariants({ size: "lg", variant: "outline" })}>
            View Groups
          </Link>
        </div>
      </div>

      <CountdownBanner />

      {live.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-sm uppercase tracking-wide text-host-red mb-3">Live now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground mb-3">
            Upcoming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}
      <AutoRefresh />
    </div>
  );
}
