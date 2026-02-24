"use client";

import * as React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Scoreboard } from "@/components/live/Scoreboard";
import { VisualCourt } from "@/components/live/VisualCourt";
import { CodeInput } from "@/components/sections/codes/CodeInput";
import { RecentCodesTable } from "@/components/sections/codes/RecentCodes";
import { PageHeader } from "@/components/app/PageHeader";
import type { MatchState, PlayerMap } from "@/types/live";

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch");
  return await r.json();
};

function mapPosition(pos: string | null): string {
  if (!pos) return "?";
  if (pos.toLowerCase().includes("outside")) return "OH";
  if (pos.toLowerCase().includes("middle")) return "MB";
  if (pos.toLowerCase().includes("setter")) return "S";
  if (pos.toLowerCase().includes("libero")) return "L";
  if (pos.toLowerCase().includes("opposite")) return "OP";
  return pos.substring(0, 2).toUpperCase();
}

export default function CodingPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  const { data: state, error: stateError, mutate } = useSWR<MatchState>(
    matchId ? `/api/backend/api/v1/match/${matchId}/state` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  const { data: match } = useSWR(
    matchId ? `/api/backend/api/v1/match/${matchId}` : null,
    fetcher
  );

  const { data: homeTeam } = useSWR(
    match ? `/api/backend/api/v1/team/${match.home_team_id}` : null,
    fetcher
  );
  
  const { data: awayTeam } = useSWR(
    match ? `/api/backend/api/v1/team/${match.away_team_id}` : null,
    fetcher
  );

  const homeTeamName = homeTeam?.name || "Home Team";
  const awayTeamName = awayTeam?.name || "Away Team";

  const homeHistoryUrl = match 
    ? `/api/backend/api/v1/player-team-history/?team_id=${match.home_team_id}&season_id=${match.season_id}&limit=100` 
    : null;
  const awayHistoryUrl = match 
    ? `/api/backend/api/v1/player-team-history/?team_id=${match.away_team_id}&season_id=${match.season_id}&limit=100` 
    : null;

  const { data: homePlayers } = useSWR<any[]>(homeHistoryUrl, fetcher);
  const { data: awayPlayers } = useSWR<any[]>(awayHistoryUrl, fetcher);

  const playerMap = React.useMemo(() => {
    const map: PlayerMap = {};
    const process = (list: any[]) => {
      if (!list) return;
      list.forEach((p) => {
        const firstName = p.player?.first_name || p.first_name || "";
        const lastName = p.player?.last_name || p.last_name || "Player";
        const positionRaw = p.player?.playing_position || p.playing_position || "";

        const name = firstName ? `${firstName[0]}. ${lastName}` : lastName;
        const pos = mapPosition(positionRaw);

        map[p.player_id] = {
          jersey: p.jersey_number || 0,
          name: name,
          position: pos,
        };
      });
    };
    if (homePlayers) process(homePlayers);
    if (awayPlayers) process(awayPlayers);
    return map;
  }, [homePlayers, awayPlayers]);

  const handleUndo = async () => {
    try {
      await fetch(`/api/backend/api/v1/match/${matchId}/rally/last`, { method: "DELETE", credentials: "include" });
      toast.success("Action undone!");
      mutate();
    } catch (e) {
      toast.error("Could not undo action");
    }
  };

  if (stateError) return <div className="p-10 text-center text-red-500">Error loading match.</div>;
  if (!state || !match) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // Sprawdzamy, czy ktoś ugrał 3 sety (koniec meczu)
  const isMatchFinished = state.home_sets === 3 || state.away_sets === 3;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isMatchFinished ? "Match Finished" : "Live Mode"}
        description={isMatchFinished ? "This match has concluded." : "Start a live mode session to save match data."}
        breadcrumbs={[{ label: "Live Mode", href: "/live" }, { label: "Match" }]}
      />
      
      {/* SCOREBOARD */}
      <Scoreboard 
        state={state}
        homeTeamName={homeTeamName} 
        awayTeamName={awayTeamName} 
        isMatchFinished={isMatchFinished} // Przekazujemy stan do Scoreboardu
      />

      {/* CODE INPUT */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <CodeInput 
          matchId={matchId} 
          onUpdated={() => mutate()} 
          canUndo={
            state.last_rallies && 
            state.last_rallies.some(r => r.set_number === state.set_number)
          } 
          isMatchFinished={isMatchFinished} // Przekazujemy stan do Inputu
        />
      </div>

      {/* VISUAL COURT */}
      <VisualCourt 
        homeRotation={state.rotation_home}
        awayRotation={state.rotation_away}
        playerMap={playerMap}
        servingSide={state.serving_side}
        servingIndex={state.serving_index}
      />

      {/* RECENT RALLIES */}
      <div className="bg-card border-2 rounded-lg p-6 shadow-sm">
        <RecentCodesTable 
          rallies={state.last_rallies} 
          currentSetNumber={state.set_number} 
          onUndo={handleUndo} 
        />
      </div>
    </div>
  );
}