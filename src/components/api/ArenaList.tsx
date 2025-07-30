"use client";

import { Arena } from "@/lib/types";

interface ArenaListProps {
    arenas: Arena[];
    loading: boolean;
    error: string | null;
    onEdit: (arena: Arena) => void;
    onDelete: (arenaId: string) => void;
}

export default function ArenaList({ 
    arenas, 
    loading, 
    error, 
    onEdit, 
    onDelete 
}: ArenaListProps) {
    if ( loading ) return <p>Loading...</p>;
    if ( error ) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Arenas List</h2>
            <ul className="space-y-2">
                {arenas.map(arena => (
                    <li key={arena.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                            <strong>{arena.name}</strong>
                            <br />
                            <small>{arena.city || 'No data'}, {arena.country_code} - Capacity: {arena.capacity || 'N/A'}</small>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => onEdit(arena)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                                Edit
                            </button>
                            <button onClick={() => onDelete(arena.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
