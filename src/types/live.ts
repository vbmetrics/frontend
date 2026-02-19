// src/types/live.ts

export interface PastSet {
  set_number: number;
  home_score: number;
  away_score: number;
}

export interface Rotation {
  order: string[]; // Tablica UUID
  libero_id: string | null;
}

export interface RallyRecord {
  id: string;
  rally_number_in_set: number;
  set_number: number;          // Dodane do filtrowania w tabeli historii
  raw_rally_code: string;
  score_team_id: string;
  serve_team_id?: string;
  home_score: number;          // Dodane do wyświetlania wyniku po akcji
  away_score: number;          // Dodane do wyświetlania wyniku po akcji
}

export interface MatchState {
  match_id: string;
  set_number: number;
  home_sets: number;
  away_sets: number;
  home_points: number;
  away_points: number;
  serving_side: "home" | "away";
  serving_index: number;
  rotation_home: Rotation;
  rotation_away: Rotation;
  last_rallies: RallyRecord[];
  past_sets: PastSet[];
}

export type PlayerMap = Record<string, { jersey: number; name: string; position: string }>;