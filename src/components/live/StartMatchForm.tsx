"use client";

import * as React from "react";
import useSWR from "swr";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api/client";
import { buildUrl } from "@/lib/api/http";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  createMatch,
  listArenas,
  listSeasons,
  listTeams,
  type UUID,
  type Season,
  type Team,
  type Arena,
} from "@/lib/api/matches";

const Schema = z
  .object({
    season_id: z.string().uuid("Select season."),
    home_team_id: z.string().uuid("Select home team."),
    away_team_id: z.string().uuid("Select away team."),
    arena_id: z.string().uuid("Select arena."),
    match_date: z
      .string()
      .min(10, "Choose date (YYYY-MM-DD).")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format."),
    spectators: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
      .refine((v) => v === undefined || (Number.isInteger(v) && v >= 0), {
        message: "Spectators must be a non-negative integer.",
      }),
    description: z.string().max(500).optional(),
  })
  .refine((data) => data.home_team_id !== data.away_team_id, {
    path: ["away_team_id"],
    message: "Teams must be different.",
  });

type FormValues = z.infer<typeof Schema>;

export function StartMatchForm() {
  const router = useRouter();

  const [values, setValues] = React.useState<FormValues>({
    season_id: "",
    home_team_id: "",
    away_team_id: "",
    arena_id: "",
    match_date: new Date().toISOString().slice(0, 10),
    spectators: undefined,
    description: "",
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [pending, setPending] = React.useState(false);

  const seasonUrl = buildUrl("/api/v1/season", { limit: 500 });
  const arenaUrl  = buildUrl("/api/v1/arena",  { limit: 500 });

  const { data: seasons, error: seasonsErr } =
    useSWR<Season[]>(seasonUrl, (url) => apiFetch<Season[]>(url), {
      revalidateOnFocus: false,
      onError: (e) => console.error("Seasons error:", e),
    });

  const { data: arenas, error: arenasErr } =
    useSWR<Arena[]>(arenaUrl, (url) => apiFetch<Arena[]>(url), {
      revalidateOnFocus: false,
      onError: (e) => console.error("Arenas error:", e),
    });

  const seasonId = values.season_id as UUID | "";

  const teamsUrl = seasonId
    ? buildUrl("/api/v1/team", { season_id: seasonId, limit: 500 })
    : null;

  const { data: teams, error: teamsErr } =
    useSWR<Team[]>(teamsUrl, (url: string) => apiFetch<Team[]>(url), {
      revalidateOnFocus: false,
      onError: (e) => console.error("Teams error:", e),
    });

  // opcjonalnie: możesz pokazać spinnery / błędy pod selectami:
  const loadingSeasons = !seasons && !seasonsErr;
  const loadingArenas  = !arenas && !arenasErr;
  const loadingTeams   = seasonId && !teams && !teamsErr;

  const onChange = (k: keyof FormValues, v: any) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (k === "season_id") {
      setValues((s) => ({ ...s, home_team_id: "", away_team_id: "" }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Schema.safeParse(values);
    if (!parsed.success) {
      const map: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        map[key] = issue.message;
      }
      setErrors(map);
      toast.error("Please fix the form.");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const payload = {
        match_date: parsed.data.match_date,
        spectators: parsed.data.spectators ?? undefined,
        season_id: parsed.data.season_id as UUID,
        home_team_id: parsed.data.home_team_id as UUID,
        away_team_id: parsed.data.away_team_id as UUID,
        arena_id: parsed.data.arena_id as UUID,
      };
      const created = await createMatch(payload); // -> { id }
      toast.success("Match created");
      router.push(`/live/${created.id}/setup`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to create match");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 rounded-lg border bg-card p-6">
      <h2 className="text-xl font-semibold">Start a new match</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="season_id">Season</Label>
          <select
            id="season_id"
            className="h-10 rounded-md border bg-background px-3"
            value={values.season_id}
            onChange={(e) => onChange("season_id", e.target.value)}
          >
            <option value="">Select…</option>
            {seasons?.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.season_id && <p className="text-xs text-destructive">{errors.season_id}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="arena_id">Arena</Label>
          <select
            id="arena_id"
            className="h-10 rounded-md border bg-background px-3"
            value={values.arena_id}
            onChange={(e) => onChange("arena_id", e.target.value)}
          >
            <option value="">Select…</option>
            {arenas?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {errors.arena_id && <p className="text-xs text-destructive">{errors.arena_id}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="home_team_id">Home team</Label>
          <select
            id="home_team_id"
            className="h-10 rounded-md border bg-background px-3"
            value={values.home_team_id}
            onChange={(e) => onChange("home_team_id", e.target.value)}
            disabled={!teams}
          >
            <option value="">Select…</option>
            {teams?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {errors.home_team_id && <p className="text-xs text-destructive">{errors.home_team_id}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="away_team_id">Away team</Label>
          <select
            id="away_team_id"
            className="h-10 rounded-md border bg-background px-3"
            value={values.away_team_id}
            onChange={(e) => onChange("away_team_id", e.target.value)}
            disabled={!teams}
          >
            <option value="">Select…</option>
            {teams?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {errors.away_team_id && <p className="text-xs text-destructive">{errors.away_team_id}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="match_date">Date</Label>
          <Input
            id="match_date"
            type="date"
            value={values.match_date}
            onChange={(e) => onChange("match_date", e.target.value)}
          />
          {errors.match_date && <p className="text-xs text-destructive">{errors.match_date}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="spectators">Spectators (optional)</Label>
          <Input
            id="spectators"
            type="number"
            min={0}
            value={values.spectators ?? ""}
            onChange={(e) =>
              onChange("spectators", e.target.value === "" ? undefined : e.target.value)
            }
          />
          {errors.spectators && <p className="text-xs text-destructive">{errors.spectators}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={values.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Short match note…"
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="text-background">
          {pending ? "Creating…" : "Create & continue"}
        </Button>
      </div>
    </form>
  );
}
