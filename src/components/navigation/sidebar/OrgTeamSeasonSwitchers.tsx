"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, UsersRound, CalendarDays, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";

/** TODO: Replace with SWR calls to your backend when ready */
const MOCK_ORGS = [
  { id: "org-1", name: "VBM Analytics" },
  { id: "org-2", name: "Volley Club Warsaw" },
];
const MOCK_TEAMS: Record<string, { id: string; name: string }[]> = {
  "org-1": [
    { id: "t-1", name: "VBM A" },
    { id: "t-2", name: "VBM Youth" },
  ],
  "org-2": [
    { id: "t-3", name: "Warsaw Seniors" },
    { id: "t-4", name: "Warsaw U19" },
  ],
};
const MOCK_SEASONS = [
  { id: "2023-24", name: "2023/24" },
  { id: "2024-25", name: "2024/25" },
  { id: "2025-26", name: "2025/26" },
];

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

export function OrgTeamSeasonSwitchers() {
  const { state } = useSidebar(); // "expanded" | "collapsed"
  const collapsed = state === "collapsed";

  const [orgId, setOrgId] = useLocalStorage<string>("ctx.orgId", MOCK_ORGS[0].id);
  const [teamId, setTeamId] = useLocalStorage<string | null>("ctx.teamId", null);
  const [seasonIds, setSeasonIds] = useLocalStorage<string[]>("ctx.seasonIds", []);

  const org = MOCK_ORGS.find((o) => o.id === orgId) ?? MOCK_ORGS[0];
  const teams = MOCK_TEAMS[org.id] ?? [];
  const team = teams.find((t) => t.id === teamId) ?? null;

  function selectOrg(id: string) {
    setOrgId(id);
    setTeamId(null);
    setSeasonIds([]);
  }
  function toggleSeason(id: string) {
    setSeasonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const seasonsLabel =
    seasonIds.length === 0
      ? "All seasons"
      : seasonIds.length === 1
      ? MOCK_SEASONS.find((s) => s.id === seasonIds[0])?.name ?? "1 season"
      : `${seasonIds.length} seasons`;

  if (collapsed) {
    // COLLAPSED: stack three icon triggers vertically, open menus to the right
    return (
      <TooltipProvider delayDuration={150}>
        <div className="px-1 pt-1 pb-2 flex flex-col items-center gap-2">
          {/* Organization */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label="Organization"
                  >
                    <Building2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Organization</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
              {MOCK_ORGS.map((o) => (
                <DropdownMenuItem key={o.id} onClick={() => selectOrg(o.id)}>
                  {o.name}
                </DropdownMenuItem>
              ))}
              <div className="px-2 pt-2">
                <Link
                  href="/account/organizations"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Manage organizations
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Team */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label="Team"
                  >
                    <UsersRound className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Team</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
              {teams.map((t) => (
                <DropdownMenuItem key={t.id} onClick={() => setTeamId(t.id)}>
                  {t.name}
                </DropdownMenuItem>
              ))}
              {teams.length === 0 && (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  No teams in this org.
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Seasons */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    aria-label="Seasons"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Seasons</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
              {MOCK_SEASONS.map((s) => {
                const checked = seasonIds.includes(s.id);
                return (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSeason(s.id);
                    }}
                    className="justify-between"
                  >
                    <span>{s.name}</span>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleSeason(s.id)}
                    />
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    );
  }

  // EXPANDED: full labeled buttons
  return (
    <div className="px-2 pt-2 pb-2 space-y-2">
      {/* Organization */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {org?.name || "Select organization"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {MOCK_ORGS.map((o) => (
            <DropdownMenuItem key={o.id} onClick={() => selectOrg(o.id)}>
              {o.name}
            </DropdownMenuItem>
          ))}
          <div className="px-2 pt-2">
            <Link
              href="/account/organizations"
              className="text-xs text-muted-foreground hover:underline"
            >
              Manage organizations
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Team */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <UsersRound className="h-4 w-4" />
              {team?.name || "Select team"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {teams.map((t) => (
            <DropdownMenuItem key={t.id} onClick={() => setTeamId(t.id)}>
              {t.name}
            </DropdownMenuItem>
          ))}
          {teams.length === 0 && (
            <div className="px-2 py-2 text-xs text-muted-foreground">
              No teams in this org.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Seasons */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {seasonIds.length === 0 ? "All seasons" : seasonsLabel}
            </span>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {MOCK_SEASONS.map((s) => {
            const checked = seasonIds.includes(s.id);
            return (
              <DropdownMenuItem
                key={s.id}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSeason(s.id);
                }}
                className="justify-between"
              >
                <span>{s.name}</span>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleSeason(s.id)}
                />
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
