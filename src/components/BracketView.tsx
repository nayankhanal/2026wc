import { MatchCard } from "./MatchCard";
import type { MatchStage, MatchWithTeams } from "@/types/db";

const STAGE_ORDER: MatchStage[] = ["r32", "r16", "qf", "sf", "final"];
const STAGE_LABEL: Record<MatchStage, string> = {
  group: "Group Stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarterfinals",
  sf: "Semifinals",
  third_place: "3rd Place",
  final: "Final",
};

export function BracketView({ matches }: { matches: MatchWithTeams[] }) {
  const thirdPlace = matches.find((m) => m.stage === "third_place");

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 sm:gap-6 min-w-max">
        {STAGE_ORDER.map((stage) => {
          const stageMatches = matches
            .filter((m) => m.stage === stage)
            .sort((a, b) => a.match_number - b.match_number);
          if (stageMatches.length === 0) return null;

          return (
            <div key={stage} className="flex flex-col gap-4 w-64 shrink-0">
              <h3 className="font-heading uppercase tracking-wide text-xs text-gold text-center">
                {STAGE_LABEL[stage]}
              </h3>
              <div className="flex flex-col justify-around gap-4 flex-1">
                {stageMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
              {stage === "final" && thirdPlace && (
                <div className="mt-4 pt-4 border-t border-border/60">
                  <h4 className="font-heading uppercase tracking-wide text-[10px] text-muted-foreground text-center mb-2">
                    {STAGE_LABEL.third_place}
                  </h4>
                  <MatchCard match={thirdPlace} compact />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
