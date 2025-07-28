"use client";

import { useEffect, useState } from "react";

type Team = {
  base_name: string;
};

type Match = {
  id: string;
  date: string;
  home_team: Team;
  away_team: Team;
  score: string | null;
  status: 'Finished' | 'Live' | null;
};

export default function DashboardPage() {
  const [ matches, setMatches ] = useState<Match[]>([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/matches");
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (isLoading) return <div>Loading matches...</div>; // TODO: use loading animation from NextJS

  return (
    <div>
      <h1 className="ml-12 mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="ml-12 rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-xl font-semibold">Recent Matches</h2>
        <ul>
          {matches.map((match) => (
            <li key={match.id} className="flex justify-between border-b py-2">
              <span>
                {match.home_team.base_name} vs {match.away_team.base_name}
              </span>
              <span className="font-mono">{match.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
