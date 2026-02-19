"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volleyball } from "lucide-react";
import type { Rotation, PlayerMap } from "@/types/live";

interface VisualCourtProps {
  homeRotation: Rotation;
  awayRotation: Rotation;
  playerMap: PlayerMap;
  servingSide: "home" | "away";
  servingIndex: number;
}

function extractLastName(fullName: string): string {
  if (!fullName) return "Player";
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
}

// --- Kafelek Zawodnika ---
function PlayerTile({
  uuid,
  playerMap,
  isServing,
}: {
  uuid: string;
  playerMap: PlayerMap;
  isServing: boolean;
}) {
  const player = playerMap[uuid];

  // Placeholder, jeśli brak danych zawodnika
  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 opacity-30 relative z-10">
        {/* Puste miejsce na nazwisko */}
        <div className="h-3 w-12 bg-black/10 dark:bg-white/10 rounded-sm" />
        {/* Puste kółko */}
        <div className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/10 border-dashed flex items-center justify-center">
           <span className="text-xs text-muted-foreground">?</span>
        </div>
        {/* Puste miejsce na shield */}
        <div className="h-4 w-8 bg-black/10 dark:bg-white/10 rounded-sm" />
      </div>
    );
  }

  const lastName = extractLastName(player.name);
  const pos = player.position;

  // Kolorowanie shielda w zależności od pozycji
  let shieldColors = "border-border/50 text-muted-foreground dark:text-white-400 bg-background/50 dark:bg-white/10";
  if (pos === 'L') shieldColors = "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 bg-yellow-500/10";
  if (pos === 'S') shieldColors = "border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-500/10";

  return (
    <div className={cn(
        "flex flex-col items-center justify-center relative group z-10 transition-all duration-300",
        isServing && "z-20 scale-105"
    )}>
      
      {/* GÓRA: Nazwisko + Piłka */}
      <div className="text-[12px] font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap mb-1 drop-shadow-sm">
        {lastName}
        {isServing && (
           <Volleyball className="h-3 w-3 text-primary animate-bounce" />
        )}
      </div>

      {/* ŚRODEK: Kółko z numerem */}
      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center text-lg font-black shadow-md ring-2 ring-background transition-all",
        // Wyrazisty kolor primary (czarny/biały) dla kontrastu
        "bg-primary text-primary-foreground",
        isServing ? "ring-primary shadow-lg" : "group-hover:ring-primary/50"
      )}>
        {player.jersey}
      </div>

      {/* DÓŁ: Shield z pozycją */}
      <Badge 
        variant="outline" 
        className={cn(
            "mt-1.5 text-[10px] px-1.5 py-0 h-4 font-mono font-bold uppercase backdrop-blur-md shadow-sm",
            shieldColors
        )}
      >
        {pos}
      </Badge>
    </div>
  );
}

// --- Główny Komponent Boiska ---
export function VisualCourt({
  homeRotation,
  awayRotation,
  playerMap,
  servingSide,
  servingIndex,
}: VisualCourtProps) {
  
  // Definicje stref dla rzędów (Front / Back)
  // Home: Back=[5,6,1], Front=[4,3,2]
  const homeBackRow = [5, 6, 1];
  const homeFrontRow = [4, 3, 2];

  // Away: Front=[2,3,4], Back=[1,6,5]
  const awayFrontRow = [2, 3, 4];
  const awayBackRow = [1, 6, 5];

  // Helper do renderowania kolumny (rzędu zawodników)
  const renderColumn = (zones: number[], rotation: Rotation, side: "home" | "away") => {
    const isSideServing = servingSide === side;
    return (
      <div className="grid grid-rows-3 h-full items-center justify-items-center gap-y-4 relative z-10 my-auto">
         {zones.map(z => (
             <PlayerTile 
                 key={z} 
                 uuid={rotation.order[z-1]} 
                 playerMap={playerMap} 
                 isServing={isSideServing && servingIndex === (z-1)}
             />
         ))}
      </div>
    );
  }

  return (
    <Card className="border-2 rounded-lg shadow-sm p-0 bg-muted/50">
        
      <CardContent className="p-6 border-0 shadow-none">
        
        {/* KONTENER BOISKA - Cieplejsze kolory, wyraźne linie */}
        <div className="relative w-full h-95 rounded-none overflow-hidden border-2 border-orange-300/50 dark:border-orange-700/50 shadow-inner flex bg-orange-100 dark:bg-orange-950/40">
          
          {/* --- Warstwa Podłogi i Linii --- */}
          <div className="absolute inset-0 pointer-events-none">

             {/* Linie boiska - Białe, wyraźne */}
             {/* Linia 3. metra Home */}
             <div className="absolute left-[calc(50%-16.6%)] top-0 bottom-0 w-0.5 bg-white/80 shadow-sm" />
             {/* Linia 3. metra Away */}
             <div className="absolute right-[calc(50%-16.6%)] top-0 bottom-0 w-0.5 bg-white/80 shadow-sm" />
             
             {/* Siatka (Środek) */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-2 bg-white/20 flex items-center justify-center z-0 shadow-sm">
                 {/* Tekstura siatki */}
                 <div className="h-full w-0.5 bg-white relative">
                    <div className="absolute inset-y-0 -left-1 -right-1 bg-[linear-gradient(to_bottom,transparent_2px,white_2px),linear-gradient(to_right,transparent_2px,white_2px)] bg-size-[4px_4px] opacity-30"></div>
                 </div>
             </div>
          </div>

          {/* --- Warstwa Zawodników (Grid 3x2 na stronę) --- */}

          {/* HOME SIDE (Left) */}
          <div className="flex-1 flex py-0 pl-8 pr-2 relative">
             {/* Kolumna tylna (Back Row) */}
             <div className="flex-1 pl-16">
                {renderColumn(homeBackRow, homeRotation, "home")}
             </div>
             {/* Kolumna przednia (Front Row) - bliżej siatki */}
             <div className="flex-1 pl-30">
                {renderColumn(homeFrontRow, homeRotation, "home")}
             </div>
          </div>

          {/* AWAY SIDE (Right) */}
          <div className="flex-1 flex py-0 pr-8 pl-2 relative">
             {/* Kolumna przednia (Front Row) - bliżej siatki */}
             <div className="flex-1 pr-16">
                {renderColumn(awayFrontRow, awayRotation, "away")}
             </div>
             {/* Kolumna tylna (Back Row) */}
             <div className="flex-1 pr-30">
                {renderColumn(awayBackRow, awayRotation, "away")}
             </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}