"use client";

import * as React from "react";
import useSWR from "swr";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importy globalnego stanu (Zustand)
import { useTeamStore } from "@/stores/useTeamStore";
import { useSeasonStore } from "@/stores/useSeasonStore";

// --- Własne wywołania API (odporne na brak ciasteczek) ---
const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return await r.json();
};

async function apiCall(url: string, method: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || "API request failed");
  }
  return res.json();
}

// Typy słownikowe
interface DictItem { id: string; name: string; }

// Zod - usunięto pole description, dopasowano do backendu
const Schema = z
  .object({
    season_id: z.string().uuid("Select season."),
    home_team_id: z.string().uuid("Select home team."),
    away_team_id: z.string().uuid("Select away team."),
    arena_id: z.string().uuid("Select arena.").optional().or(z.literal("")),
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
  })
  .refine((data) => data.home_team_id !== data.away_team_id, {
    path: ["away_team_id"],
    message: "Away team must be different from home team.",
  });

type FormValues = z.infer<typeof Schema>;

export function StartMatchForm() {
  const router = useRouter();

  // Pobranie wartości z globalnego Sidebara
  const { selectedTeam } = useTeamStore();
  const { selectedSeasonIds } = useSeasonStore();

  const defaultSeason = selectedSeasonIds.length === 1 ? selectedSeasonIds[0] : "";
  const defaultTeam = selectedTeam ? selectedTeam.id : "";

  const [values, setValues] = React.useState<FormValues>({
    season_id: defaultSeason,
    home_team_id: defaultTeam,
    away_team_id: "",
    arena_id: "",
    match_date: new Date().toISOString().slice(0, 10),
    spectators: undefined,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({});
  const [pending, setPending] = React.useState(false);

  const { data: seasons } = useSWR<DictItem[]>("/api/backend/api/v1/season/?limit=500", fetcher);
  const { data: arenas } = useSWR<DictItem[]>("/api/backend/api/v1/arena/?limit=500", fetcher);
  
  // Pobierz drużyny, ale tylko dla wybranego sezonu (jeśli API to wspiera)
  const teamsUrl = values.season_id ? `/api/backend/api/v1/team/?season_id=${values.season_id}&limit=500` : null;
  const { data: teams, isLoading: teamsLoading } = useSWR<DictItem[]>(teamsUrl, fetcher);

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
      toast.error("Please fix the errors in the form.");
      return;
    }
    
    setErrors({});
    setPending(true);
    
    try {
      const payload: Record<string, any> = {
        match_date: parsed.data.match_date,
        season_id: parsed.data.season_id,
        home_team_id: parsed.data.home_team_id,
        away_team_id: parsed.data.away_team_id,
      };

      if (parsed.data.spectators !== undefined) payload.spectators = parsed.data.spectators;
      if (parsed.data.arena_id) payload.arena_id = parsed.data.arena_id;

      // Zastąpiono customową funkcją apiCall, która poprawnie przekaże tokeny
      const created = await apiCall("/api/backend/api/v1/match/", "POST", payload);
      
      toast.success("Match created successfully!");
      router.push(`/live/${created.id}/setup`);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to create match");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 rounded-lg border bg-card p-6 max-w-4xl">
      <h2 className="text-xl font-semibold">Start a new match</h2>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* SEASON */}
        <div className="space-y-2">
          <Label htmlFor="season_id">Season <span className="text-red-500">*</span></Label>
          <Select value={values.season_id} onValueChange={(v) => onChange("season_id", v)}>
            <SelectTrigger id="season_id" className={errors.season_id ? "border-destructive" : ""}>
              <SelectValue placeholder="Select season..." />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.season_id && <p className="text-xs text-destructive">{errors.season_id}</p>}
        </div>

        {/* ARENA */}
        <div className="space-y-2">
          <Label htmlFor="arena_id">Arena</Label>
          <Select value={values.arena_id} onValueChange={(v) => onChange("arena_id", v === "none" ? "" : v)}>
            <SelectTrigger id="arena_id">
              <SelectValue placeholder="Select arena (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {arenas?.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.arena_id && <p className="text-xs text-destructive">{errors.arena_id}</p>}
        </div>

        {/* HOME TEAM */}
        <div className="space-y-2">
          <Label htmlFor="home_team_id">Home team <span className="text-red-500">*</span></Label>
          <Select value={values.home_team_id} onValueChange={(v) => onChange("home_team_id", v)} disabled={!values.season_id || teamsLoading}>
            <SelectTrigger id="home_team_id" className={errors.home_team_id ? "border-destructive" : ""}>
              <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select home team"} />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.home_team_id && <p className="text-xs text-destructive">{errors.home_team_id}</p>}
        </div>

        {/* AWAY TEAM */}
        <div className="space-y-2">
          <Label htmlFor="away_team_id">Away team <span className="text-red-500">*</span></Label>
          <Select value={values.away_team_id} onValueChange={(v) => onChange("away_team_id", v)} disabled={!values.season_id || teamsLoading}>
            <SelectTrigger id="away_team_id" className={errors.away_team_id ? "border-destructive" : ""}>
              <SelectValue placeholder={teamsLoading ? "Loading teams..." : "Select away team"} />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.away_team_id && <p className="text-xs text-destructive">{errors.away_team_id}</p>}
        </div>

        {/* MATCH DATE */}
        <div className="space-y-2">
          <Label htmlFor="match_date">Match Date <span className="text-red-500">*</span></Label>
          <Input
            id="match_date"
            type="date"
            value={values.match_date}
            onChange={(e) => onChange("match_date", e.target.value)}
            className={errors.match_date ? "border-destructive" : ""}
          />
          {errors.match_date && <p className="text-xs text-destructive">{errors.match_date}</p>}
        </div>

        {/* SPECTATORS */}
        <div className="space-y-2">
          <Label htmlFor="spectators">Spectators (optional)</Label>
          <Input
            id="spectators"
            type="number"
            min={0}
            placeholder="e.g. 2500"
            value={values.spectators ?? ""}
            onChange={(e) =>
              onChange("spectators", e.target.value === "" ? undefined : e.target.value)
            }
          />
          {errors.spectators && <p className="text-xs text-destructive">{errors.spectators}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={pending} className="gap-2">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {pending ? "Creating..." : "Create & Setup Match"}
        </Button>
      </div>
    </form>
  );
}