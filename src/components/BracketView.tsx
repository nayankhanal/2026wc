"use client";

import { useRef, useState } from "react";
import { MatchCard } from "./MatchCard";
import { BracketConnectors } from "./BracketConnectors";
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

// The 2026 format's match numbering splits cleanly into two bracket halves,
// each feeding one semifinal, which is what makes the mirrored layout possible.
const LEFT_NUMBERS = new Set([73, 74, 75, 76, 77, 78, 79, 80, 89, 90, 91, 92, 97, 98, 101]);
const RIGHT_NUMBERS = new Set([81, 82, 83, 84, 85, 86, 87, 88, 93, 94, 95, 96, 99, 100, 102]);

function Column({ title, matches }: { title: string; matches: MatchWithTeams[] }) {
  return (
    <div className="flex flex-col gap-4 w-64 shrink-0">
      <h3 className="font-heading uppercase tracking-wide text-xs text-gold text-center">{title}</h3>
      <div className="flex flex-col justify-around gap-4 flex-1">
        {matches.map((m) => (
          <div key={m.id} data-match={m.id}>
            <MatchCard match={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LinearLayout({ matches }: { matches: MatchWithTeams[] }) {
  const thirdPlace = matches.find((m) => m.stage === "third_place");

  return (
    <div className="flex gap-4 sm:gap-6 min-w-max">
      {STAGE_ORDER.map((stage) => {
        const stageMatches = matches.filter((m) => m.stage === stage).sort((a, b) => a.match_number - b.match_number);
        if (stageMatches.length === 0) return null;

        return (
          <div key={stage} className="flex flex-col gap-4 w-64 shrink-0">
            <Column title={STAGE_LABEL[stage]} matches={stageMatches} />
            {stage === "final" && thirdPlace && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <h4 className="font-heading uppercase tracking-wide text-[10px] text-muted-foreground text-center mb-2">
                  {STAGE_LABEL.third_place}
                </h4>
                <div data-match={thirdPlace.id}>
                  <MatchCard match={thirdPlace} compact />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MirroredLayout({ matches }: { matches: MatchWithTeams[] }) {
  const byNumber = (nums: Set<number>, stage: MatchStage) =>
    matches.filter((m) => m.stage === stage && nums.has(m.match_number)).sort((a, b) => a.match_number - b.match_number);

  const final = matches.find((m) => m.stage === "final");
  const thirdPlace = matches.find((m) => m.stage === "third_place");

  return (
    <div className="flex gap-4 sm:gap-6 min-w-max items-center">
      <Column title="Round of 32" matches={byNumber(LEFT_NUMBERS, "r32")} />
      <Column title="Round of 16" matches={byNumber(LEFT_NUMBERS, "r16")} />
      <Column title="Quarterfinals" matches={byNumber(LEFT_NUMBERS, "qf")} />
      <Column title="Semifinal" matches={byNumber(LEFT_NUMBERS, "sf")} />

      <div className="flex flex-col gap-4 w-56 shrink-0">
        <h3 className="font-heading uppercase tracking-wide text-xs text-gold text-center">Final</h3>
        {final && (
          <div data-match={final.id}>
            <MatchCard match={final} />
          </div>
        )}
        {thirdPlace && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <h4 className="font-heading uppercase tracking-wide text-[10px] text-muted-foreground text-center mb-2">
              3rd Place
            </h4>
            <div data-match={thirdPlace.id}>
              <MatchCard match={thirdPlace} compact />
            </div>
          </div>
        )}
      </div>

      <Column title="Semifinal" matches={byNumber(RIGHT_NUMBERS, "sf")} />
      <Column title="Quarterfinals" matches={byNumber(RIGHT_NUMBERS, "qf")} />
      <Column title="Round of 16" matches={byNumber(RIGHT_NUMBERS, "r16")} />
      <Column title="Round of 32" matches={byNumber(RIGHT_NUMBERS, "r32")} />
    </div>
  );
}

export function BracketView({ matches }: { matches: MatchWithTeams[] }) {
  const [layout, setLayout] = useState<"linear" | "mirrored">("mirrored");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <div className="inline-flex rounded-lg border border-border p-1 bg-card/60 text-sm">
          <button
            onClick={() => setLayout("linear")}
            className={`px-3 py-1.5 rounded-md transition-colors ${layout === "linear" ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Linear
          </button>
          <button
            onClick={() => setLayout("mirrored")}
            className={`px-3 py-1.5 rounded-md transition-colors ${layout === "mirrored" ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Wallchart
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {layout === "linear" ? <LinearLayout matches={matches} /> : <MirroredLayout matches={matches} />}
        <BracketConnectors matches={matches} containerRef={containerRef} />
      </div>
    </div>
  );
}
