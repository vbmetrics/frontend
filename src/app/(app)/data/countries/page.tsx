// src/app/(app)/data/countries/page.tsx
import CountryTableClient from "@/components/api/CountryTable.client"; // to jest "use client" komponent

export default function CountriesPage() {
  return (
    <main className="p-4 md:p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Countries</h1>
      <CountryTableClient />
    </main>
  );
}
