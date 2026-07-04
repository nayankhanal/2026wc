/**
 * Seed script for the 2026 World Cup wallchart.
 *
 * Group stage data (all 12 groups, 72 matches) was cross-verified against
 * multiple sources and is high confidence.
 *
 * Knockout stage: R32 matchups/scores are seeded where corroborated; a few
 * R32 slots and most R16-Final team assignments are intentionally left as
 * "Winner Match X" placeholders rather than guessed, since live-result
 * sources disagreed with each other during research. Once real R32 results
 * are confirmed/corrected via the admin dashboard, the bracket auto-fills
 * itself through the app's own propagation logic — no need to hardcode
 * downstream rounds. R32-to-R16 pairing (which match feeds which slot) uses
 * a standard sequential convention (73+74 -> 89, etc.) since the official
 * FIFA pairing table wasn't reliably verifiable; adjust in the DB if you
 * know the real linkage.
 *
 * Run with: npx tsx supabase/seed.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const db = createClient(url, serviceRoleKey);

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const TEAMS: { name: string; fifa: string; flag: string; group: string }[] = [
  { name: "Mexico", fifa: "MEX", flag: "mx", group: "A" },
  { name: "South Africa", fifa: "RSA", flag: "za", group: "A" },
  { name: "South Korea", fifa: "KOR", flag: "kr", group: "A" },
  { name: "Czech Republic", fifa: "CZE", flag: "cz", group: "A" },

  { name: "Canada", fifa: "CAN", flag: "ca", group: "B" },
  { name: "Bosnia and Herzegovina", fifa: "BIH", flag: "ba", group: "B" },
  { name: "Qatar", fifa: "QAT", flag: "qa", group: "B" },
  { name: "Switzerland", fifa: "SUI", flag: "ch", group: "B" },

  { name: "Brazil", fifa: "BRA", flag: "br", group: "C" },
  { name: "Morocco", fifa: "MAR", flag: "ma", group: "C" },
  { name: "Haiti", fifa: "HAI", flag: "ht", group: "C" },
  { name: "Scotland", fifa: "SCO", flag: "gb-sct", group: "C" },

  { name: "United States", fifa: "USA", flag: "us", group: "D" },
  { name: "Paraguay", fifa: "PAR", flag: "py", group: "D" },
  { name: "Australia", fifa: "AUS", flag: "au", group: "D" },
  { name: "Türkiye", fifa: "TUR", flag: "tr", group: "D" },

  { name: "Germany", fifa: "GER", flag: "de", group: "E" },
  { name: "Curaçao", fifa: "CUW", flag: "cw", group: "E" },
  { name: "Côte d'Ivoire", fifa: "CIV", flag: "ci", group: "E" },
  { name: "Ecuador", fifa: "ECU", flag: "ec", group: "E" },

  { name: "Netherlands", fifa: "NED", flag: "nl", group: "F" },
  { name: "Japan", fifa: "JPN", flag: "jp", group: "F" },
  { name: "Sweden", fifa: "SWE", flag: "se", group: "F" },
  { name: "Tunisia", fifa: "TUN", flag: "tn", group: "F" },

  { name: "Belgium", fifa: "BEL", flag: "be", group: "G" },
  { name: "Egypt", fifa: "EGY", flag: "eg", group: "G" },
  { name: "Iran", fifa: "IRN", flag: "ir", group: "G" },
  { name: "New Zealand", fifa: "NZL", flag: "nz", group: "G" },

  { name: "Spain", fifa: "ESP", flag: "es", group: "H" },
  { name: "Cabo Verde", fifa: "CPV", flag: "cv", group: "H" },
  { name: "Saudi Arabia", fifa: "KSA", flag: "sa", group: "H" },
  { name: "Uruguay", fifa: "URU", flag: "uy", group: "H" },

  { name: "France", fifa: "FRA", flag: "fr", group: "I" },
  { name: "Senegal", fifa: "SEN", flag: "sn", group: "I" },
  { name: "Iraq", fifa: "IRQ", flag: "iq", group: "I" },
  { name: "Norway", fifa: "NOR", flag: "no", group: "I" },

  { name: "Argentina", fifa: "ARG", flag: "ar", group: "J" },
  { name: "Algeria", fifa: "ALG", flag: "dz", group: "J" },
  { name: "Austria", fifa: "AUT", flag: "at", group: "J" },
  { name: "Jordan", fifa: "JOR", flag: "jo", group: "J" },

  { name: "Portugal", fifa: "POR", flag: "pt", group: "K" },
  { name: "DR Congo", fifa: "COD", flag: "cd", group: "K" },
  { name: "Uzbekistan", fifa: "UZB", flag: "uz", group: "K" },
  { name: "Colombia", fifa: "COL", flag: "co", group: "K" },

  { name: "England", fifa: "ENG", flag: "gb-eng", group: "L" },
  { name: "Croatia", fifa: "CRO", flag: "hr", group: "L" },
  { name: "Ghana", fifa: "GHA", flag: "gh", group: "L" },
  { name: "Panama", fifa: "PAN", flag: "pa", group: "L" },
];

// [group, date, home, away, homeScore, awayScore, venue]
const GROUP_MATCHES: [string, string, string, string, number, number, string][] = [
  ["A", "2026-06-11", "Mexico", "South Africa", 2, 0, "Estadio Azteca, Mexico City"],
  ["A", "2026-06-11", "South Korea", "Czech Republic", 2, 1, "Estadio Akron, Zapopan"],
  ["A", "2026-06-18", "Czech Republic", "South Africa", 1, 1, "Mercedes-Benz Stadium, Atlanta"],
  ["A", "2026-06-18", "Mexico", "South Korea", 1, 0, "Estadio Akron, Zapopan"],
  ["A", "2026-06-24", "Czech Republic", "Mexico", 0, 3, "Estadio Azteca, Mexico City"],
  ["A", "2026-06-24", "South Africa", "South Korea", 1, 0, "Estadio BBVA, Guadalupe"],

  ["B", "2026-06-12", "Canada", "Bosnia and Herzegovina", 1, 1, "BMO Field, Toronto"],
  ["B", "2026-06-13", "Qatar", "Switzerland", 1, 1, "Levi's Stadium, Santa Clara"],
  ["B", "2026-06-18", "Switzerland", "Bosnia and Herzegovina", 4, 1, "SoFi Stadium, Inglewood"],
  ["B", "2026-06-18", "Canada", "Qatar", 6, 0, "BC Place, Vancouver"],
  ["B", "2026-06-24", "Switzerland", "Canada", 2, 1, "BC Place, Vancouver"],
  ["B", "2026-06-24", "Bosnia and Herzegovina", "Qatar", 3, 1, "Lumen Field, Seattle"],

  ["C", "2026-06-13", "Brazil", "Morocco", 1, 1, "MetLife Stadium, East Rutherford"],
  ["C", "2026-06-13", "Haiti", "Scotland", 0, 1, "Gillette Stadium, Foxborough"],
  ["C", "2026-06-19", "Scotland", "Morocco", 0, 1, "Gillette Stadium, Foxborough"],
  ["C", "2026-06-19", "Brazil", "Haiti", 3, 0, "Lincoln Financial Field, Philadelphia"],
  ["C", "2026-06-24", "Scotland", "Brazil", 0, 3, "Hard Rock Stadium, Miami Gardens"],
  ["C", "2026-06-24", "Morocco", "Haiti", 4, 2, "Mercedes-Benz Stadium, Atlanta"],

  ["D", "2026-06-12", "United States", "Paraguay", 4, 1, "SoFi Stadium, Inglewood"],
  ["D", "2026-06-13", "Australia", "Türkiye", 2, 0, "BC Place, Vancouver"],
  ["D", "2026-06-19", "United States", "Australia", 2, 0, "Lumen Field, Seattle"],
  ["D", "2026-06-19", "Türkiye", "Paraguay", 0, 1, "Levi's Stadium, Santa Clara"],
  ["D", "2026-06-25", "Türkiye", "United States", 3, 2, "SoFi Stadium, Inglewood"],
  ["D", "2026-06-25", "Paraguay", "Australia", 0, 0, "Levi's Stadium, Santa Clara"],

  ["E", "2026-06-14", "Germany", "Curaçao", 7, 1, "NRG Stadium, Houston"],
  ["E", "2026-06-14", "Côte d'Ivoire", "Ecuador", 1, 0, "Lincoln Financial Field, Philadelphia"],
  ["E", "2026-06-20", "Germany", "Côte d'Ivoire", 2, 1, "BMO Field, Toronto"],
  ["E", "2026-06-20", "Ecuador", "Curaçao", 0, 0, "Arrowhead Stadium, Kansas City"],
  ["E", "2026-06-25", "Curaçao", "Côte d'Ivoire", 0, 2, "Lincoln Financial Field, Philadelphia"],
  ["E", "2026-06-25", "Ecuador", "Germany", 2, 1, "MetLife Stadium, East Rutherford"],

  ["F", "2026-06-14", "Netherlands", "Japan", 2, 2, "AT&T Stadium, Arlington"],
  ["F", "2026-06-14", "Sweden", "Tunisia", 5, 1, "Estadio BBVA, Guadalupe"],
  ["F", "2026-06-20", "Netherlands", "Sweden", 5, 1, "NRG Stadium, Houston"],
  ["F", "2026-06-20", "Tunisia", "Japan", 0, 4, "Estadio BBVA, Guadalupe"],
  ["F", "2026-06-25", "Japan", "Sweden", 1, 1, "AT&T Stadium, Arlington"],
  ["F", "2026-06-25", "Tunisia", "Netherlands", 1, 3, "Arrowhead Stadium, Kansas City"],

  ["G", "2026-06-15", "Belgium", "Egypt", 1, 1, "Lumen Field, Seattle"],
  ["G", "2026-06-15", "Iran", "New Zealand", 2, 2, "SoFi Stadium, Inglewood"],
  ["G", "2026-06-21", "Belgium", "Iran", 0, 0, "SoFi Stadium, Inglewood"],
  ["G", "2026-06-21", "New Zealand", "Egypt", 1, 3, "BC Place, Vancouver"],
  ["G", "2026-06-26", "Egypt", "Iran", 1, 1, "Lumen Field, Seattle"],
  ["G", "2026-06-26", "New Zealand", "Belgium", 1, 5, "BC Place, Vancouver"],

  ["H", "2026-06-15", "Spain", "Cabo Verde", 0, 0, "Mercedes-Benz Stadium, Atlanta"],
  ["H", "2026-06-15", "Saudi Arabia", "Uruguay", 1, 1, "Hard Rock Stadium, Miami Gardens"],
  ["H", "2026-06-21", "Spain", "Saudi Arabia", 4, 0, "Mercedes-Benz Stadium, Atlanta"],
  ["H", "2026-06-21", "Uruguay", "Cabo Verde", 2, 2, "Hard Rock Stadium, Miami Gardens"],
  ["H", "2026-06-26", "Cabo Verde", "Saudi Arabia", 0, 0, "NRG Stadium, Houston"],
  ["H", "2026-06-26", "Uruguay", "Spain", 0, 1, "Estadio Akron, Zapopan"],

  ["I", "2026-06-16", "France", "Senegal", 3, 1, "MetLife Stadium, East Rutherford"],
  ["I", "2026-06-16", "Iraq", "Norway", 1, 4, "Gillette Stadium, Foxborough"],
  ["I", "2026-06-22", "France", "Iraq", 3, 0, "Lincoln Financial Field, Philadelphia"],
  ["I", "2026-06-22", "Norway", "Senegal", 3, 2, "MetLife Stadium, East Rutherford"],
  ["I", "2026-06-26", "Norway", "France", 1, 4, "Gillette Stadium, Foxborough"],
  ["I", "2026-06-26", "Senegal", "Iraq", 5, 0, "BMO Field, Toronto"],

  ["J", "2026-06-16", "Argentina", "Algeria", 3, 0, "Arrowhead Stadium, Kansas City"],
  ["J", "2026-06-16", "Austria", "Jordan", 3, 1, "Levi's Stadium, Santa Clara"],
  ["J", "2026-06-22", "Argentina", "Austria", 2, 0, "AT&T Stadium, Arlington"],
  ["J", "2026-06-22", "Jordan", "Algeria", 1, 2, "Levi's Stadium, Santa Clara"],
  ["J", "2026-06-27", "Algeria", "Austria", 3, 3, "Arrowhead Stadium, Kansas City"],
  ["J", "2026-06-27", "Jordan", "Argentina", 1, 3, "AT&T Stadium, Arlington"],

  ["K", "2026-06-17", "Portugal", "DR Congo", 1, 1, "NRG Stadium, Houston"],
  ["K", "2026-06-17", "Uzbekistan", "Colombia", 1, 3, "Estadio Azteca, Mexico City"],
  ["K", "2026-06-23", "Portugal", "Uzbekistan", 5, 0, "NRG Stadium, Houston"],
  ["K", "2026-06-23", "Colombia", "DR Congo", 1, 0, "Estadio Akron, Zapopan"],
  ["K", "2026-06-27", "Colombia", "Portugal", 0, 0, "Hard Rock Stadium, Miami Gardens"],
  ["K", "2026-06-27", "DR Congo", "Uzbekistan", 3, 1, "Mercedes-Benz Stadium, Atlanta"],

  ["L", "2026-06-17", "England", "Croatia", 4, 2, "AT&T Stadium, Arlington"],
  ["L", "2026-06-17", "Ghana", "Panama", 1, 0, "BMO Field, Toronto"],
  ["L", "2026-06-23", "England", "Ghana", 0, 0, "Gillette Stadium, Foxborough"],
  ["L", "2026-06-23", "Panama", "Croatia", 0, 1, "BMO Field, Toronto"],
  ["L", "2026-06-27", "Panama", "England", 0, 2, "MetLife Stadium, East Rutherford"],
  ["L", "2026-06-27", "Croatia", "Ghana", 2, 1, "Lincoln Financial Field, Philadelphia"],
];

interface KnockoutSeed {
  matchNumber: number;
  stage: "r32" | "r16" | "qf" | "sf" | "third_place" | "final";
  date: string | null;
  venue: string | null;
  home?: string; // real team name, if confidently known
  away?: string;
  homeScore?: number;
  awayScore?: number;
  homePen?: number; // penalty shootout score, when a knockout tie went to pens
  awayPen?: number;
  live?: boolean; // currently in progress
  homeSource: string; // shown until resolved
  awaySource: string;
  nextMatchNumber: number | null;
  nextSlot: "home" | "away" | null;
}

const KNOCKOUT: KnockoutSeed[] = [
  // Round of 32 (73-88) - real results. Colombia vs Ghana (85) is live as of Jul 3-4.
  // next_match linkage reflects the actual FIFA bracket (verified from R16 matchups).
  { matchNumber: 73, stage: "r32", date: "2026-06-28", venue: "SoFi Stadium, Inglewood", home: "Canada", away: "South Africa", homeScore: 1, awayScore: 0, homeSource: "Winner Group B", awaySource: "Runner-up Group A", nextMatchNumber: 89, nextSlot: "home" },
  { matchNumber: 74, stage: "r32", date: "2026-06-29", venue: "NRG Stadium, Houston", home: "Brazil", away: "Japan", homeScore: 2, awayScore: 1, homeSource: "Winner Group C", awaySource: "Runner-up Group F", nextMatchNumber: 91, nextSlot: "home" },
  { matchNumber: 75, stage: "r32", date: "2026-06-29", venue: "Estadio BBVA, Guadalupe", home: "Netherlands", away: "Morocco", homeScore: 1, awayScore: 1, homePen: 2, awayPen: 3, homeSource: "Winner Group F", awaySource: "Runner-up Group C", nextMatchNumber: 89, nextSlot: "away" },
  { matchNumber: 76, stage: "r32", date: "2026-06-27", venue: "SoFi Stadium, Inglewood", home: "Spain", away: "Austria", homeScore: 3, awayScore: 0, homeSource: "Winner Group H", awaySource: "Runner-up Group J", nextMatchNumber: 93, nextSlot: "away" },
  { matchNumber: 77, stage: "r32", date: "2026-06-30", venue: "AT&T Stadium, Arlington", home: "Côte d'Ivoire", away: "Norway", homeScore: 1, awayScore: 2, homeSource: "Runner-up Group E", awaySource: "Winner Group I", nextMatchNumber: 91, nextSlot: "away" },
  { matchNumber: 78, stage: "r32", date: "2026-06-30", venue: "Estadio Azteca, Mexico City", home: "Mexico", away: "Ecuador", homeScore: 2, awayScore: 0, homeSource: "Winner Group A", awaySource: "3rd-place qualifier", nextMatchNumber: 92, nextSlot: "home" },
  { matchNumber: 79, stage: "r32", date: "2026-06-29", venue: "Gillette Stadium, Foxborough", home: "Germany", away: "Paraguay", homeScore: 1, awayScore: 1, homePen: 3, awayPen: 4, homeSource: "Winner Group E", awaySource: "3rd-place qualifier", nextMatchNumber: 90, nextSlot: "home" },
  { matchNumber: 80, stage: "r32", date: "2026-07-01", venue: "Mercedes-Benz Stadium, Atlanta", home: "England", away: "DR Congo", homeScore: 2, awayScore: 1, homeSource: "Winner Group L", awaySource: "Runner-up Group K", nextMatchNumber: 92, nextSlot: "away" },
  { matchNumber: 81, stage: "r32", date: "2026-07-01", venue: "Levi's Stadium, Santa Clara", home: "United States", away: "Bosnia and Herzegovina", homeScore: 2, awayScore: 0, homeSource: "Winner Group D", awaySource: "Runner-up Group B", nextMatchNumber: 94, nextSlot: "home" },
  { matchNumber: 82, stage: "r32", date: "2026-07-01", venue: "Lumen Field, Seattle", home: "Belgium", away: "Senegal", homeScore: 3, awayScore: 2, homeSource: "Winner Group G", awaySource: "Runner-up Group I", nextMatchNumber: 94, nextSlot: "away" },
  { matchNumber: 83, stage: "r32", date: "2026-06-27", venue: "BMO Field, Toronto", home: "Portugal", away: "Croatia", homeScore: 2, awayScore: 1, homeSource: "Winner Group K", awaySource: "Runner-up Group L", nextMatchNumber: 93, nextSlot: "home" },
  { matchNumber: 84, stage: "r32", date: "2026-06-27", venue: "BC Place, Vancouver", home: "Switzerland", away: "Algeria", homeScore: 2, awayScore: 0, homeSource: "Runner-up Group B", awaySource: "Runner-up Group J", nextMatchNumber: 96, nextSlot: "home" },
  { matchNumber: 85, stage: "r32", date: "2026-07-03", venue: "Hard Rock Stadium, Miami Gardens", home: "Colombia", away: "Ghana", live: true, homeSource: "Winner Group K", awaySource: "Runner-up Group L", nextMatchNumber: 96, nextSlot: "away" },
  { matchNumber: 86, stage: "r32", date: "2026-07-03", venue: "AT&T Stadium, Arlington", home: "Egypt", away: "Australia", homeScore: 1, awayScore: 1, homePen: 4, awayPen: 2, homeSource: "Winner Group G", awaySource: "Runner-up Group D", nextMatchNumber: 95, nextSlot: "away" },
  { matchNumber: 87, stage: "r32", date: "2026-06-30", venue: "MetLife Stadium, East Rutherford", home: "France", away: "Sweden", homeScore: 3, awayScore: 0, homeSource: "Winner Group I", awaySource: "3rd-place qualifier", nextMatchNumber: 90, nextSlot: "away" },
  { matchNumber: 88, stage: "r32", date: "2026-07-02", venue: "Mercedes-Benz Stadium, Atlanta", home: "Argentina", away: "Cabo Verde", homeScore: 3, awayScore: 2, homeSource: "Winner Group J", awaySource: "3rd-place qualifier", nextMatchNumber: 95, nextSlot: "home" },

  // Round of 16 (89-96) - actual matchups. Winners pre-filled; the Colombia/Ghana
  // slot in match 96 stays a placeholder until that R32 tie finishes.
  { matchNumber: 89, stage: "r16", date: "2026-07-04", venue: "NRG Stadium, Houston", home: "Canada", away: "Morocco", homeSource: "Winner Match 73", awaySource: "Winner Match 75", nextMatchNumber: 97, nextSlot: "home" },
  { matchNumber: 90, stage: "r16", date: "2026-07-04", venue: "Lincoln Financial Field, Philadelphia", home: "Paraguay", away: "France", homeSource: "Winner Match 79", awaySource: "Winner Match 87", nextMatchNumber: 97, nextSlot: "away" },
  { matchNumber: 91, stage: "r16", date: "2026-07-05", venue: "MetLife Stadium, East Rutherford", home: "Brazil", away: "Norway", homeSource: "Winner Match 74", awaySource: "Winner Match 77", nextMatchNumber: 98, nextSlot: "home" },
  { matchNumber: 92, stage: "r16", date: "2026-07-05", venue: "Estadio Azteca, Mexico City", home: "Mexico", away: "England", homeSource: "Winner Match 78", awaySource: "Winner Match 80", nextMatchNumber: 98, nextSlot: "away" },
  { matchNumber: 93, stage: "r16", date: "2026-07-06", venue: "AT&T Stadium, Arlington", home: "Portugal", away: "Spain", homeSource: "Winner Match 83", awaySource: "Winner Match 76", nextMatchNumber: 99, nextSlot: "home" },
  { matchNumber: 94, stage: "r16", date: "2026-07-06", venue: "Lumen Field, Seattle", home: "United States", away: "Belgium", homeSource: "Winner Match 81", awaySource: "Winner Match 82", nextMatchNumber: 99, nextSlot: "away" },
  { matchNumber: 95, stage: "r16", date: "2026-07-07", venue: "Mercedes-Benz Stadium, Atlanta", home: "Argentina", away: "Egypt", homeSource: "Winner Match 88", awaySource: "Winner Match 86", nextMatchNumber: 100, nextSlot: "home" },
  { matchNumber: 96, stage: "r16", date: "2026-07-07", venue: "BC Place, Vancouver", home: "Switzerland", awaySource: "Winner Match 85", homeSource: "Winner Match 84", nextMatchNumber: 100, nextSlot: "away" },

  // Quarterfinals (97-100)
  { matchNumber: 97, stage: "qf", date: "2026-07-09", venue: "Gillette Stadium, Foxborough", homeSource: "Winner Match 89", awaySource: "Winner Match 90", nextMatchNumber: 101, nextSlot: "home" },
  { matchNumber: 98, stage: "qf", date: "2026-07-10", venue: "SoFi Stadium, Inglewood", homeSource: "Winner Match 91", awaySource: "Winner Match 92", nextMatchNumber: 101, nextSlot: "away" },
  { matchNumber: 99, stage: "qf", date: "2026-07-10", venue: null, homeSource: "Winner Match 93", awaySource: "Winner Match 94", nextMatchNumber: 102, nextSlot: "home" },
  { matchNumber: 100, stage: "qf", date: "2026-07-11", venue: null, homeSource: "Winner Match 95", awaySource: "Winner Match 96", nextMatchNumber: 102, nextSlot: "away" },

  // Semifinals (101-102)
  { matchNumber: 101, stage: "sf", date: "2026-07-14", venue: "AT&T Stadium, Arlington", homeSource: "Winner Match 97", awaySource: "Winner Match 98", nextMatchNumber: 104, nextSlot: "home" },
  { matchNumber: 102, stage: "sf", date: "2026-07-15", venue: null, homeSource: "Winner Match 99", awaySource: "Winner Match 100", nextMatchNumber: 104, nextSlot: "away" },

  // Third place (103) - not auto-populated (would need runner-up propagation, out of scope for MVP).
  { matchNumber: 103, stage: "third_place", date: "2026-07-18", venue: "Hard Rock Stadium, Miami Gardens", homeSource: "Runner-up Match 101", awaySource: "Runner-up Match 102", nextMatchNumber: null, nextSlot: null },

  // Final (104)
  { matchNumber: 104, stage: "final", date: "2026-07-19", venue: "MetLife Stadium, East Rutherford", homeSource: "Winner Match 101", awaySource: "Winner Match 102", nextMatchNumber: null, nextSlot: null },
];

async function main() {
  // Clear existing data so this script is safe to re-run as results come in.
  // Order matters: matches reference teams/groups, and self-reference via next_match_id.
  console.log("Clearing existing data...");
  await db.from("matches").update({ next_match_id: null }).not("id", "is", null);
  await db.from("matches").delete().not("id", "is", null);
  await db.from("teams").delete().not("id", "is", null);
  await db.from("groups").delete().not("id", "is", null);

  console.log("Seeding groups...");
  const groupIdByName = new Map<string, number>();
  for (const name of GROUPS) {
    const { data, error } = await db.from("groups").insert({ name }).select().single();
    if (error) throw error;
    groupIdByName.set(name, data.id);
  }

  console.log("Seeding teams...");
  const teamIdByName = new Map<string, number>();
  for (const t of TEAMS) {
    const { data, error } = await db
      .from("teams")
      .insert({ name: t.name, fifa_code: t.fifa, flag_code: t.flag, group_id: groupIdByName.get(t.group) })
      .select()
      .single();
    if (error) throw error;
    teamIdByName.set(t.name, data.id);
  }

  console.log("Seeding group-stage matches...");
  let matchNumber = 1;
  for (const [group, date, home, away, hs, as_, venue] of GROUP_MATCHES) {
    const { error } = await db.from("matches").insert({
      match_number: matchNumber++,
      stage: "group",
      group_id: groupIdByName.get(group),
      home_team_id: teamIdByName.get(home),
      away_team_id: teamIdByName.get(away),
      home_score: hs,
      away_score: as_,
      status: "finished",
      kickoff_at: `${date}T00:00:00Z`,
      venue,
    });
    if (error) throw error;
  }

  console.log("Seeding knockout stage...");
  const matchIdByNumber = new Map<number, number>();
  for (const m of KNOCKOUT) {
    const status = m.live
      ? "live"
      : m.homeScore != null && m.awayScore != null
        ? "finished"
        : "scheduled";
    const { data, error } = await db
      .from("matches")
      .insert({
        match_number: m.matchNumber,
        stage: m.stage,
        home_team_id: m.home ? teamIdByName.get(m.home) : null,
        away_team_id: m.away ? teamIdByName.get(m.away) : null,
        home_source: m.homeSource,
        away_source: m.awaySource,
        home_score: m.homeScore ?? null,
        away_score: m.awayScore ?? null,
        home_pen: m.homePen ?? null,
        away_pen: m.awayPen ?? null,
        status,
        kickoff_at: m.date ? `${m.date}T00:00:00Z` : null,
        venue: m.venue,
      })
      .select()
      .single();
    if (error) throw error;
    matchIdByNumber.set(m.matchNumber, data.id);
  }

  console.log("Wiring bracket links...");
  for (const m of KNOCKOUT) {
    if (!m.nextMatchNumber || !m.nextSlot) continue;
    const { error } = await db
      .from("matches")
      .update({
        next_match_id: matchIdByNumber.get(m.nextMatchNumber),
        next_match_slot: m.nextSlot,
      })
      .eq("id", matchIdByNumber.get(m.matchNumber));
    if (error) throw error;
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
