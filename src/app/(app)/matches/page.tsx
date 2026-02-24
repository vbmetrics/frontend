"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  BarChart2, 
  Activity, 
  ShieldAlert, 
  Zap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MonitorPlay
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// --- FETCHER ---
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch");
  return await r.json();
};

// --- KOMPONENT POJEDYNCZEJ KARTY MECZU ---
// Wydzielenie karty pozwala na niezależne doczytanie detali dla każdego meczu
function MatchCard({ match }: { match: any }) {
  // Pobieramy nazwy drużyn
  const { data: homeTeam } = useSWR(`/api/backend/api/v1/team/${match.home_team_id}`, fetcher);
  const { data: awayTeam } = useSWR(`/api/backend/api/v1/team/${match.away_team_id}`, fetcher);
  
  // Pobieramy stan meczu (wynik)
  const { data: state } = useSWR(`/api/backend/api/v1/match/${match.id}/state`, fetcher);
  
  // Pobieramy statystyki (jeśli jest błąd, np. brak akcji, po prostu je zignorujemy)
  const { data: report } = useSWR(`/api/backend/api/v1/match/${match.id}/analytics/report`, fetcher, {
    shouldRetryOnError: false 
  });

  const isFinished = match.winner_team_id !== null;

  // Nazwy drużyn z fallbackiem do ładowania
  const homeName = homeTeam?.name || "Loading...";
  const awayName = awayTeam?.name || "Loading...";

  // Wynik ogólny w setach
  const scoreStr = state ? `${state.home_sets} : ${state.away_sets}` : "- : -";

  // Zbieranie małych punktów (wyników setów)
  const pastSets = state?.past_sets || [];
  const setsStrs = pastSets.map((s: any) => `${s.home_score}-${s.away_score}`);
  if (state && (state.home_points > 0 || state.away_points > 0)) {
    setsStrs.push(`${state.home_points}-${state.away_points}`);
  }
  const setsDisplay = setsStrs.length > 0 ? `${setsStrs.join(" | ")}` : "";

  // Określenie zwycięzcy do pogrubienia czcionki
  let winnerSide = null;
  if (isFinished) {
    winnerSide = match.winner_team_id === match.home_team_id ? "home" : "away";
  }

  // Obliczenia statystyk do stopki (sumujemy z obu drużyn lub pokazujemy najwyższą)
  const stats = {
    blocks: report ? report.home_team_stats.kill_blocks + report.away_team_stats.kill_blocks : 0,
    aces: report ? report.home_team_stats.aces + report.away_team_stats.aces : 0,
    // Dla skuteczności ataku pokażemy po prostu skuteczność lepszej drużyny
    attackEff: report ? Math.max(report.home_team_stats.attack_eff, report.away_team_stats.attack_eff) : 0,
  };

  // Konfiguracja przycisku i badge'a zaleznie od statusu
  const badgeText = isFinished ? "FINISHED" : "LIVE MODE";
  const badgeVariant = isFinished ? "secondary" : "destructive";
  
  const btnText = isFinished ? "Full Report" : "Coding";
  const btnHref = isFinished ? `/matches/${match.id}` : `/live/${match.id}/coding`;
  const BtnIcon = isFinished ? BarChart2 : MonitorPlay;

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 flex flex-col py-0">
      <CardHeader className="bg-muted pt-4 pb-2 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <CalendarDays className="h-4 w-4" />
            <span>
              {match.match_date ? new Date(match.match_date).toLocaleDateString() : "TBD"}
            </span>
          </div>
          <Badge variant={badgeVariant} className={!isFinished ? "animate-pulse" : ""}>
            {badgeText}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-4 flex-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-1 w-full items-center justify-between gap-2 md:gap-4">
            
            {/* Home Team */}
            <div className={`flex-1 text-right truncate ${winnerSide === 'home' ? 'font-black text-foreground' : 'font-semibold text-muted-foreground'}`}>
              <span className="text-sm md:text-xl" title={homeName}>{homeName}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-2 md:px-4 min-w-25">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-primary whitespace-nowrap">
                {scoreStr}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground mt-1 tabular-nums font-medium text-center">
                {setsDisplay || "(0-0)"}
              </span>
            </div>

            {/* Away Team */}
            <div className={`flex-1 text-left truncate ${winnerSide === 'away' ? 'font-black text-foreground' : 'font-semibold text-muted-foreground'}`}>
              <span className="text-sm md:text-xl" title={awayName}>{awayName}</span>
            </div>
            
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/10 pb-4 px-6 mt-auto">
        
        {/* Statystyki Meczu (agregacja) */}
        <div className="flex w-full sm:w-auto items-center justify-around gap-4 md:gap-8 sm:justify-start">
          <div className="flex items-center gap-2" title="Best Team Attack Efficiency">
            <Activity className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Top Atk</span>
              <span className="text-sm font-bold tabular-nums">{stats.attackEff}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2" title="Total Match Blocks">
            <ShieldAlert className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Match Blks</span>
              <span className="text-sm font-bold tabular-nums">{stats.blocks}</span>
            </div>
          </div>

          <div className="flex items-center gap-2" title="Total Match Aces">
            <Zap className="h-4 w-4 text-yellow-500" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Match Aces</span>
              <span className="text-sm font-bold tabular-nums">{stats.aces}</span>
            </div>
          </div>
        </div>

        {/* Dynamiczny Przycisk */}
        <Link href={btnHref} className="w-full sm:w-auto">
          <Button 
            className="w-full gap-2 group transition-all" 
            variant={isFinished ? "default" : "secondary"}
          >
            <BtnIcon className="h-4 w-4" />
            {btnText}
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// --- MAIN PAGE (Z PAGINACJĄ) ---

export default function MatchesPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const skip = (page - 1) * limit;

  // Pobieramy mecze z backendu (zastosowanie limitu i przesunięcia do paginacji)
  const { data: matches, error } = useSWR(
    `/api/backend/api/v1/match/?skip=${skip}&limit=${limit}`, 
    fetcher
  );

  if (error) return <div className="p-10 text-center text-red-500">Failed to load matches.</div>;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Matches"
        description="Overview of all games, live coding sessions, and analytical reports."
        breadcrumbs={[{ label: "Matches" }]}
      />

      {/* Lista meczów */}
      <div className="grid gap-6">
        {!matches ? (
           <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </div>
        ) : matches.length === 0 ? (
           <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
             No matches found on this page.
           </div>
        ) : (
          matches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>

      {/* Kontrolki Paginacji */}
      {matches && (
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {page}
          </span>
          <Button
            variant="outline"
            // Jeśli przyszło mniej meczów niż limit, to znaczy, że jesteśmy na ostatniej stronie
            disabled={matches.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}