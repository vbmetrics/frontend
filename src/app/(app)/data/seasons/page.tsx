"use client";

import { useState, useEffect } from 'react';
import { Season } from '@/lib/types';
import SeasonList from '@/components/api/SeasonList';
import SeasonForm from '@/components/forms/SeasonForm';

export default function SeasonsPage() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSeason, setEditingSeason] = useState<Season | null>(null);

    const fetchSeasons = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/seasons');
            if (!response.ok) {
                throw new Error('Error fetching seasons');
            }
            const data: Season[] = await response.json();
            setSeasons(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeasons();
    }, []);

    const handleSave = () => {
        setEditingSeason(null);
        fetchSeasons();
    };

    const handleDelete = async (seasonId: string) => {
        if (!confirm('Are you sure you want to delete season?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/seasons/${seasonId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Cannot delete season.');
            }
            fetchSeasons();
        } catch (error: any) {
            setError(error.message);
        }
    };
    
    return (
        <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">Manage Seasons</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
            {/* Formularz do dodawania i edycji */}
            <SeasonForm onSave={handleSave} editingSeason={editingSeason} />
            </section>
            <section>
            {/* Lista sezonów z przyciskami do edycji/usuwania */}
            <SeasonList
                seasons={seasons}
                loading={loading}
                error={error}
                onEdit={setEditingSeason} // Przekazujemy funkcję do ustawiania edytowanego sezonu
                onDelete={handleDelete}
            />
            </section>
        </div>
        </main>
    );
}
