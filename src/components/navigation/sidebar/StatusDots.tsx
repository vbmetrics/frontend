"use client";

import * as React from "react";
import useSWR from "swr";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const fetcherText = (u: string) => fetch(u, { cache: "no-store" }).then(r => r.text());
const fetcherJson = (u: string) => fetch(u, { cache: "no-store" }).then(r => r.json());

function Dot({ color }: { color: "green" | "yellow" | "red" | "gray" }) {
  const map = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    gray: "bg-muted-foreground/40",
  } as const;
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[color]}`} />;
}

export function StatusDots({ className = "" }: { className?: string }) {
  const { state } = useSidebar();                 // "expanded" | "collapsed" (and maybe "mobile" in some setups)
  const collapsed = state === "collapsed";
  if (collapsed) return null;

  const { data: liveData, error: liveErr } = useSWR<any>(
    "/api/backend/api/v1/matches?status=live&limit=1",
    fetcherJson,
    { revalidateOnFocus: false }
  );
  const isLive = !liveErr && Array.isArray(liveData) && liveData.length > 0;

  const { data: apiOk, error: apiErr } = useSWR<string>("/api/health/api", fetcherText, { revalidateOnFocus: false });
  const { data: dbOk,  error: dbErr  } = useSWR<string>("/api/health/db",  fetcherText, { revalidateOnFocus: false });

  const apiStatus: "green" | "red" | "gray" = apiErr ? "red" : apiOk ? "green" : "gray";
  const dbStatus:  "green" | "red" | "gray" = dbErr  ? "red" : dbOk  ? "green" : "gray";

  return (
    <TooltipProvider delayDuration={150}>
      <div className={`px-3 pb-1 flex items-center gap-4 text-xs text-muted-foreground ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-2">
              <Dot color={isLive ? "green" : "gray"} />
              <span>Live</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Match coding status</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-2">
              <Dot color={apiStatus} />
              <span>API</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Backend API health</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-2">
              <Dot color={dbStatus} />
              <span>DB</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Database connectivity</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
