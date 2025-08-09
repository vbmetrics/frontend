import { Country } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_USER = process.env.NEXT_PUBLIC_API_USER;
const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD;

const basicAuthToken = btoa(`${API_USER}:${API_PASSWORD}`);

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicAuthToken}`
};

export const getCountries = async (): Promise<Country[]> => {
    const response = await fetch(`${API_BASE_URL}/countries`, { headers });

    if (!response.ok) throw new Error('Failed to fetch countries');

    return response.json();
};

type CountryCreationData = Omit<Country, 'id' | 'other_db_fields'>;

export const createCountry = async (countryData: CountryCreationData): Promise<Country> => {
    const response = await fetch(`${API_BASE_URL}/countries/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(countryData),
    });

    if (!response.ok) throw new Error('Failed to create country');

    return response.json();
};
