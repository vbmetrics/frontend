export interface TeamReadDTO {
  id: string; // UUID
  name: string;
  team_type?: string; // np. "club", "national"
  country_code?: string;
  home_arena_id?: string | null;
  // dodaj inne pola, które zwraca Twój backend
}