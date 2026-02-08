import { notFound } from "next/navigation";
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
import { Progress } from "@/components/ui/progress";
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";

// --- MOCK DATA (W przyszłości z API na podstawie matchId) ---

const MATCH_DETAILS = {
  id: "m-1024",
  date: "Feb 14, 2025",
  time: "17:30",
  location: "Azoty Arena, Kędzierzyn-Koźle",
  attendance: 3200,
  duration: "1h 54m",
  home: {
    name: "ZAKSA Kędzierzyn-Koźle",
    code: "ZAK",
    sets: 3,
    score: 94, // suma małych punktów
    stats: { attack: 54, block: 12, ace: 6, reception: 48, errors: 22 },
  },
  away: {
    name: "Jastrzębski Węgiel",
    code: "JAS",
    sets: 1,
    score: 87,
    stats: { attack: 45, block: 8, ace: 4, reception: 52, errors: 28 },
  },
  sets: [
    { num: 1, home: 25, away: 21 },
    { num: 2, home: 25, away: 23 },
    { num: 3, home: 19, away: 25 },
    { num: 4, home: 25, away: 18 },
  ],
};

const BOX_SCORE_HOME = [
  { no: 5, name: "Kaczmarek L.", pos: "OP", pts: 22, atk: "18/35", eff: "42%", blk: 3, ace: 1 },
  { no: 11, name: "Śliwka A.", pos: "OH", pts: 14, atk: "11/24", eff: "38%", blk: 2, ace: 1 },
  { no: 15, name: "Smith D.", pos: "MB", pts: 9, atk: "6/9", eff: "66%", blk: 3, ace: 0 },
  { no: 99, name: "Bednorz B.", pos: "OH", pts: 18, atk: "15/28", eff: "46%", blk: 1, ace: 2 },
  // ... reszta składu
];

const BOX_SCORE_AWAY = [
  { no: 4, name: "Toniutti B.", pos: "S", pts: 1, atk: "0/1", eff: "0%", blk: 1, ace: 0 },
  { no: 6, name: "Fornal T.", pos: "OH", pts: 16, atk: "13/30", eff: "33%", blk: 1, ace: 2 },
  { no: 21, name: "Boyer S.", pos: "OP", pts: 19, atk: "17/40", eff: "35%", blk: 1, ace: 1 },
  { no: 13, name: "Gladyr Y.", pos: "MB", pts: 7, atk: "5/8", eff: "50%", blk: 2, ace: 0 },
  // ... reszta składu
];

// --- COMPONENTS ---

// Komponent paska porównania (Team A vs Team B)
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
          {homeVal}
          {unit}
        </span>
        <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
        <span className={winner === "away" ? "text-primary font-bold" : "text-muted-foreground"}>
          {awayVal}
          {unit}
        </span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-blue-600" style={{ width: `${homePercent}%` }} />
        <div className="h-full bg-orange-500" style={{ width: `${awayPercent}%` }} />
      </div>
    </div>
  );
}

// Tabela zawodników
function BoxScoreTable({ data }: { data: typeof BOX_SCORE_HOME }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-center">Pos</TableHead>
            <TableHead className="text-right font-bold">Pts</TableHead>
            <TableHead className="text-right">Atk (K/A)</TableHead>
            <TableHead className="text-right">Eff%</TableHead>
            <TableHead className="text-right">Blk</TableHead>
            <TableHead className="text-right">Ace</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.no}>
              <TableCell className="font-medium text-muted-foreground">{p.no}</TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">{p.pos}</TableCell>
              <TableCell className="text-right font-bold">{p.pts}</TableCell>
              <TableCell className="text-right text-muted-foreground">{p.atk}</TableCell>
              <TableCell
                className={`text-right ${
                  parseInt(p.eff) > 40 ? "text-green-600 dark:text-green-500 font-medium" : ""
                }`}
              >
                {p.eff}
              </TableCell>
              <TableCell className="text-right">{p.blk}</TableCell>
              <TableCell className="text-right">{p.ace}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- MAIN PAGE ---

interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default async function MatchDetailsPage({ params }: PageProps) {
  const { matchId } = await params;

  // Tutaj normalnie byłby fetch(matchId)
  if (matchId === "invalid") return notFound();

  return (
    <div className="space-y-6 pb-10">
      {/* 1. MATCH HEADER */}
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/20">
        <CardContent className="p-6 md:p-10">
          {/* Meta Info */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground mb-8 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>
                {MATCH_DETAILS.date} • {MATCH_DETAILS.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{MATCH_DETAILS.location}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {MATCH_DETAILS.duration}
            </Badge>
          </div>

          {/* Scoreboard */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Home Team */}
            <div className="text-center md:text-right flex-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                {MATCH_DETAILS.home.name}
              </h2>
              <p className="text-muted-foreground font-medium text-lg mt-1">Home</p>
            </div>

            {/* The Score */}
            <div className="flex flex-col items-center px-6 py-4 bg-background/50 rounded-xl border shadow-sm">
              <div className="text-5xl md:text-6xl font-black tracking-tighter flex gap-4">
                <span className={MATCH_DETAILS.home.sets > MATCH_DETAILS.away.sets ? "text-foreground" : "text-muted-foreground"}>
                  {MATCH_DETAILS.home.sets}
                </span>
                <span className="text-muted-foreground/30">:</span>
                <span className={MATCH_DETAILS.away.sets > MATCH_DETAILS.home.sets ? "text-foreground" : "text-muted-foreground"}>
                  {MATCH_DETAILS.away.sets}
                </span>
              </div>
              {/* Set Scores */}
              <div className="flex gap-3 mt-4 text-sm font-medium text-muted-foreground">
                {MATCH_DETAILS.sets.map((set) => (
                  <div key={set.num} className="flex flex-col items-center">
                    <span className="text-[10px] uppercase opacity-50">S{set.num}</span>
                    <span
                      className={
                        set.home > set.away
                          ? "text-blue-600 dark:text-blue-400 font-bold"
                          : "text-orange-500 font-bold"
                      }
                    >
                      {set.home}-{set.away}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-orange-500">
                {MATCH_DETAILS.away.name}
              </h2>
              <p className="text-muted-foreground font-medium text-lg mt-1">Away</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. TABS & CONTENT */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-center md:justify-start mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="boxscore">Box Score</TabsTrigger>
            <TabsTrigger value="playbyplay" disabled>Play-by-Play</TabsTrigger>
          </TabsList>
        </div>

        {/* --- TAB: OVERVIEW --- */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            
            {/* Team Stats Comparison */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Team Comparison</CardTitle>
                <CardDescription>
                  <span className="text-blue-600 font-bold">Blue</span> (Home) vs{" "}
                  <span className="text-orange-500 font-bold">Orange</span> (Away)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <StatComparisonRow
                  label="Attack Efficiency"
                  homeVal={MATCH_DETAILS.home.stats.attack}
                  awayVal={MATCH_DETAILS.away.stats.attack}
                  unit="%"
                />
                <StatComparisonRow
                  label="Kill Blocks"
                  homeVal={MATCH_DETAILS.home.stats.block}
                  awayVal={MATCH_DETAILS.away.stats.block}
                />
                <StatComparisonRow
                  label="Service Aces"
                  homeVal={MATCH_DETAILS.home.stats.ace}
                  awayVal={MATCH_DETAILS.away.stats.ace}
                />
                <StatComparisonRow
                  label="Reception Positive"
                  homeVal={MATCH_DETAILS.home.stats.reception}
                  awayVal={MATCH_DETAILS.away.stats.reception}
                  unit="%"
                />
                <StatComparisonRow
                  label="Total Errors"
                  homeVal={MATCH_DETAILS.home.stats.errors}
                  awayVal={MATCH_DETAILS.away.stats.errors}
                />
              </CardContent>
            </Card>

            {/* MVP / Top Scorer Highlight */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Match Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Top Scorer Home */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                      LK
                    </div>
                    <div>
                      <p className="font-medium">Łukasz Kaczmarek</p>
                      <p className="text-sm text-muted-foreground">ZAKSA • 22 Points</p>
                    </div>
                    <Badge className="ml-auto bg-blue-600">Top Scorer</Badge>
                  </div>
                  
                  <Separator />

                  {/* Top Scorer Away */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-700 dark:text-orange-300 font-bold">
                      SB
                    </div>
                    <div>
                      <p className="font-medium">Stephen Boyer</p>
                      <p className="text-sm text-muted-foreground">Jastrzębski • 19 Points</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: BOX SCORE --- */}
        <TabsContent value="boxscore" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-blue-600">{MATCH_DETAILS.home.name}</CardTitle>
                  <CardDescription>Player Statistics</CardDescription>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <BoxScoreTable data={BOX_SCORE_HOME} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-orange-500">{MATCH_DETAILS.away.name}</CardTitle>
                  <CardDescription>Player Statistics</CardDescription>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <BoxScoreTable data={BOX_SCORE_AWAY} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}