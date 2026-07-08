import "server-only";
import type { MatchStage, MatchStatus } from "@/types/db";

const BASE = "https://api.football-data.org/v4";
const WC_CODE = "WC";

export interface FdTeam {
  id: number | null;
  name: string | null;
  tla: string | null;
}

interface Side {
  home: number | null;
  away: number | null;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string; // SCHEDULED | TIMED | IN_PLAY | PAUSED | FINISHED | ...
  stage: string; // GROUP_STAGE | LAST_32 | LAST_16 | QUARTER_FINALS | SEMI_FINALS | THIRD_PLACE | FINAL
  group: string | null;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: {
    winner: string | null;
    duration?: string; // REGULAR | EXTRA_TIME | PENALTY_SHOOTOUT
    fullTime: Side; // includes shootout goals for penalty deciders
    regularTime?: Side | null; // 90-minute score
    extraTime?: Side | null; // extra-time-only goals
    penalties?: Side | null; // unreliable mid-shootout snapshot; do not use directly
  };
}

/**
 * Recover the true match result from football-data's score object.
 *
 * `fullTime` bakes shootout goals in (a 0-0 won 4-3 on pens reports as 4-3), and
 * the `penalties` field is an unreliable mid-shootout snapshot. So we take the
 * real score from regularTime (+extraTime) and derive the shootout as the leftover
 * between fullTime and that score. Returns values in the API's home/away order.
 */
export function extractResult(fd: FdMatch): {
  home: number | null;
  away: number | null;
  homePen: number | null;
  awayPen: number | null;
} {
  const s = fd.score;
  const rt = s.regularTime;
  const et = s.extraTime;
  const ft = s.fullTime;

  let home: number | null;
  let away: number | null;
  if (rt && rt.home != null && rt.away != null) {
    home = rt.home + (et?.home ?? 0);
    away = rt.away + (et?.away ?? 0);
  } else {
    home = ft?.home ?? null;
    away = ft?.away ?? null;
  }

  let homePen: number | null = null;
  let awayPen: number | null = null;
  if (s.duration === "PENALTY_SHOOTOUT" && ft?.home != null && ft?.away != null && home != null && away != null) {
    homePen = ft.home - home;
    awayPen = ft.away - away;
  }

  return { home, away, homePen, awayPen };
}

export async function fetchWorldCupMatches(apiKey: string): Promise<FdMatch[]> {
  const res = await fetch(`${BASE}/competitions/${WC_CODE}/matches`, {
    headers: { "X-Auth-Token": apiKey },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`football-data.org responded ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { matches?: FdMatch[] };
  return json.matches ?? [];
}

export function mapStatus(fd: string): MatchStatus {
  switch (fd) {
    case "IN_PLAY":
    case "PAUSED":
    case "SUSPENDED":
      return "live";
    case "FINISHED":
    case "AWARDED":
      return "finished";
    default:
      return "scheduled";
  }
}

export function mapStage(fd: string): MatchStage | null {
  switch (fd) {
    case "GROUP_STAGE":
      return "group";
    case "LAST_32":
      return "r32";
    case "LAST_16":
      return "r16";
    case "QUARTER_FINALS":
      return "qf";
    case "SEMI_FINALS":
      return "sf";
    case "THIRD_PLACE":
    case "THIRD_PLACE_FINAL":
      return "third_place";
    case "FINAL":
      return "final";
    default:
      return null;
  }
}

/** Strip accents/punctuation, lowercase, collapse spaces. */
export function normalizeName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Known name variants: normalized external name -> our canonical team name.
// (Our seed names on the right.) Add to this if the sync report shows misses.
const NAME_ALIASES: Record<string, string> = {
  "usa": "United States",
  "united states of america": "United States",
  "cape verde": "Cabo Verde",
  "cape verde islands": "Cabo Verde",
  "ivory coast": "Côte d'Ivoire",
  "cote d ivoire": "Côte d'Ivoire",
  "korea republic": "South Korea",
  "korea dpr": "South Korea",
  "republic of korea": "South Korea",
  "congo dr": "DR Congo",
  "dr congo": "DR Congo",
  "democratic republic of congo": "DR Congo",
  "congo democratic republic": "DR Congo",
  "turkey": "Türkiye",
  "turkiye": "Türkiye",
  "czechia": "Czech Republic",
  "curacao": "Curaçao",
  "bosnia herzegovina": "Bosnia and Herzegovina",
  "ir iran": "Iran",
};

export interface TeamRow {
  id: number;
  name: string;
  fifa_code: string;
}

/**
 * Build a resolver from a football-data team (tla + name) to our team id.
 * Tries the three-letter code first, then name (with alias fallback).
 */
export function buildTeamResolver(teams: TeamRow[]) {
  const byCode = new Map<string, number>();
  const byName = new Map<string, number>();
  for (const t of teams) {
    byCode.set(t.fifa_code.toUpperCase(), t.id);
    byName.set(normalizeName(t.name), t.id);
  }
  const aliasToId = new Map<string, number>();
  for (const [alias, canonical] of Object.entries(NAME_ALIASES)) {
    const id = byName.get(normalizeName(canonical));
    if (id != null) aliasToId.set(normalizeName(alias), id);
  }

  return function resolve(fd: FdTeam): number | null {
    if (fd.tla) {
      const id = byCode.get(fd.tla.toUpperCase());
      if (id != null) return id;
    }
    if (fd.name) {
      const norm = normalizeName(fd.name);
      return byName.get(norm) ?? aliasToId.get(norm) ?? null;
    }
    return null;
  };
}
