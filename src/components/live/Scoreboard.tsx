"use client";

export function Scoreboard({
  setNumber,
  homeSets,
  awaySets,
  homePoints,
  awayPoints,
}: {
  setNumber: number;
  homeSets: number;
  awaySets: number;
  homePoints: number;
  awayPoints: number;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">Set {setNumber}</div>
      <div className="text-xl font-semibold">
        Sets: {homeSets} : {awaySets}
      </div>
      <div className="text-3xl font-bold">
        {homePoints} : {awayPoints}
      </div>
    </div>
  );
}
