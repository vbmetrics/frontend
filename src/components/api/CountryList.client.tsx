// src/components/api/CountryList.client.tsx
"use client";

import useSWR from "swr";

type CountryReadDTO = {
  name: string;
  alpha_2_code: string;     // ISO alpha-2 — użyjemy jako key
  latitude: number;
  longitude: number;
  created_at?: string | null;
  updated_at?: string | null;
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then(async (r) => {
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      throw new Error(`${r.status}: ${text || r.statusText}`);
    }
    return r.json();
  });

export default function CountryListClient() {
  const { data, error, isLoading, mutate } = useSWR<CountryReadDTO[]>(
    "/api/backend/api/v1/country",
    fetcher
  );

  if (isLoading) return <p>Ładowanie…</p>;
  if (error) {
    // Gdy niezalogowany => 401
    if ((error as Error).message.startsWith("401:"))
      return <p>Nieautoryzowano — zaloguj się.</p>;
    return <p>Błąd: {(error as Error).message}</p>;
  }

  const countries = data ?? [];

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ opacity: 0.7 }}>
        Łącznie: <b>{countries.length}</b>
      </div>
      <ul>
        {countries.map((c, idx) => (
          <li key={c.alpha_2_code || `${c.name}-${idx}`}>
            <b>{c.name}</b> ({c.alpha_2_code}) —{" "}
            {c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
