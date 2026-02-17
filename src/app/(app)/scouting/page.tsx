"use client"; // <--- 1. WYMAGANE DLA useRouter

import { useRouter } from "next/navigation"; // <--- 2. IMPORT HOOKA
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  ShieldAlert,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// --- TYPES & MOCK DATA (Bez zmian) ---

type PlayerTrend = "up" | "down" | "stable";

interface ScoutingProfile {
  id: string;
  rank: number;
  name: string;
  team: string;
  position: "OH" | "OP" | "MB" | "S" | "L";
  age: number;
  height: number;
  spikeReach: number;
  contractExp: string;
  mainStatValue: number;
  mainStatLabel: string;
  efficiency: number;
  trend: PlayerTrend;
}

const SCORERS_DATA: ScoutingProfile[] = [
  {
    id: "p-1", // To ID musi pasować do ścieżki /players/[id]
    rank: 1,
    name: "Wilfredo Leon",
    team: "Bogdanka LUK Lublin",
    position: "OH",
    age: 31,
    height: 201,
    spikeReach: 370,
    contractExp: "2026",
    mainStatValue: 428,
    mainStatLabel: "PTS",
    efficiency: 54,
    trend: "up",
  },
  {
    id: "p-2",
    rank: 2,
    name: "Stephen Boyer",
    team: "Asseco Resovia",
    position: "OP",
    age: 28,
    height: 196,
    spikeReach: 355,
    contractExp: "2025",
    mainStatValue: 395,
    mainStatLabel: "PTS",
    efficiency: 49,
    trend: "stable",
  },
  {
    id: "p-3",
    rank: 3,
    name: "Tomasz Fornal",
    team: "Jastrzębski Węgiel",
    position: "OH",
    age: 27,
    height: 200,
    spikeReach: 345,
    contractExp: "2027",
    mainStatValue: 312,
    mainStatLabel: "PTS",
    efficiency: 51,
    trend: "up",
  },
];

const BLOCKERS_DATA: ScoutingProfile[] = [
  {
    id: "p-5",
    rank: 1,
    name: "Norbert Huber",
    team: "Jastrzębski Węgiel",
    position: "MB",
    age: 26,
    height: 207,
    spikeReach: 360,
    contractExp: "2026",
    mainStatValue: 88,
    mainStatLabel: "BLK",
    efficiency: 62,
    trend: "up",
  },
];

// --- COMPONENTS ---

function TrendIndicator({ trend }: { trend: PlayerTrend }) {
  if (trend === "up") {
    return (
      <div className="flex items-center text-emerald-500 font-medium text-xs">
        <TrendingUp className="mr-1 h-3 w-3" />
        <span>Rising</span>
      </div>
    );
  }
  if (trend === "down") {
    return (
      <div className="flex items-center text-rose-500 font-medium text-xs">
        <TrendingDown className="mr-1 h-3 w-3" />
        <span>Cooling</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-muted-foreground text-xs">
      <Minus className="mr-1 h-3 w-3" />
      <span>Stable</span>
    </div>
  );
}

// --- ZMODYFIKOWANA TABELA ---

function ScoutingTable({ data }: { data: ScoutingProfile[] }) {
  const router = useRouter(); // <--- Inicjalizacja routera

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12.5 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="hidden md:table-cell">Details</TableHead>
            <TableHead className="text-right">Stats</TableHead>
            <TableHead className="hidden md:table-cell text-right">Physical</TableHead>
            <TableHead className="hidden md:table-cell text-right">Contract</TableHead>
            <TableHead className="text-right">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player) => (
            <TableRow 
                key={player.id} 
                // --- INTERAKCJA ---
                className="group hover:bg-muted/40 cursor-pointer transition-colors" 
                onClick={() => router.push(`/players/${player.id}`)}
                // ------------------
            >
              <TableCell className="text-center font-bold text-lg text-muted-foreground">
                {player.rank}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={`/avatars/${player.id}.png`} alt={player.name} />
                    <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold group-hover:text-primary transition-colors">
                        {player.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {player.position} • {player.team}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {player.age} yo
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {player.position}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold tabular-nums">
                    {player.mainStatValue} <span className="text-xs font-normal text-muted-foreground">{player.mainStatLabel}</span>
                  </span>
                  <span className={`text-xs ${player.efficiency >= 50 ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                    {player.efficiency}% Eff.
                  </span>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell text-right">
                <div className="flex flex-col text-sm text-muted-foreground">
                  <span>{player.height} cm</span>
                  <span className="text-xs opacity-70">Reach: {player.spikeReach}cm</span>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell text-right">
                <Badge 
                    variant={player.contractExp === "2025" ? "destructive" : "outline"}
                    className={player.contractExp === "2025" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" : ""}
                >
                  {player.contractExp}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end">
                    <TrendIndicator trend={player.trend} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- MAIN PAGE (Reszta bez zmian, poza użyciem zaktualizowanego komponentu ScoutingTable) ---

export default function ScoutingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="Scouting Profiles"
          description="In-depth player analytics and performance trends."
          breadcrumbs={[{ label: "Scouting" }]}
        />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search player, team or nationality..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scorers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-100 mb-4">
            <TabsTrigger value="scorers">Scorers</TabsTrigger>
            <TabsTrigger value="blockers">Blockers</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
        </TabsList>

        <TabsContent value="scorers" className="space-y-4">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                        <CardTitle>Top Scorers & Attackers</CardTitle>
                        <CardDescription>Ranked by total points scored in 2024/2025 season.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Tabela teraz obsługuje kliknięcia */}
                <ScoutingTable data={SCORERS_DATA} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockers" className="space-y-4">
            <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-emerald-500" />
                    <div>
                        <CardTitle>Best Blockers</CardTitle>
                        <CardDescription>Ranked by kill blocks per set average.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ScoutingTable data={BLOCKERS_DATA} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servers">
             <div className="flex h-75 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                Dalsze dane (Best Servers) do zaimplementowania...
             </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}