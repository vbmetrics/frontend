// UWAGA: brak "use server" – ten moduł jest używany także w client components/SWR
import { apiFetch } from "@/lib/api/client";
import { buildUrl } from "@/lib/api/http";

export type UUID = string;

export type Season = { id: UUID; name: string };
export type Team   = { id: UUID; name: string };
export type Arena  = { id: UUID; name: string };
export type Player = { id: UUID; number: number; full_name: string; position?: string };

export type CreateMatchPayload = {
  match_date?: string;   // 'YYYY-MM-DD'
  spectators?: number;
  season_id: UUID;
  home_team_id: UUID;
  away_team_id: UUID;
  arena_id?: UUID;
};

export type Match = {
  id: UUID;
  match_date?: string | null;
  spectators?: number | null;
  home_team_score?: number | null;
  away_team_score?: number | null;
  season_id: UUID;
  home_team_id: UUID;
  away_team_id: UUID;
  winner_team_id?: UUID | null;
  arena_id?: UUID | null;
  created_at?: string;
  updated_at?: string;
};

// helper – usuń undefined/null/"" z payloadu
function compact<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as Partial<T>;
}

// listy
export async function listSeasons(params?: { skip?: number; limit?: number; search?: string }) {
  return apiFetch<Season[]>(buildUrl("/api/v1/season", params));
}
export async function listArenas(params?: { skip?: number; limit?: number; country_code?: string; city?: string; search?: string }) {
  return apiFetch<Arena[]>(buildUrl("/api/v1/arena", params));
}
export async function listTeams(params?: { skip?: number; limit?: number; team_type?: string; country_code?: string; home_arena_id?: UUID; search?: string; season_id?: UUID }) {
  return apiFetch<Team[]>(buildUrl("/api/v1/team", params));
}
export async function listPlayers(params?: { skip?: number; limit?: number; nationality_code?: string; playing_position?: string; search?: string }) {
  return apiFetch<Player[]>(buildUrl("/api/v1/player", params));
}

// create
export async function createMatch(data: CreateMatchPayload) {
  return apiFetch<Match>("/api/v1/match/", {
    method: "POST",
    body: JSON.stringify(compact(data)),
    headers: { "content-type": "application/json" },
  });
}

export async function getMatch(matchId: UUID) {
  return apiFetch<Match>(`/api/v1/match/${matchId}`);
}

/** (pod przyszłe kroki) – lineup/state/rally */
export type LineupSide = {
  team_id: UUID;
  positions: { P1?: UUID; P2?: UUID; P3?: UUID; P4?: UUID; P5?: UUID; P6?: UUID };
  libero_id?: UUID | null;
};

export type MatchState = {
  match_id: UUID;
  set_number: number;
  home_sets: number;
  away_sets: number;
  home_points: number;
  away_points: number;
  last_rallies: Array<{ id: UUID; code: string; result: "home" | "away" | "error"; score: string }>;
};

export async function submitInitialLineups(matchId: UUID, home: LineupSide, away: LineupSide) {
  return apiFetch<void>(`/api/v1/match/${matchId}/lineup`, {
    method: "POST",
    body: JSON.stringify({ home, away, set_number: 1 }),
    headers: { "content-type": "application/json" },
  });
}

export async function getMatchState(matchId: UUID) {
  return apiFetch<MatchState>(`/api/v1/match/${matchId}/state`);
}

export async function postRally(matchId: UUID, code: string) {
  return apiFetch<MatchState>(`/api/v1/match/${matchId}/rallies`, {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: { "content-type": "application/json" },
  });
}
