"use client";

import * as React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Loader2, CalendarDays, MapPin, Trophy, Users, Download, FileText, Image as ImageIcon, FileCode2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";

// --- FETCHER ---
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch");
  return await r.json();
};

// --- HELPERS ---
function getInitials(name: string) {
  if (!name || name === "?") return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function formatPosition(pos: string | null) {
  if (!pos) return "-";
  return pos.replace(/_/g, " ").toUpperCase();
}

// Funkcja do szukania ogólnego lidera
function getLeader(boxScore: any[], metric: string, minThreshold: number = 1) {
  if (!boxScore || boxScore.length === 0) return null;
  const sorted = [...boxScore].sort((a, b) => b[metric] - a[metric]);
  const leader = sorted[0];
  if (leader && leader[metric] >= minThreshold) {
    return leader;
  }
  return null;
}

function StatComparisonRow({
  label,
  homeVal,
  awayVal,
  unit = "",
}: {
  label: string;
  homeVal: number;
  awayVal: number;
  unit?: string;
}) {
  const total = homeVal + awayVal;
  const homePercent = total > 0 ? (homeVal / total) * 100 : 50;
  const awayPercent = total > 0 ? (awayVal / total) * 100 : 50;
  const winner = homeVal > awayVal ? "home" : awayVal > homeVal ? "away" : "draw";

  return (
    <div className="space-y-1 py-2">
      <div className="flex justify-between text-sm font-medium">
        <span className={winner === "home" ? "text-primary font-bold" : "text-muted-foreground"}>
          {homeVal}{unit}
        </span>
        <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
        <span className={winner === "away" ? "text-primary font-bold" : "text-muted-foreground"}>
          {awayVal}{unit}
        </span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-blue-600 transition-all" style={{ width: `${homePercent}%` }} />
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${awayPercent}%` }} />
      </div>
    </div>
  );
}

function BoxScoreTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="p-4 text-center text-muted-foreground">No data available</div>;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-150">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-center">Pos</TableHead>
            <TableHead className="text-right font-bold text-primary">Pts</TableHead>
            <TableHead className="text-right">Atk (K/A)</TableHead>
            <TableHead className="text-right">Eff%</TableHead>
            <TableHead className="text-right">Blk</TableHead>
            <TableHead className="text-right">Ace</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">Rec% (Perf)</TableHead>
            <TableHead className="text-right text-muted-foreground text-xs">Digs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
             <TableRow key={p.no}>
               <TableCell className="font-medium text-muted-foreground text-center">{p.no}</TableCell>
               <TableCell className="font-bold whitespace-nowrap">{p.name}</TableCell>
               <TableCell className="text-center">
                 <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-5 font-medium text-muted-foreground whitespace-nowrap bg-muted/20">
                   {p.pos}
                 </Badge>
               </TableCell>
               <TableCell className="text-right font-bold text-primary">{p.pts}</TableCell>
               <TableCell className="text-right text-muted-foreground tabular-nums">{p.atk}</TableCell>
               <TableCell
                 className={`text-right tabular-nums ${
                   p.eff !== "-" && parseFloat(p.eff) > 40 ? "text-green-600 dark:text-green-500 font-bold" : ""
                 }`}
               >
                 {p.eff}
               </TableCell>
               <TableCell className="text-right tabular-nums">{p.blk}</TableCell>
               <TableCell className="text-right tabular-nums">{p.ace}</TableCell>
               <TableCell className="text-right text-muted-foreground tabular-nums text-xs">{p.rec}</TableCell>
               <TableCell className="text-right text-muted-foreground tabular-nums text-xs">{p.dig}</TableCell>
             </TableRow>
           ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Komponent dla pojedynczego lidera z wbudowanym kolorem drużyny
function LeaderRow({ leader, title, valueStr }: { leader: any; title: string; valueStr: string }) {
  if (!leader) return null;

  const bgColors = {
    blue: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
    orange: "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400",
  };
  const badgeColors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
  };

  const colorClass = leader.colorClass as "blue" | "orange";

  return (
    <div className="flex items-center gap-4 group">
      <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full border flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${bgColors[colorClass]}`}>
        {getInitials(leader.name)}
      </div>
      <div>
        <p className="font-bold text-sm md:text-base leading-tight">{leader.name}</p>
        <p className="text-xs md:text-sm text-muted-foreground">{leader.teamCode} • {valueStr}</p>
      </div>
      <Badge className={`ml-auto shadow-sm text-[9px] md:text-xs px-2 py-0 md:py-0.5 ${badgeColors[colorClass]}`}>{title}</Badge>
    </div>
  );
}

// --- MAIN PAGE ---

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  const { data: state, error: stateError } = useSWR(matchId ? `/api/backend/api/v1/match/${matchId}/state` : null, fetcher);
  const { data: match, error: matchError } = useSWR(matchId ? `/api/backend/api/v1/match/${matchId}` : null, fetcher);
  const { data: homeTeam } = useSWR(match ? `/api/backend/api/v1/team/${match.home_team_id}` : null, fetcher);
  const { data: awayTeam } = useSWR(match ? `/api/backend/api/v1/team/${match.away_team_id}` : null, fetcher);
  const { data: arena } = useSWR(match?.arena_id ? `/api/backend/api/v1/arena/${match.arena_id}` : null, fetcher);
  const { data: report, error: reportError } = useSWR(matchId ? `/api/backend/api/v1/match/${matchId}/analytics/report` : null, fetcher);

  // Dodatkowe SWR do pobrania składów drużyn
  const homeHistoryUrl = match ? `/api/backend/api/v1/player-team-history/?team_id=${match.home_team_id}&season_id=${match.season_id}&limit=100` : null;
  const awayHistoryUrl = match ? `/api/backend/api/v1/player-team-history/?team_id=${match.away_team_id}&season_id=${match.season_id}&limit=100` : null;
  const { data: homePlayers } = useSWR<any[]>(homeHistoryUrl, fetcher);
  const { data: awayPlayers } = useSWR<any[]>(awayHistoryUrl, fetcher);

  if (stateError || matchError || reportError) {
    return <div className="p-10 text-center text-red-500">Error loading match report.</div>;
  }

  if (!state || !match || !homeTeam || !awayTeam || !report || !homePlayers || !awayPlayers) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- OBLICZANIE WYNIKÓW SETÓW ---
  const pastSets = state.past_sets || [];
  let homeTotalPoints = pastSets.reduce((acc: number, set: any) => acc + set.home_score, 0);
  let awayTotalPoints = pastSets.reduce((acc: number, set: any) => acc + set.away_score, 0);
  
  const setsToDisplay = pastSets.map((ps: any) => ({
    num: ps.set_number,
    home: ps.home_score,
    away: ps.away_score,
  }));

  if (state.home_points > 0 || state.away_points > 0) {
     setsToDisplay.push({
       num: state.set_number,
       home: state.home_points,
       away: state.away_points
     });
     homeTotalPoints += state.home_points;
     awayTotalPoints += state.away_points;
  }

  const homeCode = homeTeam.name.substring(0, 3).toUpperCase();
  const awayCode = awayTeam.name.substring(0, 3).toUpperCase();

  // --- MAPOWANIE ROSTERU DO BOX SCORE ---
  // Łączymy bazę graczy (roster) ze statystykami z raportu.
  // Dzięki temu w tabeli wylądują też zawodnicy bez ani jednej akcji (z kreskami "-").
  const mapBoxScoreWithRoster = (roster: any[], teamBoxScore: any[], teamCode: string, colorClass: "blue" | "orange") => {
    return roster.map((playerEntry) => {
      const pid = playerEntry.player_id;
      // Szukamy, czy zawodnik z rosteru zagrał cokolwiek w meczu
      const p = teamBoxScore.find(x => x.player_id === pid);
      
      const firstName = playerEntry.player?.first_name || playerEntry.first_name || "";
      const lastName = playerEntry.player?.last_name || playerEntry.last_name || "Unknown";
      const fullName = firstName ? `${firstName[0]}. ${lastName}` : lastName;
      const position = formatPosition(playerEntry.player?.playing_position || playerEntry.playing_position);

      if (p) {
         // Zawodnik GRAŁ
         return {
           no: p.jersey_number,
           name: p.name || fullName,
           pos: position,
           pts: p.points,
           atk: `${p.attack_kills}/${p.attack_attempts}`,
           eff: p.attack_attempts > 0 ? `${p.attack_efficiency}%` : "-",
           blk: p.block_kills,
           ace: p.serve_aces,
           rec: p.reception_attempts > 0 ? `${p.reception_perf_pct}%` : "-",
           dig: p.dig_success,
           _rawPts: p.points,
           _rawBlk: p.block_kills,
           _rawAce: p.serve_aces,
           _rawRecPct: p.reception_perf_pct,
           _rawDigs: p.dig_success,
           teamCode,
           colorClass
         };
      } else {
         // Zawodnik NIE GRAŁ (lub grał, ale bez żadnej statystycznej akcji)
         return {
           no: playerEntry.jersey_number,
           name: fullName,
           pos: position,
           pts: "-", atk: "-", eff: "-", blk: "-", ace: "-", rec: "-", dig: "-",
           _rawPts: 0, _rawBlk: 0, _rawAce: 0, _rawRecPct: 0, _rawDigs: 0,
           teamCode,
           colorClass
         };
      }
    }).sort((a, b) => a.no - b.no); // Sortujemy po koszulce rosnąco
  };

  const boxScoreHome = mapBoxScoreWithRoster(homePlayers, report.home_box_score, homeCode, "blue");
  const boxScoreAway = mapBoxScoreWithRoster(awayPlayers, report.away_box_score, awayCode, "orange");

  // Łączymy obie tabele by móc znaleźć globalnych liderów meczu
  const allBoxScores = [...boxScoreHome, ...boxScoreAway];

  // Wyszukiwanie Globalnych Liderów całego meczu
  const overallScorer = getLeader(allBoxScores, '_rawPts', 1);
  const overallBlocker = getLeader(allBoxScores, '_rawBlk', 1);
  const overallServer = getLeader(allBoxScores, '_rawAce', 1);
  const overallReceiver = getLeader(allBoxScores, '_rawRecPct', 10); // Minimum 10%
  const overallDefender = getLeader(allBoxScores, '_rawDigs', 1);

  const MATCH_DETAILS = {
    id: match.id,
    date: match.date ? new Date(match.date).toLocaleDateString() : "Unknown Date",
    time: match.time || "TBD",
    location: arena ? `${arena.name}, ${arena.country_code}` : "Unknown Venue",
    home: {
      name: homeTeam.name,
      code: homeCode,
      sets: state.home_sets,
      score: homeTotalPoints,
      stats: { 
        attack: report.home_team_stats.attack_eff, 
        block: report.home_team_stats.kill_blocks, 
        ace: report.home_team_stats.aces, 
        reception: report.home_team_stats.reception_pos, 
        errors: report.home_team_stats.total_errors 
      },
    },
    away: {
      name: awayTeam.name,
      code: awayCode,
      sets: state.away_sets,
      score: awayTotalPoints,
      stats: { 
        attack: report.away_team_stats.attack_eff, 
        block: report.away_team_stats.kill_blocks, 
        ace: report.away_team_stats.aces, 
        reception: report.away_team_stats.reception_pos, 
        errors: report.away_team_stats.total_errors 
      },
    },
    sets: setsToDisplay,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Match Report"
        description="Detailed statistics and information about the match."
        breadcrumbs={[{ label: "Matches", href: "/matches" }, { label: "Match" }]}
      />
      {/* 1. MATCH HEADER */}
      <Card className="overflow-hidden py-6 border-2 shadow-sm bg-linear-to-br from-card to-muted/30">
        <CardContent className="px-4">
          
          <div className="flex flex-wrap items-center justify-center md:justify-between text-xs md:text-sm text-muted-foreground mb-8 gap-4">
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border shadow-sm">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="font-medium">{MATCH_DETAILS.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border shadow-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{MATCH_DETAILS.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center gap-2 md:gap-8">
            <div className="text-right flex flex-col items-end justify-center">
              <h2 className="text-lg md:text-3xl lg:text-4xl font-black tracking-tight text-blue-600 dark:text-blue-400 leading-tight">
                {MATCH_DETAILS.home.name}
              </h2>
              <p className="text-muted-foreground font-semibold text-xs md:text-lg mt-1 uppercase tracking-widest">Home</p>
            </div>

            <div className="flex flex-col items-center justify-center px-2 py-4 md:px-6 md:py-6 bg-background/80 backdrop-blur-sm rounded-2xl border shadow-md">
              <div className="text-4xl md:text-7xl font-black tracking-tighter flex items-center gap-2 md:gap-4 leading-none">
                <span className={MATCH_DETAILS.home.sets > MATCH_DETAILS.away.sets ? "text-foreground" : "text-muted-foreground"}>
                  {MATCH_DETAILS.home.sets}
                </span>
                <span className="text-muted-foreground/30 mb-2 md:mb-4">:</span>
                <span className={MATCH_DETAILS.away.sets > MATCH_DETAILS.home.sets ? "text-foreground" : "text-muted-foreground"}>
                  {MATCH_DETAILS.away.sets}
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 text-xs md:text-sm font-medium">
                {MATCH_DETAILS.sets.length > 0 ? (
                  MATCH_DETAILS.sets.map((set: any) => (
                    <div key={set.num} className="flex flex-col items-center bg-muted/50 px-2 py-1 rounded">
                      <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground/70 mb-0.5">S{set.num}</span>
                      <span
                        className={
                          set.home > set.away
                            ? "text-blue-600 dark:text-blue-400 font-black tabular-nums"
                            : "text-orange-500 font-black tabular-nums"
                        }
                      >
                        {set.home}:{set.away}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs uppercase">No sets played</span>
                )}
              </div>
            </div>

            <div className="text-left flex flex-col items-start justify-center">
              <h2 className="text-lg md:text-3xl lg:text-4xl font-black tracking-tight text-orange-500 leading-tight">
                {MATCH_DETAILS.away.name}
              </h2>
              <p className="text-muted-foreground font-semibold text-xs md:text-lg mt-1 uppercase tracking-widest">Away</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. TABS & CONTENT */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-center md:justify-start mb-6">
          <TabsList className="grid w-full grid-cols-3 md:w-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="boxscore">Box Score</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
        </div>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4 outline-none">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* STATS */}
            <Card className="lg:col-span-4 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>Team Comparison</CardTitle>
                <CardDescription>
                  <span className="text-blue-600 font-bold">Home</span> vs{" "}
                  <span className="text-orange-500 font-bold">Away</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatComparisonRow label="Attack Efficiency" homeVal={MATCH_DETAILS.home.stats.attack} awayVal={MATCH_DETAILS.away.stats.attack} unit="%" />
                <StatComparisonRow label="Kill Blocks" homeVal={MATCH_DETAILS.home.stats.block} awayVal={MATCH_DETAILS.away.stats.block} />
                <StatComparisonRow label="Service Aces" homeVal={MATCH_DETAILS.home.stats.ace} awayVal={MATCH_DETAILS.away.stats.ace} />
                <StatComparisonRow label="Reception Positive" homeVal={MATCH_DETAILS.home.stats.reception} awayVal={MATCH_DETAILS.away.stats.reception} unit="%" />
                <StatComparisonRow label="Total Errors" homeVal={MATCH_DETAILS.home.stats.errors} awayVal={MATCH_DETAILS.away.stats.errors} />
              </CardContent>
            </Card>

            {/* LEADERS - TYLKO OGÓLNI Z CAŁEGO MECZU */}
            <Card className="lg:col-span-3 shadow-sm flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Match Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-5 flex flex-col justify-between h-full pb-2">
                  
                  <LeaderRow leader={overallScorer} title="Top Scorer" valueStr={`${overallScorer?._rawPts} Pts`} />
                  <Separator />
                  
                  <LeaderRow leader={overallBlocker} title="Top Blocker" valueStr={`${overallBlocker?._rawBlk} Blks`} />
                  <Separator />

                  <LeaderRow leader={overallServer} title="Top Server" valueStr={`${overallServer?._rawAce} Aces`} />
                  <Separator />

                  <LeaderRow leader={overallReceiver} title="Top Receiver" valueStr={`${overallReceiver?._rawRecPct}% Perf`} />
                  <Separator />
                    
                  <LeaderRow leader={overallDefender} title="Top Defender" valueStr={`${overallDefender?._rawDigs} Digs`} />

                  {!overallScorer && !overallBlocker && !overallServer && (
                     <div className="text-center text-muted-foreground text-sm py-8">Not enough data to determine leaders.</div>
                  )}

                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* BOX SCORE TAB */}
        <TabsContent value="boxscore" className="space-y-6 outline-none">
          <Card className="shadow-sm border-t-4 border-t-blue-600">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{MATCH_DETAILS.home.name}</CardTitle>
                  <CardDescription>Player Statistics</CardDescription>
                </div>
                <Users className="h-5 w-5 text-blue-600/50" />
              </div>
            </CardHeader>
            <CardContent>
              <BoxScoreTable data={boxScoreHome} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-t-4 border-t-orange-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{MATCH_DETAILS.away.name}</CardTitle>
                  <CardDescription>Player Statistics</CardDescription>
                </div>
                <Users className="h-5 w-5 text-orange-500/50" />
              </div>
            </CardHeader>
            <CardContent>
              <BoxScoreTable data={boxScoreAway} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPORT TAB */}
        <TabsContent value="export" className="outline-none">
           <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-muted-foreground" />
                Export Match Data
              </CardTitle>
              <CardDescription>
                Download the full match report in your preferred format. (Coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2 bg-muted/30" disabled>
                  <FileText className="h-8 w-8 text-red-500" />
                  PDF Report
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2 bg-muted/30" disabled>
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                  PNG Graphic
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2 bg-muted/30" disabled>
                  <FileCode2 className="h-8 w-8 text-orange-500" />
                  HTML File
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2 bg-muted/30" disabled>
                  <FileText className="h-8 w-8 text-green-500" />
                  Markdown
                </Button>
              </div>
            </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}