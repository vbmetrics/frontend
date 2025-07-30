"use client";

import { useState, FormEvent, useEffect } from "react";
import { Season, SeasonType } from "@/lib/types";

interface SeasonFormProps {
    onSave: () => void;
    editingSeason: Season | null;
}

export default function SeasonForm({ onSave, editingSeason }: SeasonFormProps) {
    const [name, setName] = useState('');
    const [seasonType, setType] = useState<SeasonType>('club');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (editingSeason) {
            setName(editingSeason.name);
            setType(editingSeason.season_type);
            setStartDate(editingSeason.start_date);
            setEndDate(editingSeason.end_date);
        } else {
            setName('');
            setType('club');
            setStartDate('');
            setEndDate('');
        }
    }, [editingSeason]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        const url = editingSeason
            ? `http://127.0.0.1:8000/api/v1/seasons/${editingSeason.id}`
            : 'http://127.0.0.1:8000/api/v1/seasons';
        
        const method = editingSeason ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: name,
                    season_type: seasonType,
                    start_date: startDate,
                    end_date: endDate, 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Operation failed.');
            }

            onSave();
            setMessage(`Successfully ${editingSeason ? 'updated' : 'added'} season!`);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">
                {editingSeason ? 'Edit Season' : 'Add New Season' }
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded w-full" />
            </div>
            <div>
            <label htmlFor="type">Type:</label>
            <select id="type" value={seasonType} onChange={(e) => setType(e.target.value as SeasonType)} required className="border p-2 rounded w-full">
                <option value="club">Club</option>
                <option value="national">National</option>
            </select>
            </div>
            <div>
            <label htmlFor="startDate">Start Date:</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="border p-2 rounded w-full" />
            </div>
            <div>
            <label htmlFor="endDate">End Date:</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="border p-2 rounded w-full" />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingSeason ? 'Save Changes' : 'Add Season'}
            </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
