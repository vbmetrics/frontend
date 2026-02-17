"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// MOCK DATA
const PLAYERS = [
  {
    id: "p-1",
    name: "Wilfredo Leon",
    team: "Bogdanka LUK Lublin",
    country: "Poland",
    position: "OH", // Outside Hitter
    number: 9,
    image: "/avatars/leon.png",
  },
  {
    id: "p-2",
    name: "Bartosz Kurek",
    team: "ZAKSA Kędzierzyn-Koźle",
    country: "Poland",
    position: "OP", // Opposite
    number: 6,
    image: "/avatars/kurek.png",
  },
  {
    id: "p-3",
    name: "Earvin N'Gapeth",
    team: "Halkbank Ankara",
    country: "France",
    position: "OH",
    number: 9,
    image: "/avatars/ngapeth.png",
  },
  {
    id: "p-4",
    name: "Paweł Zatorski",
    team: "Asseco Resovia",
    country: "Poland",
    position: "L", // Libero
    number: 17,
    image: "/avatars/zatorski.png",
  },
  {
    id: "p-5",
    name: "Micah Christenson",
    team: "Zenit Kazan",
    country: "USA",
    position: "S", // Setter
    number: 11,
    image: "/avatars/christenson.png",
  },
];

export default function PlayersDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");

  // Prosta logika filtrowania po stronie klienta (w produkcji -> API params)
  const filteredPlayers = PLAYERS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = positionFilter === "ALL" || p.position === positionFilter;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Players"
        description="Browse profiles, career history, and statistics of professional volleyball players."
        breadcrumbs={[{ label: "Players" }]}
      />

      {/* Search & Filters Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, team or country..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-full md:w-45">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Positions</SelectItem>
              <SelectItem value="OH">Outside Hitter</SelectItem>
              <SelectItem value="OP">Opposite</SelectItem>
              <SelectItem value="MB">Middle Blocker</SelectItem>
              <SelectItem value="S">Setter</SelectItem>
              <SelectItem value="L">Libero</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlayers.map((player) => (
          <Link key={player.id} href={`/players/${player.id}`} className="group h-full">
            <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarImage src={player.image} alt={player.name} />
                  <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {player.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <span className="fi fi-pl" /> {/* Tu można dać flagę */}
                    {player.country}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm mt-2">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Team</span>
                    <span className="font-medium">{player.team}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground text-xs">Position</span>
                    <Badge variant="secondary">
                        {player.position} #{player.number}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 pt-3 pb-3">
                 <div className="w-full text-center text-xs text-muted-foreground group-hover:text-primary">
                    View full profile &rarr;
                 </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
        
        {filteredPlayers.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p>No players found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}