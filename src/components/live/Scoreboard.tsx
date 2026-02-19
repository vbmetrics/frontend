// src/components/live/Scoreboard.tsx

import * as React from "react";
import { Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { MatchState } from "@/types/live";

interface ScoreboardProps {
  state: MatchState;
  homeTeamName: string;
  awayTeamName: string;
}

export function Scoreboard({ state, homeTeamName, awayTeamName }: ScoreboardProps) {
  
  const copyMatchId = () => {
    navigator.clipboard.writeText(state.match_id);
    toast.success("Match ID copied!");
  };

  return (
    <Card className="border-2 overflow-hidden py-0 shadow-none">
      {/* Header Paska z ID */}
      <div className="bg-muted/40 px-6 py-2 flex items-center justify-between border-b">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            LIVE MATCH
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>ID: {state.match_id}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyMatchId}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="px-6 py-0 pb-8">
        <div className="flex items-center justify-between">
          
          {/* HOME TEAM */}
          <div className="flex flex-col items-start gap-1 w-1/3">
            <div className="flex items-center justify-start gap-2">
              <Badge className="mt-2 bg-gray-500 hover:bg-muted-foreground">HOME</Badge>
              {state.serving_side === "home" && (
                  <Badge className="mt-2 bg-orange-500 hover:bg-orange-600">SERVING</Badge>
              )}
            </div>
            <h2 className="text-4xl font-black tracking-tight truncate w-full text-left" title={homeTeamName}>
              {homeTeamName}
            </h2>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              SETS: {state.home_sets}
            </div>
          </div>

          {/* CENTER SCORE */}
          <div className="flex flex-col items-center justify-center w-1/3">
            
            {/* NUMER SETA */}
            <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2 bg-muted px-3 py-1 rounded-full">
              SET {state.set_number}
            </div>
            
            {/* GŁÓWNY WYNIK */}
            <div className="text-8xl font-black tabular-nums tracking-tighter flex items-center gap-4 leading-none">
              <span className={state.serving_side === "home" ? "text-orange-600" : "text-foreground"}>
                {state.home_points}
              </span>
              <span className="text-muted-foreground/20">:</span>
              <span className={state.serving_side === "away" ? "text-orange-600" : "text-foreground"}>
                {state.away_points}
              </span>
            </div>

            {/* HISTORIA SETÓW (Klasyczna linia tekstu) - przeniesiona TUTAJ, przed zamknięciem diva w-1/3 */}
            {state.past_sets && state.past_sets.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-sm font-bold text-muted-foreground/80 tracking-widest">
                {state.past_sets.map((ps, idx) => (
                  <React.Fragment key={ps.set_number}>
                    <span>{ps.home_score}:{ps.away_score}</span>
                    {idx < state.past_sets.length - 1 && <span className="text-muted-foreground/30 font-normal">|</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
            
          </div> {/* KONIEC CENTER SCORE */}

          {/* AWAY TEAM */}
          <div className="flex flex-col items-end gap-1 w-1/3">
            <div className="flex items-center justify-end gap-2">
              {state.serving_side === "away" && (
                  <Badge className="mt-2 bg-orange-500 hover:bg-orange-600">SERVING</Badge>
              )}
              <Badge className="mt-2 bg-gray-500 hover:bg-muted-foreground">AWAY</Badge>
            </div>
            <h2 className="text-4xl font-black tracking-tight truncate w-full text-right" title={awayTeamName}>
              {awayTeamName}
            </h2>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              SETS: {state.away_sets}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}