"use client";

import { useState, FormEvent, useEffect } from "react";
import { Arena, Country } from "@/lib/types";

interface ArenaFormProps {
    onSave: () => void;
    editingArena: Arena | null;
}

export default function ArenaForm({ onSave, editingArena }: ArenaFormProps) {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [capacity, setCapacity] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [message, setMessage] = useState('');

    // Pobierz listę krajów do wyświetlenia w dropdownie
    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/v1/countries');
            const data: Country[] = await response.json();
            setCountries(data);
            if (data.length > 0 && !editingArena) {
                setCountryCode(data[0].code);
            }
        };
        fetchCountries();
    }, []);

    // Uzupełnij formularz danymi, gdy włączony jest tryb edycji
    useEffect(() => {
        if (editingArena) {
            setName(editingArena.name);
            setCity(editingArena.city || '');
            setAddress(editingArena.address || '');
            setCapacity(editingArena.capacity?.toString() || '');
            setCountryCode(editingArena.country_code);
        } else {
            setName('');
            setCity('');
            setAddress('');
            setCapacity('');
        }
    }, [editingArena]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        const url = editingArena ? `http://127.0.0.1:8000/api/v1/arenas/${editingArena.id}` : 'http://127.0.0.1:8000/api/v1/arenas';
        const method = editingArena ? 'PUT' : 'POST';

        const payload = {
            name,
            country_code: countryCode,
            city: city || null,
            address: address || null,
            capacity: capacity ? parseInt(capacity) : null,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Operation failed.');
        }
        onSave();
        setMessage(`Successfully ${editingArena ? 'updated' : 'added'} arena!`);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
      <h2 className="text-xl font-bold mb-2">{editingArena ? 'Edit Arena' : 'Add New Arena'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label htmlFor="name">Name:</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded w-full" /></div>
        <div><label htmlFor="country">Country:</label><select id="country" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} required className="border p-2 rounded w-full">{countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
        <div><label htmlFor="city">City:</label><input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 rounded w-full" /></div>
        <div><label htmlFor="address">Address:</label><input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2 rounded w-full" /></div>
        <div><label htmlFor="capacity">Capacity:</label><input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="border p-2 rounded w-full" /></div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editingArena ? 'Save' : 'Add'}</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
    );
}
