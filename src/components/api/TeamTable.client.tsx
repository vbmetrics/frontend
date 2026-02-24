"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, FilterX, Plus, Pencil, Trash2, Loader2, Globe, Mail, Shield } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- TYPES ---

export type TeamType = "club" | "national";

export interface TeamReadDTO {
  id: string;
  name: string;
  team_type: TeamType;
  logo_url?: string | null;
  website_url?: string | null;
  email?: string | null;
  country_code: string;
  home_arena_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Minimalny typ dla Areny potrzebny do dropdownu
export interface ArenaDropdownDTO {
  id: string;
  name: string;
  city?: string | null;
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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- COMPONENT: TEAM FORM (CREATE / UPDATE) ---

function TeamFormDialog({
  isOpen,
  onClose,
  team,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  team: TeamReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Pobieramy listę aren (limit 1000 powinien wystarczyć na potrzeby dropdownu)
  const { data: arenas, isLoading: arenasLoading } = useSWR<ArenaDropdownDTO[]>(
    isOpen ? "/api/backend/api/v1/arena/?limit=1000" : null,
    fetcher
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      name: formData.get("name") as string,
      team_type: formData.get("team_type") as TeamType,
      country_code: (formData.get("country_code") as string).toUpperCase(),
    };

    const email = formData.get("email") as string;
    data.email = email ? email : null;

    const website = formData.get("website_url") as string;
    data.website_url = website ? website : null;

    const logo = formData.get("logo_url") as string;
    data.logo_url = logo ? logo : null;

    // Obsługa wyboru areny - jeśli "none", wysyłamy null
    const arena = formData.get("home_arena_id") as string;
    data.home_arena_id = (arena && arena !== "none") ? arena : null;

    try {
      if (team) {
        await apiCall(`/api/backend/api/v1/team/${team.id}`, "PATCH", data);
        toast.success("Team updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/team/`, "POST", data);
        toast.success("Team created successfully");
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
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Add New Team"}</DialogTitle>
          <DialogDescription>
            {team ? "Update the details for this team." : "Fill in the details to create a new team."}
          </DialogDescription>
        </DialogHeader>

        <form id="team-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" defaultValue={team?.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_type">Type <span className="text-red-500">*</span></Label>
              <Select name="team_type" defaultValue={team?.team_type || "club"} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country_code">Country (ISO 2) <span className="text-red-500">*</span></Label>
              <Input id="country_code" name="country_code" placeholder="PL, IT, US..." minLength={2} maxLength={2} defaultValue={team?.country_code} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="contact@team.com" defaultValue={team?.email || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" name="website_url" type="url" placeholder="https://..." defaultValue={team?.website_url || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" type="url" placeholder="https://..." defaultValue={team?.logo_url || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home_arena_id">Home Arena</Label>
            <Select name="home_arena_id" defaultValue={team?.home_arena_id || "none"} disabled={arenasLoading}>
              <SelectTrigger>
                <SelectValue placeholder={arenasLoading ? "Loading arenas..." : "Select home arena"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (No home arena)</SelectItem>
                {arenas?.map((arena) => (
                  <SelectItem key={arena.id} value={arena.id}>
                    {arena.name} {arena.city ? `(${arena.city})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="team-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {team ? "Save Changes" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function TeamTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [teamToEdit, setTeamToEdit] = React.useState<TeamReadDTO | null>(null);
  const [teamToDelete, setTeamToDelete] = React.useState<TeamReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (typeFilter !== "ALL") params.set("team_type", typeFilter);
    return `/api/backend/api/v1/team/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch, typeFilter]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<TeamReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const teams = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = teams.length === pageSize; 

  const confirmDelete = async () => {
    if (!teamToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/team/${teamToDelete.id}`, "DELETE");
      toast.success("Team deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete team");
    } finally {
      setTeamToDelete(null);
    }
  };

  const openCreateForm = () => {
    setTeamToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (team: TeamReadDTO) => {
    setTeamToEdit(team);
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
              placeholder="Search team name..."
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
              <SelectValue placeholder="Team Type" />
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
            Add Team
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
              <TableHead className="w-75">Team Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Nat.</TableHead>
              <TableHead className="text-center">Contact & Links</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && teams.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : teams.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No teams found.</TableCell></TableRow>
            ) : (
              teams.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage src={t.logo_url || ""} alt={t.name} />
                          <AvatarFallback className="bg-muted text-xs"><Shield className="h-4 w-4 text-muted-foreground"/></AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{t.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.team_type === "national" ? "default" : "outline"} className="capitalize">
                        {t.team_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono uppercase">{t.country_code}</TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            {t.website_url ? (
                                <a href={t.website_url} target="_blank" rel="noopener noreferrer" title="Website" className="hover:text-primary">
                                    <Globe className="h-4 w-4" />
                                </a>
                            ) : <Globe className="h-4 w-4 opacity-20" />}
                            
                            {t.email ? (
                                <a href={`mailto:${t.email}`} title={t.email} className="hover:text-primary">
                                    <Mail className="h-4 w-4" />
                                </a>
                            ) : <Mail className="h-4 w-4 opacity-20" />}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(t)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTeamToDelete(t)} title="Delete">
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
        <TeamFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          team={teamToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team <strong>{teamToDelete?.name}</strong>. This action cannot be undone.
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