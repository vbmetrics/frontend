"use client";

import * as React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getMatchState,
  submitInitialLineups,
  listPlayers,
  type UUID,
} from "@/lib/api/matches";
import { Input } from "@/components/ui/input";

type Player = { id: UUID; number: number; full_name: string; position?: string };

async function fetchRoster(teamId: UUID, seasonId?: UUID) {
  const q = seasonId ? `?season_id=${seasonId}` : "";
  const res = await fetch(`/api/backend/api/v1/team/${teamId}/players${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
    return listPlayers(teamId, { season_id: seasonId, limit: 500 });
}

const POS = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
type PosKey = typeof POS[number];

const Schema = z.object({
  home: z.object({
    team_id: z.string().uuid(),
    positions: z.object({
      P1: z.string().uuid(),
      P2: z.string().uuid(),
      P3: z.string().uuid(),
      P4: z.string().uuid(),
      P5: z.string().uuid(),
      P6: z.string().uuid(),
    }),
    libero_id: z.string().uuid().optional().nullable(),
  }),
  away: z.object({
    team_id: z.string().uuid(),
    positions: z.object({
      P1: z.string().uuid(),
      P2: z.string().uuid(),
      P3: z.string().uuid(),
      P4: z.string().uuid(),
      P5: z.string().uuid(),
      P6: z.string().uuid(),
    }),
    libero_id: z.string().uuid().optional().nullable(),
  }),
});

export function LineupForm({
  matchId,
  homeTeamId,
  awayTeamId,
  seasonId,
}: {
  matchId: UUID;
  homeTeamId: UUID;
  awayTeamId: UUID;
  seasonId?: UUID;
}) {
  const router = useRouter();
  const { data: homeRoster } = useSWR(["/roster", homeTeamId, seasonId], () => fetchRoster(homeTeamId, seasonId));
  const { data: awayRoster } = useSWR(["/roster", awayTeamId, seasonId], () => fetchRoster(awayTeamId, seasonId));

  const [home, setHome] = React.useState<{ positions: Record<PosKey, UUID | "">; libero_id: UUID | "" }>({
    positions: { P1: "", P2: "", P3: "", P4: "", P5: "", P6: "" },
    libero_id: "",
  });
  const [away, setAway] = React.useState<{ positions: Record<PosKey, UUID | "">; libero_id: UUID | "" }>({
    positions: { P1: "", P2: "", P3: "", P4: "", P5: "", P6: "" },
    libero_id: "",
  });
  const [pending, setPending] = React.useState(false);

  const select = (side: "home" | "away", pos: PosKey, val: UUID) => {
    (side === "home" ? setHome : setAway)((s) => ({
      ...s,
      positions: { ...s.positions, [pos]: val },
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      home: { team_id: homeTeamId, positions: home.positions as any, libero_id: home.libero_id || null },
      away: { team_id: awayTeamId, positions: away.positions as any, libero_id: away.libero_id || null },
    };
    const parsed = Schema.safeParse(payload);
    if (!parsed.success) {
      toast.error("Please complete both lineups (P1..P6).");
      return;
    }
    try {
      setPending(true);
      await submitInitialLineups(matchId, parsed.data.home, parsed.data.away);
      toast.success("Lineups saved");
      router.push(`/live/${matchId}/coding`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save lineups");
    } finally {
      setPending(false);
    }
  };

  const renderSide = (label: string, side: "home" | "away", roster?: Player[]) => {
    const state = side === "home" ? home : away;
    return (
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">{label}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {POS.map((p) => (
            <div key={p} className="grid gap-1.5">
              <Label>{p}</Label>
              <select
                className="h-10 rounded-md border bg-background px-3"
                value={state.positions[p] || ""}
                onChange={(e) => select(side, p, e.target.value as UUID)}
              >
                <option value="">Select player…</option>
                {roster?.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    #{pl.number} {pl.full_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="grid gap-1.5 md:col-span-2">
            <Label>Libero (optional)</Label>
            <select
              className="h-10 rounded-md border bg-background px-3"
              value={state.libero_id || ""}
              onChange={(e) =>
                (side === "home" ? setHome : setAway)((s) => ({ ...s, libero_id: e.target.value as UUID }))
              }
            >
              <option value="">No libero</option>
              {roster?.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  #{pl.number} {pl.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {renderSide("Home lineup", "home", homeRoster)}
        {renderSide("Away lineup", "away", awayRoster)}
        </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="text-background">
          {pending ? "Saving…" : "Save & start coding"}
        </Button>
      </div>
    </form>
  );
}
