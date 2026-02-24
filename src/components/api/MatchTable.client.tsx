// src/components/api/MatchTable.client.tsx

"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, Plus, Pencil, Trash2, Loader2, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- TYPES ---

export interface MatchReadDTO {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  arena_id: string;
  match_date?: string;
  winner_team_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// --- UTILS & API CALLS ---

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
  if (method !== "DELETE") return res.json();
}

// --- COMPONENT: ROW (POJEDYNCZY MECZ Z SWR DLA NAZW) ---
function MatchTableRow({ match, onEdit, onDelete }: { match: MatchReadDTO, onEdit: (m: MatchReadDTO) => void, onDelete: (m: MatchReadDTO) => void }) {
  const { data: homeTeam } = useSWR(`/api/backend/api/v1/team/${match.home_team_id}`, fetcher);
  const { data: awayTeam } = useSWR(`/api/backend/api/v1/team/${match.away_team_id}`, fetcher);
  const { data: state } = useSWR(`/api/backend/api/v1/match/${match.id}/state`, fetcher);

  const homeName = homeTeam?.name || "...";
  const awayName = awayTeam?.name || "...";
  const dateStr = match.match_date ? new Date(match.match_date).toLocaleDateString() : "TBD";
  
  const scoreStr = state ? `${state.home_sets}:${state.away_sets}` : "0:0";
  const isFinished = match.winner_team_id !== null;

  return (
    <TableRow>
      <TableCell className="text-right font-bold truncate px-10" title={homeName}>
        {homeName}
      </TableCell>
      <TableCell className="text-center font-black text-primary tabular-nums px-10">
        {scoreStr}
      </TableCell>
      <TableCell className="text-left font-bold truncate px-10" title={awayName}>
        {awayName}
      </TableCell>
      <TableCell className="font-medium text-muted-foreground whitespace-nowrap px-10 ">
        {dateStr}
      </TableCell>
      <TableCell className="text-center px-10">
        {match.id ? match.id : "-"}
      </TableCell>
      <TableCell className="text-center px-10">
        <Badge variant={isFinished ? "secondary" : "destructive"}>
          {isFinished ? "FINISHED" : "LIVE"}
        </Badge>
      </TableCell>
      <TableCell className="text-center whitespace-nowrap px-10">
        <Button variant="ghost" size="icon" onClick={() => onEdit(match)} title="Edit Match" disabled={true}>
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(match)}
          className="text-red-500 hover:text-red-700 hover:bg-red-500/10 ml-1"
          title="Delete Match"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// --- COMPONENT: MATCH FORM (CREATE / UPDATE) ---

function MatchFormDialog({
  isOpen,
  onClose,
  match,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  match: MatchReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Pobieranie opcji do formularza (słowniki)
  const { data: seasons } = useSWR(`/api/backend/api/v1/season/?limit=100`, fetcher);
  const { data: teams } = useSWR(`/api/backend/api/v1/team/?limit=100`, fetcher);
  const { data: arenas } = useSWR(`/api/backend/api/v1/arena/?limit=100`, fetcher);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      season_id: formData.get("season_id"),
      home_team_id: formData.get("home_team_id"),
      away_team_id: formData.get("away_team_id"),
      arena_id: formData.get("arena_id"),
      date: formData.get("date") || null,
      time: formData.get("time") || null,
    };

    if (data.home_team_id === data.away_team_id) {
      toast.error("Home and Away teams cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (match) {
        await apiCall(`/api/backend/api/v1/match/${match.id}`, "PATCH", data);
        toast.success("Match updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/match/`, "POST", data);
        toast.success("Match created successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingDicts = !seasons || !teams || !arenas;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{match ? "Edit Match" : "Create New Match"}</DialogTitle>
          <DialogDescription>
            {match ? "Update the details for this match." : "Provide basic info. You can start live coding from the main Matches page later."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingDicts ? (
          <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : (
          <form id="match-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label>Season <span className="text-red-500">*</span></Label>
              <Select name="season_id" defaultValue={match?.season_id || (seasons.length > 0 ? seasons[0].id : "")} required>
                <SelectTrigger><SelectValue placeholder="Select Season" /></SelectTrigger>
                <SelectContent>
                  {seasons.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Home Team <span className="text-red-500">*</span></Label>
                <Select name="home_team_id" defaultValue={match?.home_team_id} required>
                  <SelectTrigger><SelectValue placeholder="Select Team" /></SelectTrigger>
                  <SelectContent>
                    {teams.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Away Team <span className="text-red-500">*</span></Label>
                <Select name="away_team_id" defaultValue={match?.away_team_id} required>
                  <SelectTrigger><SelectValue placeholder="Select Team" /></SelectTrigger>
                  <SelectContent>
                    {teams.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Arena <span className="text-red-500">*</span></Label>
              <Select name="arena_id" defaultValue={match?.arena_id} required>
                <SelectTrigger><SelectValue placeholder="Select Arena" /></SelectTrigger>
                <SelectContent>
                  {arenas.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={match?.match_date || ""} />
              </div>
            </div>

          </form>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="match-form" disabled={isSubmitting || isLoadingDicts}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {match ? "Save Changes" : "Create Match"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function MatchTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [matchToEdit, setMatchToEdit] = React.useState<MatchReadDTO | null>(null);
  const [matchToDelete, setMatchToDelete] = React.useState<MatchReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = `/api/backend/api/v1/match/?skip=${skip}&limit=${pageSize}`;

  const { data, error, isLoading, mutate, isValidating } = useSWR<MatchReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const matches = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = matches.length === pageSize; 

  const confirmDelete = async () => {
    if (!matchToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/match/${matchToDelete.id}`, "DELETE");
      toast.success("Match completely deleted.");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete match. Check DB constraints.");
    } finally {
      setMatchToDelete(null);
    }
  };

  const openCreateForm = () => {
    setMatchToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (match: MatchReadDTO) => {
    setMatchToEdit(match);
    setFormModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-sm p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error fetching data.</p>
        <Button variant="outline" size="sm" onClick={() => mutate()} className="mt-2">Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <CalendarDays className="w-4 h-4"/> 
          <span>Sorting by latest updates</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={!canPrev || isValidating}>
              ←
            </Button>
            <span className="text-sm tabular-nums whitespace-nowrap">Page {pageIndex + 1}</span>
            <Button variant="outline" size="sm" onClick={() => setPageIndex((p) => p + 1)} disabled={!canNext || isValidating}>
              →
            </Button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-right w-[25%] px-10">Home Team</TableHead>
              <TableHead className="text-center w-20 px-10">Score</TableHead>
              <TableHead className="text-left w-[25%] px-10">Away Team</TableHead>
              <TableHead className="text-center w-20 px-10">Date</TableHead>
              <TableHead className="text-center w-20 px-10">Match ID</TableHead>
              <TableHead className="text-center w-20 px-10">Status</TableHead>
              <TableHead className="text-center w-20 px-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && matches.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : matches.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No matches found.</TableCell></TableRow>
            ) : (
              matches.map((m) => (
                 <MatchTableRow 
                    key={m.id} 
                    match={m} 
                    onEdit={openEditForm} 
                    onDelete={setMatchToDelete} 
                 />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODALS */}
      {formModalOpen && (
        <MatchFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          match={matchToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!matchToDelete} onOpenChange={(open) => !open && setMatchToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete match completely?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this match, <strong>including all played sets, rallies, and statistical actions.</strong> This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Match Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}