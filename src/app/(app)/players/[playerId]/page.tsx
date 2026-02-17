import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Ruler, Weight, Activity, MapPin, CalendarDays, ArrowRightLeft } from "lucide-react";

// --- MOCK DATA FOR PROFILE ---

const PLAYER_DETAILS = {
  id: "p-1",
  name: "Wilfredo Leon Venero",
  nationality: "Poland / Cuba",
  birthDate: "1993-07-31",
  age: 31,
  position: "Outside Hitter",
  number: 9,
  currentTeam: "Bogdanka LUK Lublin",
  physical: {
    height: 201, // cm
    weight: 96, // kg
    spike: 370, // cm
    block: 345, // cm
  },
  history: [
    { season: "2024/2025", team: "Bogdanka LUK Lublin", league: "PlusLiga", country: "POL" },
    { season: "2018–2024", team: "Sir Safety Perugia", league: "SuperLega", country: "ITA" },
    { season: "2014–2018", team: "Zenit Kazan", league: "Super League", country: "RUS" },
    { season: "2005–2010", team: "Capitalinos", league: "Cuba League", country: "CUB" },
  ],
  stats: [
    { season: "2024/25", team: "LUK Lublin", matches: 18, sets: 68, pts: 428, ace: 54, blk: 22, eff: "54%" },
    { season: "2023/24", team: "Perugia", matches: 32, sets: 112, pts: 580, ace: 76, blk: 45, eff: "52%" },
    { season: "2022/23", team: "Perugia", matches: 28, sets: 98, pts: 495, ace: 62, blk: 38, eff: "56%" },
  ],
};

interface PageProps {
  params: Promise<{ playerId: string }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { playerId } = await params;
  
  // Tu fetch(playerId) z backendu
  if (!PLAYER_DETAILS) return notFound();
  const p = PLAYER_DETAILS;

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. HEADER PROFILE CARD */}
      <Card className="overflow-hidden bg-gradient-to-r from-background to-muted/30">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Avatar / Photo */}
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
              <AvatarImage src="/avatars/leon-big.png" />
              <AvatarFallback className="text-4xl">{p.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            {/* Main Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary">
                    {p.position}
                </Badge>
                <Badge variant="secondary">#{p.number}</Badge>
                <Badge variant="outline">{p.nationality}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{p.name}</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground text-lg">
                <MapPin className="h-5 w-5" />
                <span>{p.currentTeam}</span>
              </div>
            </div>

            {/* Physical Stats Box */}
            <div className="grid grid-cols-2 gap-4 bg-background/60 p-4 rounded-xl border shadow-sm w-full md:w-auto">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        <Ruler className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Height</p>
                        <p className="font-semibold">{p.physical.height} cm</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                        <Weight className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Weight</p>
                        <p className="font-semibold">{p.physical.weight} kg</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Spike</p>
                        <p className="font-semibold">{p.physical.spike} cm</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">Block</p>
                        <p className="font-semibold">{p.physical.block} cm</p>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. CAREER HISTORY (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                        Career Path
                    </CardTitle>
                    <CardDescription>Transfer history & teams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l border-muted ml-3 space-y-8 pb-2">
                        {p.history.map((h, i) => (
                            <div key={i} className="ml-6 relative">
                                {/* Kropka na osi czasu */}
                                <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{h.team}</span>
                                    <span className="text-xs text-muted-foreground">{h.season}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5">{h.league}</Badge>
                                        <span className="text-[10px] font-bold text-muted-foreground">{h.country}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            {/* Extra Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Birth Date</span>
                        <span>{p.birthDate} ({p.age} yo)</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Nationality</span>
                        <span>{p.nationality}</span>
                    </div>
                     <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground">Dominant Hand</span>
                        <span>Right</span>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* 3. SEASON STATS (Right Column - Wider) */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        Career Statistics
                    </CardTitle>
                    <CardDescription>Performance breakdown by season.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Season</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead className="text-right">M</TableHead>
                                <TableHead className="text-right">Sets</TableHead>
                                <TableHead className="text-right font-bold text-foreground">Pts</TableHead>
                                <TableHead className="text-right">Ace</TableHead>
                                <TableHead className="text-right">Blk</TableHead>
                                <TableHead className="text-right">Eff%</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {p.stats.map((row) => (
                                <TableRow key={row.season}>
                                    <TableCell className="font-medium">{row.season}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs md:text-sm">{row.team}</TableCell>
                                    <TableCell className="text-right">{row.matches}</TableCell>
                                    <TableCell className="text-right">{row.sets}</TableCell>
                                    <TableCell className="text-right font-bold text-foreground">{row.pts}</TableCell>
                                    <TableCell className="text-right">{row.ace}</TableCell>
                                    <TableCell className="text-right">{row.blk}</TableCell>
                                    <TableCell className={`text-right ${parseInt(row.eff) > 50 ? 'text-green-600 font-bold' : ''}`}>
                                        {row.eff}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}