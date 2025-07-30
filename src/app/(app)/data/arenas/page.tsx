"use client";

import { useState, useEffect } from 'react';
import { Arena } from '@/lib/types';
import ArenaList from '@/components/api/ArenaList';
import ArenaForm from '@/components/forms/ArenaForm';

export default function ArenasPage() {
    const [arenas, setArenas] = useState<Arena[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingArena, setEditingArena] = useState<Arena | null>(null);

    const fetchArenas = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/arenas');
        if (!response.ok) {
            throw new Error('Error fetching arenas');
        }
            const data: Arena[] = await response.json();
            setArenas(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArenas();
    }, []);

    const handleSave = () => {
        setEditingArena(null); // Wyjdź z trybu edycji
        fetchArenas(); // Odśwież listę
    };

    const handleDelete = async (arenaId: string) => {
        if (!confirm('Are you sure you want to delete arena?')) return;

        try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/arenas/${arenaId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Cannot delete arena.');
        }
        fetchArenas();
        } catch (error: any) {
            setError(error.message);
        }
    };
    
    return (
        <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manage Arenas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <ArenaForm onSave={handleSave} editingArena={editingArena} />
        </section>
        <section>
          <ArenaList
            arenas={arenas}
            loading={loading}
            error={error}
            onEdit={setEditingArena}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
    );
}
