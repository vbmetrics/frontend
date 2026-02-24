"use client";

import * as React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Fetcher z ciasteczkami
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return await r.json();
};

async function apiCall(url: string, method: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "API request failed");
  }
  return res.json();
}

type RotationKey = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";
type LineupSide = { positions: Record<RotationKey, string>; libero_id: string };

export default function MatchSetupClient({ match }: { match: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  // Stan formularza
  const [startingServer, setStartingServer] = React.useState<"home" | "away">("home");
  const [homeLineup, setHomeLineup] = React.useState<LineupSide>({
    positions: { P1: "", P2: "", P3: "", P4: "", P5: "", P6: "" },
    libero_id: "",
  });
  const [awayLineup, setAwayLineup] = React.useState<LineupSide>({
    positions: { P1: "", P2: "", P3: "", P4: "", P5: "", P6: "" },
    libero_id: "",
  });

  // Pobieramy zawodników na podstawie PlayerTeamHistory dla danego zespołu i sezonu
  const homePlayersUrl = `/api/backend/api/v1/player-team-history/?team_id=${match.home_team_id}&season_id=${match.season_id}&limit=100`;
  const awayPlayersUrl = `/api/backend/api/v1/player-team-history/?team_id=${match.away_team_id}&season_id=${match.season_id}&limit=100`;

  const { data: homeHistory } = useSWR(homePlayersUrl, fetcher);
  const { data: awayHistory } = useSWR(awayPlayersUrl, fetcher);

  // Do wyświetlania imion potrzebujemy też globalnej listy zawodników
  const { data: allPlayers } = useSWR("/api/backend/api/v1/player/?limit=1000", fetcher);

  // Funkcja pomocnicza budująca listę wyboru
  const getPlayerOptions = (history: any[]) => {
    if (!history || !allPlayers) return [];
    return history.map((h) => {
      const p = allPlayers.find((player: any) => player.id === h.player_id);
      return {
        id: h.player_id,
        name: p ? `${p.first_name} ${p.last_name}` : "Unknown",
        jersey: h.jersey_number,
      };
    }).sort((a, b) => (a.jersey || 99) - (b.jersey || 99));
  };

  const homeOptions = getPlayerOptions(homeHistory);
  const awayOptions = getPlayerOptions(awayHistory);

  const handleLineupChange = (
    team: "home" | "away",
    pos: RotationKey | "libero",
    playerId: string
  ) => {
    const setter = team === "home" ? setHomeLineup : setAwayLineup;
    setter((prev) => {
      if (pos === "libero") return { ...prev, libero_id: playerId === "none" ? "" : playerId };
      return { ...prev, positions: { ...prev.positions, [pos]: playerId } };
    });
  };

  const handleSubmit = async () => {
    // Prosta walidacja czy wybrano całą szóstkę (pomijamy libero, bo jest opcjonalny)
    const homeComplete = Object.values(homeLineup.positions).every(Boolean);
    const awayComplete = Object.values(awayLineup.positions).every(Boolean);

    if (!homeComplete || !awayComplete) {
      toast.error("Please fill all 6 positions for both teams.");
      return;
    }

    setIsSubmitting(true);
    try {
      const lineupPayload = {
        home: { 
          team_id: match.home_team_id, 
          positions: homeLineup.positions, // {P1: uuid, ...}
          libero_id: homeLineup.libero_id || null
        },
        away: { 
          team_id: match.away_team_id, 
          positions: awayLineup.positions,
          libero_id: awayLineup.libero_id || null
        },
        starting_server: startingServer,
      };

      // Uderzamy w nowy endpoint match_flow
      await apiCall(`/api/backend/api/v1/match/${match.id}/lineup`, "POST", lineupPayload);

      toast.success("Match started! Redirecting to coding...");
      router.push(`/live/${match.id}/coding`);
    } catch (err: any) {
      toast.error(err.message || "Failed to start match.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTeamSetup = (team: "home" | "away", options: any[], title: string) => {
    const lineup = team === "home" ? homeLineup : awayLineup;
    const positions: RotationKey[] = ["P1", "P2", "P3", "P4", "P5", "P6"];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {positions.map((pos) => (
              <div key={pos} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{pos}</Label>
                <Select value={lineup.positions[pos]} onValueChange={(val) => handleLineupChange(team, pos, val)}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.jersey ? `#${opt.jersey} ` : ""}{opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t mt-4 space-y-1">
            <Label className="text-xs text-muted-foreground">Libero (Optional)</Label>
            <Select value={lineup.libero_id || "none"} onValueChange={(val) => handleLineupChange(team, "libero", val)}>
              <SelectTrigger><SelectValue placeholder="No Libero" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Libero</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.jersey ? `#${opt.jersey} ` : ""}{opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Starting Server Selection */}
      <Card>
        <CardContent>
          <Label className="text-base font-semibold mb-4 block">First Serve</Label>
          <RadioGroup value={startingServer} onValueChange={(v: any) => setStartingServer(v)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="serve-home" />
              <Label htmlFor="serve-home">Home Team</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="away" id="serve-away" />
              <Label htmlFor="serve-away">Away Team</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {renderTeamSetup("home", homeOptions, `${homeTeamName} Lineup`)}
        {renderTeamSetup("away", awayOptions, `${awayTeamName} Lineup`)}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="gap-2">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Start Coding Set 1
        </Button>
      </div>
    </div>
  );
}