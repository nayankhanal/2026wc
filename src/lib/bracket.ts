import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import type { Match } from "@/types/db";

/** Returns the winning team id, or null if not resolvable (not finished, or a draw with no penalties yet). */
export function resolveWinnerTeamId(match: Match): number | null {
  if (match.status !== "finished") return null;
  if (match.home_score == null || match.away_score == null) return null;

  if (match.home_score > match.away_score) return match.home_team_id;
  if (match.away_score > match.home_score) return match.away_team_id;

  if (match.home_pen != null && match.away_pen != null) {
    if (match.home_pen > match.away_pen) return match.home_team_id;
    if (match.away_pen > match.home_pen) return match.away_team_id;
  }

  return null;
}

/** After a knockout match is marked finished, push the winner into its next bracket slot. */
export async function propagateWinner(match: Match): Promise<void> {
  if (match.stage === "group") return;
  if (!match.next_match_id || !match.next_match_slot) return;

  const winnerId = resolveWinnerTeamId(match);
  if (winnerId == null) return;

  const column = match.next_match_slot === "home" ? "home_team_id" : "away_team_id";
  await supabaseAdmin
    .from("matches")
    .update({ [column]: winnerId })
    .eq("id", match.next_match_id);
}
