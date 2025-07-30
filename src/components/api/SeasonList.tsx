"use client";

import { Season } from "@/lib/types";

interface SeasonListProps {
    seasons: Season[];
    loading: boolean;
    error: string | null;
    onEdit: (season: Season) => void;
    onDelete: (seasonId: string) => void;
}

export default function SeasonList({ 
    seasons, 
    loading, 
    error, 
    onEdit, 
    onDelete 
}: SeasonListProps) {
    if ( loading ) return <p>Loading...</p>;
    if ( error ) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Seasons List</h2>
            <ul className="space-y-2">
                {seasons.map(season => (
                    <li key={season.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                            <strong>{season.name}</strong> ({season.season_type})
                            <br />
                            <small>{season.start_date} - {season.end_date}</small>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => onEdit(season)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                                Edit
                            </button>
                            <button onClick={() => onDelete(season.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
