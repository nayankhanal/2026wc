-- 2026 World Cup Wallchart schema

create type match_stage as enum ('group', 'r32', 'r16', 'qf', 'sf', 'third_place', 'final');
create type match_status as enum ('scheduled', 'live', 'finished');
create type bracket_slot as enum ('home', 'away');

create table groups (
  id serial primary key,
  name text not null unique -- 'A'..'L'
);

create table teams (
  id serial primary key,
  name text not null,
  fifa_code text not null, -- 3-letter code, e.g. 'BRA'
  flag_code text not null, -- ISO 3166-1 alpha-2 for flag-icons, e.g. 'br'
  group_id integer references groups(id)
);

create table matches (
  id serial primary key,
  match_number integer not null unique, -- official FIFA match numbering
  stage match_stage not null,
  group_id integer references groups(id),
  home_team_id integer references teams(id),
  away_team_id integer references teams(id),
  home_source text, -- e.g. 'Winner Match 73' shown until resolved
  away_source text,
  home_score integer,
  away_score integer,
  home_pen integer,
  away_pen integer,
  status match_status not null default 'scheduled',
  kickoff_at timestamptz,
  venue text,
  next_match_id integer references matches(id),
  next_match_slot bracket_slot
);

create index on matches (stage);
create index on matches (group_id);
create index on matches (next_match_id);

alter table groups enable row level security;
alter table teams enable row level security;
alter table matches enable row level security;

create policy "public read groups" on groups for select using (true);
create policy "public read teams" on teams for select using (true);
create policy "public read matches" on matches for select using (true);

-- No insert/update/delete policies for the anon role: all writes go through
-- the service-role key from server actions, which bypasses RLS entirely.
