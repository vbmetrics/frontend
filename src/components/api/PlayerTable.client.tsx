"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, FilterX, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

// --- TYPES ---

export type PlayerPosition = "setter" | "opposite" | "outside_hitter" | "middle_blocker" | "libero";
export type PlayerHand = "right" | "left" | "ambidextrous";

export interface PlayerReadDTO {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  playing_position?: PlayerPosition | null;
  dominant_hand?: PlayerHand | null;
  spike_reach_cm?: number | null;
  block_reach_cm?: number | null;
  nationality_code: string;
}

// --- UTILS & API CALLS ---

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return (await r.json()) as PlayerReadDTO[];
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

function formatPosition(pos?: PlayerPosition | null) {
  if (!pos) return "—";
  return pos.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- COMPONENT: PLAYER FORM (CREATE / UPDATE) ---

function PlayerFormDialog({
  isOpen,
  onClose,
  player,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      date_of_birth: formData.get("date_of_birth"),
      nationality_code: formData.get("nationality_code")?.toString().toUpperCase(),
    };

    const height = formData.get("height_cm");
    data.height_cm = height ? Number(height) : null;
    
    const weight = formData.get("weight_kg");
    data.weight_kg = weight ? Number(weight) : null;
    
    const spike = formData.get("spike_reach_cm");
    data.spike_reach_cm = spike ? Number(spike) : null;
    
    const block = formData.get("block_reach_cm");
    data.block_reach_cm = block ? Number(block) : null;

    const pos = formData.get("playing_position");
    if (pos && pos !== "none") data.playing_position = pos;

    const hand = formData.get("dominant_hand");
    if (hand && hand !== "none") data.dominant_hand = hand;

    try {
      if (player) {
        await apiCall(`/api/backend/api/v1/player/${player.id}`, "PATCH", data);
        toast.success("Player updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/player/`, "POST", data);
        toast.success("Player created successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player ? "Edit Player" : "Add New Player"}</DialogTitle>
          <DialogDescription>
            {player ? "Modify player details below." : "Enter the details for the new player."}
          </DialogDescription>
        </DialogHeader>

        <form id="player-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
            <Input id="first_name" name="first_name" defaultValue={player?.first_name} required />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
            <Input id="last_name" name="last_name" defaultValue={player?.last_name} required />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="date_of_birth">Date of Birth <span className="text-red-500">*</span></Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={player?.date_of_birth} required />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="nationality_code">Nationality (ISO 2) <span className="text-red-500">*</span></Label>
            <Input id="nationality_code" name="nationality_code" placeholder="PL, US, IT..." minLength={2} maxLength={2} defaultValue={player?.nationality_code} required />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="playing_position">Position</Label>
            <Select name="playing_position" defaultValue={player?.playing_position || "none"}>
              <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unknown / Not set</SelectItem>
                <SelectItem value="setter">Setter</SelectItem>
                <SelectItem value="outside_hitter">Outside Hitter</SelectItem>
                <SelectItem value="opposite">Opposite</SelectItem>
                <SelectItem value="middle_blocker">Middle Blocker</SelectItem>
                <SelectItem value="libero">Libero</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="dominant_hand">Dominant Hand</Label>
            <Select name="dominant_hand" defaultValue={player?.dominant_hand || "none"}>
              <SelectTrigger><SelectValue placeholder="Select hand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unknown / Not set</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="ambidextrous">Ambidextrous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height_cm">Height (cm)</Label>
            <Input id="height_cm" name="height_cm" type="number" min={100} max={250} defaultValue={player?.height_cm || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight_kg">Weight (kg)</Label>
            <Input id="weight_kg" name="weight_kg" type="number" min={40} max={150} defaultValue={player?.weight_kg || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spike_reach_cm">Spike Reach (cm)</Label>
            <Input id="spike_reach_cm" name="spike_reach_cm" type="number" min={200} max={400} defaultValue={player?.spike_reach_cm || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="block_reach_cm">Block Reach (cm)</Label>
            <Input id="block_reach_cm" name="block_reach_cm" type="number" min={200} max={400} defaultValue={player?.block_reach_cm || ""} />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="player-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {player ? "Save Changes" : "Create Player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function PlayerTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [positionFilter, setPositionFilter] = React.useState<string>("ALL");

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [playerToEdit, setPlayerToEdit] = React.useState<PlayerReadDTO | null>(null);
  const [playerToDelete, setPlayerToDelete] = React.useState<PlayerReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (positionFilter !== "ALL") params.set("playing_position", positionFilter);
    return `/api/backend/api/v1/player/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch, positionFilter]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<PlayerReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const players = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = players.length === pageSize; 

  const confirmDelete = async () => {
    if (!playerToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/player/${playerToDelete.id}`, "DELETE");
      toast.success("Player deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete player");
    } finally {
      setPlayerToDelete(null);
    }
  };

  const openCreateForm = () => {
    setPlayerToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (player: PlayerReadDTO) => {
    setPlayerToEdit(player);
    setFormModalOpen(true);
  };

  if (error) {
    return (
      <div className="text-sm p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error fetching data: {(error as Error).message}</p>
        <Button variant="outline" size="sm" onClick={() => mutate()} className="mt-2">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-1 w-full gap-2 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search player..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          <Select 
            value={positionFilter} 
            onValueChange={(val) => {
                setPositionFilter(val);
                setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Positions</SelectItem>
              <SelectItem value="setter">Setter</SelectItem>
              <SelectItem value="outside_hitter">Outside Hitter</SelectItem>
              <SelectItem value="opposite">Opposite</SelectItem>
              <SelectItem value="middle_blocker">Middle Blocker</SelectItem>
              <SelectItem value="libero">Libero</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || positionFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(""); setPositionFilter("ALL"); setPageIndex(0); }}>
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Player
          </Button>

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

      {/* 2. TABLE */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">Nat.</TableHead>
              <TableHead className="text-right">Height / Spike</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && players.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : players.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No players found.</TableCell></TableRow>
            ) : (
              players.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.first_name} {p.last_name}
                      <div className="text-xs text-muted-foreground">{p.date_of_birth}</div>
                    </TableCell>
                    <TableCell>
                      {p.playing_position ? <Badge variant="secondary" className="font-normal">{formatPosition(p.playing_position)}</Badge> : "—"}
                    </TableCell>
                    <TableCell className="text-center font-mono uppercase">{p.nationality_code}</TableCell>
                    <TableCell className="text-right text-sm">
                      <div>{p.height_cm ? `${p.height_cm} cm` : "—"}</div>
                      <div className="text-xs text-muted-foreground">Reach: {p.spike_reach_cm ? `${p.spike_reach_cm} cm` : "—"}</div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(p)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setPlayerToDelete(p)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive opacity-80 hover:opacity-100" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 3. MODALS */}
      {formModalOpen && (
        <PlayerFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          player={playerToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!playerToDelete} onOpenChange={(open) => !open && setPlayerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the player <strong>{playerToDelete?.first_name} {playerToDelete?.last_name}</strong> from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}