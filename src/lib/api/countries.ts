import { apiFetch } from "./client";

export type CountryReadDTO = {
  name: string;
  alpha_2_code: string;
  latitude: number;
  longitude: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export function getCountries(): Promise<CountryReadDTO[]> {
  return apiFetch<CountryReadDTO[]>("api/v1/country");
}
