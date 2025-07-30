"use client";

import { useState, useEffect } from 'react';

export default function TeamsPage() {
    /* const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSeason, setEditingSeason] = useState<Season | null>(null); */

    const fetchSeasons = async () => {
    };

    useEffect(() => {
        fetchSeasons();
    }, []);

    const handleSave = () => {
    };

    const handleDelete = async (seasonId: string) => {
    };
    
    return (
        <main className="p-8">
        <h1 className="text-3xl font-bold mb-8">Teams</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
            {/* Formularz do dodawania i edycji */}

            </section>
            <section>
            {/* Lista sezonów z przyciskami do edycji/usuwania */}

            </section>
        </div>
        </main>
    );
}
