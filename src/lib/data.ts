import { supabase } from "./supabase/client";
import type { Group, Match, MatchWithTeams, Team } from "@/types/db";

export async function getGroupsWithTeams(): Promise<{ group: Group; teams: Team[] }[]> {
  const [{ data: groups }, { data: teams }] = await Promise.all([
    supabase.from("groups").select("*").order("name"),
    supabase.from("teams").select("*"),
  ]);
  return (groups ?? []).map((group) => ({
    group,
    teams: (teams ?? []).filter((t) => t.group_id === group.id),
  }));
}

export async function getAllMatches(): Promise<MatchWithTeams[]> {
  const [{ data: matches }, { data: teams }] = await Promise.all([
    supabase.from("matches").select("*").order("match_number"),
    supabase.from("teams").select("*"),
  ]);
  const teamById = new Map<number, Team>((teams ?? []).map((t) => [t.id, t]));
  return (matches ?? []).map((m: Match) => ({
    ...m,
    home_team: m.home_team_id ? teamById.get(m.home_team_id) ?? null : null,
    away_team: m.away_team_id ? teamById.get(m.away_team_id) ?? null : null,
  }));
}
