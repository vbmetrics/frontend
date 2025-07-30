"use client";

import { useState, useEffect } from 'react';
import CountryList from '@/components/api/CountryList';
import AddCountryForm from '@/components/forms/AddCountryForm';
import { Country } from '@/lib/types';

export default function CountriesPage() {
    // Przenosimy stan i logikę pobierania tutaj
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Funkcja do pobierania danych, której będziemy mogli używać wielokrotnie
    const fetchCountries = async () => {
        setLoading(true);
        try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/countries');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Country[] = await response.json();
        setCountries(data);
        } catch (error: any) {
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };

    // Pobierz dane przy pierwszym załadowaniu komponentu
    useEffect(() => {
        fetchCountries();
    }, []);

    // Funkcja, która zostanie wywołana po pomyślnym dodaniu kraju
    const handleCountryAdded = () => {
        // Po prostu uruchamiamy pobieranie danych ponownie, aby zaktualizować listę
        fetchCountries();
    };

    return (
        <div>
            <h1 className="ml-12 mb-6 text-3xl font-bold">Countries Data</h1>
            <div className="ml-12 mb-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <AddCountryForm onCountryAdded={handleCountryAdded} />
                </section>
                <section>
                    {/* Przekazujemy pobrane dane jako props */}
                    <CountryList countries={countries} loading={loading} error={error} />
                </section>
            </div>
        </div>
    );
}

    
