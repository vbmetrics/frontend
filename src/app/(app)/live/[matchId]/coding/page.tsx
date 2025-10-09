"use client";

import * as React from "react";
import useSWR from "swr";
import { getMatchState } from "@/lib/api/matches";
import { Scoreboard } from "@/components/live/Scoreboard";
import { CodeInput } from "@/components/sections/codes/CodeInput";
import { RecentCodesTable } from "@/components/sections/codes/RecentCodes";
import { useParams } from "next/navigation";

export default function CodingPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { data: state, mutate } = useSWR(
    matchId ? ["/match-state", matchId] : null,
    () => getMatchState(matchId),
    { refreshInterval: 5000 } // lekki polling
  );

  const refresh = () => mutate();

  return (
    <div className="w-full">
      <h1 className="ml-12 mb-6 text-3xl font-bold">Live Coding</h1>
      <div className="ml-12 max-w-5xl grid gap-6">
        {state && (
          <Scoreboard
            setNumber={state.set_number}
            homeSets={state.home_sets}
            awaySets={state.away_sets}
            homePoints={state.home_points}
            awayPoints={state.away_points}
          />
        )}
        <CodeInput matchId={matchId} onUpdated={refresh} />
        {/* TODO: RecentCodesTable podłącz do state.last_rallies lub GET /rallies?limit=... */}
        <RecentCodesTable />
      </div>
    </div>
  );
}
