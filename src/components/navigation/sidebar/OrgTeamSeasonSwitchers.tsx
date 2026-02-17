"use client";

import * as React from "react";
import useSWR from "swr";
import { ChevronDown, UsersRound, CalendarDays, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

// --- IMPORTY STORE & TYPES ---
import { useSeasonStore } from "@/stores/useSeasonStore";
import { SeasonReadDTO } from "@/types/season";

import { useTeamStore } from "@/stores/useTeamStore"; // <--- NOWY STORE
import { TeamReadDTO } from "@/types/team";          // <--- NOWY TYP

// --- MOCK FOR ORG (Zostawiamy na później) ---
const MOCK_ORGS = [
  { id: "org-1", name: "VBM Analytics" },
  { id: "org-2", name: "Volley Club Warsaw" },
];

// --- UTILS ---
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

const fetcher = async (url: string) => {
  const r = await fetch(url, { 
    cache: "no-store", 
    credentials: "include" // Wysyła ciasteczko autoryzacyjne
  });
  
  if (!r.ok) {
    throw new Error("Failed to fetch data");
  }
  
  return await r.json();
};

export function OrgTeamSeasonSwitchers() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // --- ORG STATE (Mock) ---
  const [orgId, setOrgId] = useLocalStorage<string>("ctx.orgId", MOCK_ORGS[0].id);
  const org = MOCK_ORGS.find((o) => o.id === orgId) ?? MOCK_ORGS[0];

  // --- TEAM STATE (Real Backend + Zustand) ---
  const { selectedTeam, setSelectedTeam, clearSelectedTeam } = useTeamStore();
  
  // Pobieranie zespołów z API
  const { data: teamsData, isLoading: teamsLoading } = useSWR<TeamReadDTO[]>(
    "/api/backend/api/v1/team/?limit=100", 
    fetcher
  );
  const teamsList = teamsData || [];

  // --- SEASONS STATE (Real Backend + Zustand) ---
  const { selectedSeasonIds, toggleSeason, clearSeasons } = useSeasonStore();
  const { data: seasonsData, isLoading: seasonsLoading } = useSWR<SeasonReadDTO[]>(
    "/api/backend/api/v1/season/?limit=100", 
    fetcher
  );
  const seasonsList = seasonsData || [];

  // --- HELPERS FOR LABELS ---
  
  const seasonsLabel = React.useMemo(() => {
    if (seasonsLoading) return "Loading...";
    if (selectedSeasonIds.length === 0) return "All seasons";
    if (selectedSeasonIds.length === 1) {
      return seasonsList.find((s) => s.id === selectedSeasonIds[0])?.name ?? "1 season";
    }
    return `${selectedSeasonIds.length} seasons`;
  }, [seasonsLoading, selectedSeasonIds, seasonsList]);

  const teamLabel = selectedTeam ? selectedTeam.name : "Select team";

  // --- RENDER MENUS ---

  const renderTeamsMenu = () => (
    <>
      <DropdownMenuLabel>Select Main Team</DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      {teamsLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {!teamsLoading && teamsList.length === 0 && (
        <div className="p-2 text-xs text-muted-foreground">No teams found.</div>
      )}

      {/* Lista Zespołów (Single Select) */}
      <div className="max-h-75 overflow-y-auto">
        {teamsList.map((t) => {
          const isSelected = selectedTeam?.id === t.id;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setSelectedTeam(t)}
              className="justify-between cursor-pointer"
            >
              <span>{t.name}</span>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </div>

      {selectedTeam && (
        <>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={clearSelectedTeam} className="text-xs justify-center text-muted-foreground">
             Clear selection
           </DropdownMenuItem>
        </>
      )}
    </>
  );

  const renderSeasonsMenu = () => (
    <>
      <DropdownMenuLabel>Filter Seasons</DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      {seasonsLoading && (
        <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="max-h-75 overflow-y-auto">
        {seasonsList.map((s) => {
            const checked = selectedSeasonIds.includes(s.id);
            return (
            <DropdownMenuItem
                key={s.id}
                onSelect={(e) => e.preventDefault()}
                onClick={() => toggleSeason(s.id)}
                className="justify-between cursor-pointer"
            >
                <span>{s.name}</span>
                <Checkbox
                checked={checked}
                onCheckedChange={() => toggleSeason(s.id)}
                />
            </DropdownMenuItem>
            );
        })}
      </div>
      
      {selectedSeasonIds.length > 0 && (
        <>
           <DropdownMenuSeparator />
           <DropdownMenuItem onClick={clearSeasons} className="text-xs justify-center text-muted-foreground">
             Clear filters
           </DropdownMenuItem>
        </>
      )}
    </>
  );

  // --- RENDER COMPONENT (COLLAPSED) ---
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={150}>
        <div className="px-1 pt-3 pb-2 flex flex-col items-center gap-2">
          
          {/* TEAM TRIGGER (Collapsed) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 relative">
                    <UsersRound className="h-4 w-4" />
                    {selectedTeam && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] border border-sidebar-primary-foreground/10" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Select Team</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
              {renderTeamsMenu()}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* SEASONS TRIGGER (Collapsed) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 relative">
                    <CalendarDays className="h-4 w-4" />
                    {selectedSeasonIds.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold">
                        {selectedSeasonIds.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Filter Seasons</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
              {renderSeasonsMenu()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    );
  }

  // --- RENDER COMPONENT (EXPANDED) ---
  return (
    <div className="px-2 pt-2 pb-2 space-y-2">
      
      {/* TEAM SWITCHER */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-9 px-3">
            <span className="inline-flex items-center gap-2 truncate">
              <UsersRound className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{teamLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
            {renderTeamsMenu()}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* SEASON SWITCHER */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-9 px-3">
            <span className="inline-flex items-center gap-2 truncate">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{seasonsLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
          {renderSeasonsMenu()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}