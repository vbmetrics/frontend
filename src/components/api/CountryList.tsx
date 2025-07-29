"use client";

import { Country } from '@/lib/types';

import { ScrollArea } from "@/components/ui/scroll-area";

// Definiujemy typy dla propsów, które komponent będzie otrzymywać
interface CountryListProps {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

// Odbieramy dane z propsów zamiast pobierać je tutaj
export default function CountryList({ countries, loading, error }: CountryListProps) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-2">
    <h2 className="text-xl font-bold mb-2">Countries List</h2>
    <ScrollArea className="h-96 w-84 rounded-md border">
        <ul>
            {countries.map(country => (
            <li key={country.code}>
                {country.name} - {country.code} 
            </li>
            ))}
        </ul>
    </ScrollArea>
    </div>
  );
}