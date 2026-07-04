export type MatchStage = "group" | "r32" | "r16" | "qf" | "sf" | "third_place" | "final";
export type MatchStatus = "scheduled" | "live" | "finished";
export type BracketSlot = "home" | "away";

export interface Group {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  fifa_code: string;
  flag_code: string;
  group_id: number | null;
}

export interface Match {
  id: number;
  match_number: number;
  stage: MatchStage;
  group_id: number | null;
  home_team_id: number | null;
  away_team_id: number | null;
  home_source: string | null;
  away_source: string | null;
  home_score: number | null;
  away_score: number | null;
  home_pen: number | null;
  away_pen: number | null;
  status: MatchStatus;
  kickoff_at: string | null;
  venue: string | null;
  next_match_id: number | null;
  next_match_slot: BracketSlot | null;
}

export interface MatchWithTeams extends Match {
  home_team: Team | null;
  away_team: Team | null;
}
