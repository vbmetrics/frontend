"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, FilterX, Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
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

export type SeasonType = "club" | "national";

export interface SeasonReadDTO {
  id: string;
  name: string;
  season_type: SeasonType;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

// --- UTILS & API CALLS ---

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return (await r.json()) as SeasonReadDTO[];
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- COMPONENT: SEASON FORM (CREATE / UPDATE) ---

function SeasonFormDialog({
  isOpen,
  onClose,
  season,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  season: SeasonReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [startDate, setStartDate] = React.useState(season?.start_date || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      season_type: formData.get("season_type") as SeasonType,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
    };

    try {
      if (season) {
        await apiCall(`/api/backend/api/v1/season/${season.id}`, "PATCH", data);
        toast.success("Season updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/season/`, "POST", data);
        toast.success("Season created successfully");
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
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{season ? "Edit Season" : "Add New Season"}</DialogTitle>
          <DialogDescription>
            {season ? "Update the details for this season." : "Define a new season time frame."}
          </DialogDescription>
        </DialogHeader>

        <form id="season-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Season Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" placeholder="e.g. 2024/2025" defaultValue={season?.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season_type">Type <span className="text-red-500">*</span></Label>
            <Select name="season_type" defaultValue={season?.season_type || "club"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="club">Club</SelectItem>
                <SelectItem value="national">National</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date <span className="text-red-500">*</span></Label>
              <Input 
                id="start_date" 
                name="start_date" 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date <span className="text-red-500">*</span></Label>
              <Input 
                id="end_date" 
                name="end_date" 
                type="date" 
                min={startDate} // Frontend validation - prevents selecting a date before start_date
                defaultValue={season?.end_date} 
                required 
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="season-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {season ? "Save Changes" : "Create Season"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function SeasonTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [seasonToEdit, setSeasonToEdit] = React.useState<SeasonReadDTO | null>(null);
  const [seasonToDelete, setSeasonToDelete] = React.useState<SeasonReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (typeFilter !== "ALL") params.set("season_type", typeFilter);
    return `/api/backend/api/v1/season/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch, typeFilter]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<SeasonReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const seasons = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = seasons.length === pageSize; 

  const confirmDelete = async () => {
    if (!seasonToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/season/${seasonToDelete.id}`, "DELETE");
      toast.success("Season deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete season");
    } finally {
      setSeasonToDelete(null);
    }
  };

  const openCreateForm = () => {
    setSeasonToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (season: SeasonReadDTO) => {
    setSeasonToEdit(season);
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
              placeholder="Search season name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          <Select 
            value={typeFilter} 
            onValueChange={(val) => {
                setTypeFilter(val);
                setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Season Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="club">Club</SelectItem>
              <SelectItem value="national">National</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || typeFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(""); setTypeFilter("ALL"); setPageIndex(0); }}>
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Season
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
            <TableRow className="bg-muted">
              <TableHead className="w-62.5">Season Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time Frame</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && seasons.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : seasons.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No seasons found.</TableCell></TableRow>
            ) : (
              seasons.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-base">
                      {s.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.season_type === "national" ? "default" : "outline"} className="capitalize">
                        {s.season_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="tabular-nums">{s.start_date}</span>
                        <span>&rarr;</span>
                        <span className="tabular-nums">{s.end_date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(s)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSeasonToDelete(s)} title="Delete">
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
        <SeasonFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          season={seasonToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!seasonToDelete} onOpenChange={(open) => !open && setSeasonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the <strong>{seasonToDelete?.name}</strong> season. This action cannot be undone.
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