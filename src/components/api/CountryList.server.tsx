import { getCountries } from "@/lib/api/countries";

export default async function CountryListServer() {
  const countries = await getCountries(); // SSR – apiFetch już dokleja cookie
  return (
    <ul>
      {countries.map((c, idx) => (
        <li key={c.alpha_2_code || `${c.name}-${idx}`}>
          <b>{c.name}</b> ({c.alpha_2_code}) — {c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
