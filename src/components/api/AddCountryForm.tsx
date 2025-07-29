"use client";

import { useState, FormEvent } from 'react';

// Definiujemy typy dla propsów
interface AddCountryFormProps {
  onCountryAdded: () => void; // Oczekujemy funkcji, która nic nie zwraca
}

export default function AddCountryForm({ onCountryAdded }: AddCountryFormProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Cannot load countries list.');
      }

      const newCountry = await response.json();
      setMessage(`Pomyślnie dodano kraj: ${newCountry.name}!`);
      setCode('');
      setName('');
      
      // NAJWAŻNIEJSZA ZMIANA: Wywołujemy funkcję od rodzica, aby dać mu znać, że ma odświeżyć dane
      onCountryAdded(); 

    } catch (error: any) {
      setMessage(`Błąd: ${error.message}`);
    }
  };

  // ...reszta formularza bez zmian...
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Add new country</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code">Code (2 characters):</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={2}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
