import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Trophy, 
  BarChart2, 
  Activity, 
  ShieldAlert, 
  Zap 
} from "lucide-react";

// Przykładowe dane (Mock Data) - w przyszłości pobierane z API
const MATCHES_DATA = [
  {
    id: "m-1024",
    date: "2025-02-14",
    time: "17:30",
    home: "ZAKSA Kędzierzyn-Koźle",
    away: "Jastrzębski Węgiel",
    score: "3 : 1",
    sets: ["25-21", "25-23", "19-25", "25-18"],
    status: "Finished",
    stats: {
      attackEff: 54, // %
      blocks: 12,
      aces: 6,
    },
    winner: "home",
  },
  {
    id: "m-1025",
    date: "2025-02-11",
    time: "20:30",
    home: "Asseco Resovia",
    away: "Aluron CMC Warta",
    score: "2 : 3",
    sets: ["22-25", "25-18", "25-20", "20-25", "13-15"],
    status: "Finished",
    stats: {
      attackEff: 48,
      blocks: 9,
      aces: 8,
    },
    winner: "away",
  },
  {
    id: "m-1026",
    date: "2025-02-08",
    time: "14:45",
    home: "Projekt Warszawa",
    away: "Trefl Gdańsk",
    score: "3 : 0",
    sets: ["25-15", "25-19", "25-20"],
    status: "Finished",
    stats: {
      attackEff: 61,
      blocks: 14,
      aces: 4,
    },
    winner: "home",
  },
];

export default function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Recent Matches</h1>
        <p className="text-muted-foreground">
          Overview of the latest games with key performance indicators.
        </p>
      </div>

      <div className="grid gap-6">
        {MATCHES_DATA.map((match) => (
          <Card key={match.id} className="overflow-hidden transition-all hover:border-primary/50">
            <CardHeader className="bg-muted/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {match.date} &bull; {match.time}
                  </span>
                </div>
                <Badge variant={match.status === "Finished" ? "secondary" : "default"}>
                  {match.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Zespoły i Wynik */}
                <div className="flex flex-1 w-full items-center justify-between gap-4">
                  {/* Home Team */}
                  <div className={`flex-1 text-right ${match.winner === 'home' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="text-lg md:text-xl">{match.home}</span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center px-4">
                    <span className="text-4xl font-black tracking-tighter text-primary">
                      {match.score}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 tabular-nums">
                      ({match.sets.join(", ")})
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className={`flex-1 text-left ${match.winner === 'away' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="text-lg md:text-xl">{match.away}</span>
                  </div>
                </div>

              </div>
            </CardContent>

            {/* Szybkie statystyki i Przycisk */}
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/10 pt-4">
              
              {/* Sekcja Mini-Statystyk (Atak, Blok, Serwis) */}
              <div className="flex w-full sm:w-auto items-center justify-around gap-6 sm:justify-start">
                <div className="flex items-center gap-2" title="Team Attack Efficiency">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Attack</span>
                    <span className="text-sm font-bold">{match.stats.attackEff}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2" title="Total Blocks">
                  <ShieldAlert className="h-4 w-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Blocks</span>
                    <span className="text-sm font-bold">{match.stats.blocks}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2" title="Total Aces">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Aces</span>
                    <span className="text-sm font-bold">{match.stats.aces}</span>
                  </div>
                </div>
              </div>

              {/* Przycisk przejścia do raportu */}
              <Link href={`/matches/${match.id}`} className="w-full sm:w-auto">
                <Button className="w-full gap-2 group">
                  <BarChart2 className="h-4 w-4" />
                  Full Report
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}