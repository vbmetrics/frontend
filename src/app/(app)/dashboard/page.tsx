"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import { 
  CalendarClock, 
  BarChart3, 
  Play, 
  Users, 
  Trophy, 
  ShieldAlert, 
  Zap, 
  Crosshair,
  Loader2
} from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- IMPORT ZUSTAND STORES ---
import { useTeamStore } from "@/stores/useTeamStore";
import { useSeasonStore } from "@/stores/useSeasonStore";
import { Separator } from "@/components/ui/separator";

// --- FETCHER ---
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch");
  return await r.json();
};

function getInitials(name: string) {
  if (!name || name === "?") return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

export default function DashboardPage() {
  // 1. ZCZYTANIE GLOBALNYCH FILTRÓW Z SIDEBARA
  const { selectedTeam } = useTeamStore();
  const { selectedSeasonIds } = useSeasonStore();

  const selectedTeamId = selectedTeam?.id || null;
  // Bierzemy pierwszy sezon do historii zespołu (aby Active Players pokazywało 1 sezon na raz).
  // Gdybyś chciał obsługiwać wiele sezonów naraz, API historii musiałoby akceptować listę.
  const primarySeasonId = selectedSeasonIds.length > 0 ? selectedSeasonIds[0] : null;

  // Budowanie query params
  const queryParams = new URLSearchParams();
  if (selectedTeamId) queryParams.append("team_id", selectedTeamId);
  // Jeśli Twoje API obsługuje wiele sezonów naraz w `/match`, użyj pętli. My wrzucamy pierwszy dla bezpieczeństwa
  if (primarySeasonId) queryParams.append("season_id", primarySeasonId); 
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  // 2. POBIERANIE DANYCH
  const { data: matches, isLoading: matchesLoading } = useSWR(`/api/backend/api/v1/match/${queryString}`, fetcher);
  
  const { data: teamsDict } = useSWR(`/api/backend/api/v1/team/?limit=100`, fetcher);
  
  // Endpoint statystyczny dla Dashboardu (Ten z nowego backendu)
  const { data: dashboardStats, isLoading: statsLoading } = useSWR(
    selectedTeamId ? `/api/backend/api/v1/dashboard/stats${queryString}` : null, 
    fetcher, 
    { shouldRetryOnError: false } 
  );

  // Pobieranie Active Players na podstawie filtrów z Sidebaru
  const { data: playersHistory } = useSWR(
    selectedTeamId ? `/api/backend/api/v1/player-team-history/?team_id=${selectedTeamId}${primarySeasonId ? `&season_id=${primarySeasonId}` : ''}&limit=100` : null,
    fetcher
  );

  // --- OBLICZENIA DANYCH DO UI ---
  const recentMatches = matches ? matches.slice(0, 5) : [];

  const getTeamName = (id: string) => {
    if (!teamsDict) return "...";
    const t = teamsDict.find((x: any) => x.id === id);
    return t ? t.name : "Unknown";
  };

  // KPI: Win Rate (ostatnie 10 meczów)
  let winRateStr = "-";
  if (selectedTeamId && matches) {
    const last10 = matches.slice(0, 10);
    const wins = last10.filter((m: any) => m.winner_team_id === selectedTeamId).length;
    winRateStr = last10.length > 0 ? `${Math.round((wins / last10.length) * 100)}%` : "0%";
  }

  const activePlayersCount = playersHistory ? playersHistory.length : 0;

  const sideoutPct = dashboardStats?.team_stats?.sideout_pct ? `${dashboardStats.team_stats.sideout_pct}%` : "-";
  const breakPointPct = dashboardStats?.team_stats?.breakpoint_pct ? `${dashboardStats.team_stats.breakpoint_pct}%` : "-";
  
  const bestScorer = dashboardStats?.best_players?.scorer;
  const bestBlocker = dashboardStats?.best_players?.blocker;
  const bestServer = dashboardStats?.best_players?.server;
  const bestReceiver = dashboardStats?.best_players?.receiver;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of performance, latest matches, and top statistics."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Create Report</Button>
          </div>
        }
      />

      {/* KPI cards - WIDOCZNE TYLKO GDY WYBRANO ZESPÓŁ W SIDEBARZE */}
      {selectedTeamId && (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRateStr}</div>
              <p className="text-xs text-muted-foreground">Last 10 matches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Side-Out %</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sideoutPct}</div>
              <p className="text-xs text-muted-foreground">Won on Serve-Receive</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Break Point %</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{breakPointPct}</div>
              <p className="text-xs text-muted-foreground">Points won on serve</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlayersCount}</div>
              <p className="text-xs text-muted-foreground">Assigned to roster</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Two-column: recent matches + right rail */}
      <section className="grid gap-4 lg:grid-cols-7">
        
        {/* Recent matches (table) */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Recent Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchesLoading || !teamsDict ? (
              <div className="flex py-10 justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : recentMatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {selectedTeamId ? "No recent matches found for this team." : "No matches found in database."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-27.5">Date</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMatches.map((m: any) => {
                    const isFinished = m.winner_team_id !== null;
                    const homeTeamName = getTeamName(m.home_team_id);
                    const awayTeamName = getTeamName(m.away_team_id);
                    
                    const isHomeUs = selectedTeamId === m.home_team_id;
                    const isAwayUs = selectedTeamId === m.away_team_id;

                    return (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium text-muted-foreground">
                          {m.match_date ? new Date(m.match_date).toLocaleDateString() : "TBD"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className={isHomeUs ? "font-bold text-primary" : ""}>{homeTeamName}</span>
                            <span className="text-muted-foreground px-1">vs</span>
                            <span className={isAwayUs ? "font-bold text-primary" : ""}>{awayTeamName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={isFinished ? "secondary" : "destructive"}>
                            {isFinished ? "FINISHED" : "LIVE"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-4 flex justify-end">
              <Link href="/matches">
                <Button variant="link" size="sm" className="text-muted-foreground">View all matches →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right rail: quick start + Best Players */}
        <div className="grid gap-4 lg:col-span-3">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Quick start
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Link href="/live">
                <Button size="sm">New Match</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="sm">Analytics</Button>
              </Link>
              <Link href="/data">
                <Button variant="outline" size="sm">Manage Data</Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="sm">Read Docs</Button>
              </Link>
            </CardContent>
          </Card>

          {/* BEST PLAYERS CARD */}
          <Card className="overflow-hidden bg-linear-to-br from-card to-muted/20 border-2">
            <CardContent className="p-4 space-y-4">
              
              {!selectedTeamId ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Select a team in the sidebar to view top players.
                </div>
              ) : statsLoading ? (
                 <div className="flex py-10 justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : (
                <>
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {getInitials(bestScorer?.name || "?")}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" /> Best Scorer
                        </p>
                        <p className="font-bold text-sm">{bestScorer?.name || "No Data"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-primary">{bestScorer?.value || 0}</span>
                      <span className="text-xs text-muted-foreground ml-1">Pts</span>
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                        {getInitials(bestBlocker?.name || "?")}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3 text-emerald-500" /> Best Blocker
                        </p>
                        <p className="font-bold text-sm">{bestBlocker?.name || "No Data"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-primary">{bestBlocker?.value || 0}</span>
                      <span className="text-xs text-muted-foreground ml-1">Blks</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                        {getInitials(bestServer?.name || "?")}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Zap className="h-3 w-3 text-orange-500" /> Best Server
                        </p>
                        <p className="font-bold text-sm">{bestServer?.name || "No Data"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-primary">{bestServer?.value || 0}</span>
                      <span className="text-xs text-muted-foreground ml-1">Aces</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                        {getInitials(bestReceiver?.name || "?")}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5 flex items-center gap-1">
                          <Crosshair className="h-3 w-3 text-purple-500" /> Best Receiver
                        </p>
                        <p className="font-bold text-sm">{bestReceiver?.name || "No Data"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-primary">{bestReceiver?.value || 0}</span>
                      <span className="text-xs text-muted-foreground ml-1">%</span>
                    </div>
                  </div>
                </>
              )}
              
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}