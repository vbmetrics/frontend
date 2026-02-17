export interface SeasonReadDTO {
  id: string; // UUID z backendu przychodzi jako string
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  // dodaj inne pola jeśli rozszerzysz backend
}