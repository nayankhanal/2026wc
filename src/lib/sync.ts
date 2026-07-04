import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import { propagateWinner } from "./bracket";
import {
  fetchWorldCupMatches,
  buildTeamResolver,
  mapStatus,
  mapStage,
  type TeamRow,
} from "./footballData";
import type { Match } from "@/types/db";

export interface SyncReport {
  ok: boolean;
  fetched: number;
  updated: number;
  unmatchedCount: number;
  unmatched: string[];
  error?: string;
}

function pairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/** Pull WC results from football-data.org and upsert scores/status into our DB. */
export async function syncFromFootballData(): Promise<SyncReport> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return { ok: false, fetched: 0, updated: 0, unmatchedCount: 0, unmatched: [], error: "FOOTBALL_DATA_API_KEY not set" };
  }

  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabaseAdmin.from("teams").select("id, name, fifa_code"),
    supabaseAdmin.from("matches").select("*"),
  ]);
  if (!teams || !matches) {
    return { ok: false, fetched: 0, updated: 0, unmatchedCount: 0, unmatched: [], error: "failed to load DB rows" };
  }

  const resolve = buildTeamResolver(teams as TeamRow[]);

  const byPair = new Map<string, Match[]>();
  for (const m of matches as Match[]) {
    if (m.home_team_id == null || m.away_team_id == null) continue;
    const key = pairKey(m.home_team_id, m.away_team_id);
    const list = byPair.get(key) ?? [];
    list.push(m);
    byPair.set(key, list);
  }

  let fdMatches;
  try {
    fdMatches = await fetchWorldCupMatches(apiKey);
  } catch (err) {
    return { ok: false, fetched: 0, updated: 0, unmatchedCount: 0, unmatched: [], error: String(err) };
  }

  let updated = 0;
  const unmatched: string[] = [];

  for (const fd of fdMatches) {
    const status = mapStatus(fd.status);
    if (status === "scheduled") continue;

    const homeId = resolve(fd.homeTeam);
    const awayId = resolve(fd.awayTeam);
    if (homeId == null || awayId == null) {
      unmatched.push(`${fd.homeTeam.name ?? "?"} vs ${fd.awayTeam.name ?? "?"}`);
      continue;
    }

    let candidates = byPair.get(pairKey(homeId, awayId)) ?? [];
    if (candidates.length === 0) {
      unmatched.push(`${fd.homeTeam.name} vs ${fd.awayTeam.name} (no fixture)`);
      continue;
    }
    if (candidates.length > 1) {
      const stage = mapStage(fd.stage);
      candidates = candidates.filter((c) => c.stage === stage);
      if (candidates.length === 0) continue;
    }
    const our = candidates[0];

    const sameOrientation = our.home_team_id === homeId;
    const fh = fd.score.fullTime.home;
    const fa = fd.score.fullTime.away;
    const ph = fd.score.penalties?.home ?? null;
    const pa = fd.score.penalties?.away ?? null;

    const update = {
      home_score: sameOrientation ? fh : fa,
      away_score: sameOrientation ? fa : fh,
      home_pen: sameOrientation ? ph : pa,
      away_pen: sameOrientation ? pa : ph,
      status,
    };

    if (
      our.home_score === update.home_score &&
      our.away_score === update.away_score &&
      our.home_pen === update.home_pen &&
      our.away_pen === update.away_pen &&
      our.status === update.status
    ) {
      continue;
    }

    const { data: updatedRow, error } = await supabaseAdmin
      .from("matches")
      .update(update)
      .eq("id", our.id)
      .select()
      .single();
    if (error) continue;

    updated += 1;
    await propagateWinner(updatedRow as Match);
  }

  return {
    ok: true,
    fetched: fdMatches.length,
    updated,
    unmatchedCount: unmatched.length,
    unmatched: unmatched.slice(0, 20),
  };
}
