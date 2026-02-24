"use client";

import * as React from "react";
import useSWR from "swr";
import { FilterX, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

// --- TYPES ---

export interface StaffTeamHistoryReadDTO {
  id: string;
  role: string;
  staff_member_id: string;
  team_id: string;
  season_id: string;
  created_at?: string;
  updated_at?: string;
}

interface DictItem { id: string; name: string }
interface StaffDictItem { id: string; first_name: string; last_name: string }

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

// --- COMPONENT: FORM (CREATE / UPDATE) ---

function HistoryFormDialog({
  isOpen,
  onClose,
  historyRecord,
  onSuccess,
  staffList,
  teams,
  seasons,
}: {
  isOpen: boolean;
  onClose: () => void;
  historyRecord: StaffTeamHistoryReadDTO | null;
  onSuccess: () => void;
  staffList: StaffDictItem[];
  teams: DictItem[];
  seasons: DictItem[];
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = !!historyRecord;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (isEditing) {
        const data = { role: formData.get("role") as string };
        await apiCall(`/api/backend/api/v1/staff-team-history/${historyRecord.id}`, "PATCH", data);
        toast.success("Assignment updated successfully");
      } else {
        const data = {
          staff_member_id: formData.get("staff_member_id") as string,
          team_id: formData.get("team_id") as string,
          season_id: formData.get("season_id") as string,
          role: formData.get("role") as string,
        };
        await apiCall(`/api/backend/api/v1/staff-team-history/`, "POST", data);
        toast.success("Assignment created successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Assignment Role" : "Assign Staff to Team"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "You can only update the role. To change the team or season, delete this record and create a new one." 
              : "Create a new staff-team assignment for a specific season."}
          </DialogDescription>
        </DialogHeader>

        <form id="staff-history-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="staff_member_id">Staff Member <span className="text-red-500">*</span></Label>
            <Select name="staff_member_id" defaultValue={historyRecord?.staff_member_id} disabled={isEditing} required>
              <SelectTrigger className={isEditing ? "bg-muted" : ""}>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_id">Team <span className="text-red-500">*</span></Label>
              <Select name="team_id" defaultValue={historyRecord?.team_id} disabled={isEditing} required>
                <SelectTrigger className={isEditing ? "bg-muted" : ""}>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season_id">Season <span className="text-red-500">*</span></Label>
              <Select name="season_id" defaultValue={historyRecord?.season_id} disabled={isEditing} required>
                <SelectTrigger className={isEditing ? "bg-muted" : ""}>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Title <span className="text-red-500">*</span></Label>
            {/* ZMIANA: Zamiast Inputa mamy teraz Select z rygorystyczną listą ról */}
            <Select name="role" defaultValue={historyRecord?.role || "Assistant Coach"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select specific role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Head Coach">Head Coach</SelectItem>
                <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
                <SelectItem value="Statistician / Scout">Statistician / Scout</SelectItem>
                <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                <SelectItem value="S&C Coach">S&C Coach (Strength & Conditioning)</SelectItem>
                <SelectItem value="Team Manager">Team Manager</SelectItem>
                <SelectItem value="Medical Doctor">Medical Doctor</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="staff-history-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEditing ? "Update Role" : "Create Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function StaffTeamHistoryTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  // --- FILTER STATES ---
  const [filterStaff, setFilterStaff] = React.useState<string>("ALL");
  const [filterTeam, setFilterTeam] = React.useState<string>("ALL");
  const [filterSeason, setFilterSeason] = React.useState<string>("ALL");

  // Dictionaries fetches
  const { data: staffMembers } = useSWR<StaffDictItem[]>("/api/backend/api/v1/staff-member/?limit=1000", fetcher);
  const { data: teams } = useSWR<DictItem[]>("/api/backend/api/v1/team/?limit=1000", fetcher);
  const { data: seasons } = useSWR<DictItem[]>("/api/backend/api/v1/season/?limit=1000", fetcher);

  // Main data fetch with query params from filters
  const skip = pageIndex * pageSize;
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    
    if (filterStaff !== "ALL") params.set("staff_member_id", filterStaff);
    if (filterTeam !== "ALL") params.set("team_id", filterTeam);
    if (filterSeason !== "ALL") params.set("season_id", filterSeason);
    
    return `/api/backend/api/v1/staff-team-history/?${params.toString()}`;
  }, [pageSize, skip, filterStaff, filterTeam, filterSeason]);
  
  const { data, error, isLoading, mutate, isValidating } = useSWR<StaffTeamHistoryReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const historyList = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = historyList.length === pageSize; 

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [recordToEdit, setRecordToEdit] = React.useState<StaffTeamHistoryReadDTO | null>(null);
  const [recordToDelete, setRecordToDelete] = React.useState<StaffTeamHistoryReadDTO | null>(null);

  const getStaffName = (id: string) => {
    const s = staffMembers?.find(x => x.id === id);
    return s ? `${s.first_name} ${s.last_name}` : "Unknown Staff";
  };
  const getTeamName = (id: string) => teams?.find(x => x.id === id)?.name || "Unknown Team";
  const getSeasonName = (id: string) => seasons?.find(x => x.id === id)?.name || "Unknown Season";

  const confirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/staff-team-history/${recordToDelete.id}`, "DELETE");
      toast.success("Record deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record");
    } finally {
      setRecordToDelete(null);
    }
  };

  const openCreateForm = () => {
    setRecordToEdit(null);
    setFormModalOpen(true);
  };

  const resetFilters = () => {
    setFilterStaff("ALL");
    setFilterTeam("ALL");
    setFilterSeason("ALL");
    setPageIndex(0);
  };

  if (error) {
    return (
      <div className="text-sm p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error fetching data: {(error as Error).message}</p>
        <Button variant="outline" size="sm" onClick={() => mutate()} className="mt-2">Try again</Button>
      </div>
    );
  }

  const isReady = staffMembers && teams && seasons && !isLoading;
  const hasActiveFilters = filterStaff !== "ALL" || filterTeam !== "ALL" || filterSeason !== "ALL";

  return (
    <div className="space-y-4">
      {/* 1. TOOLBAR WITH FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        
        <div className="flex flex-wrap flex-1 gap-2 items-center w-full">
          <Select value={filterStaff} onValueChange={(v) => { setFilterStaff(v); setPageIndex(0); }} disabled={!staffMembers}>
            <SelectTrigger className="w-45 sm:w-55">
              <SelectValue placeholder="Filter by Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Staff</SelectItem>
              {staffMembers?.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterTeam} onValueChange={(v) => { setFilterTeam(v); setPageIndex(0); }} disabled={!teams}>
            <SelectTrigger className="w-45 sm:w-55">
              <SelectValue placeholder="Filter by Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Teams</SelectItem>
              {teams?.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSeason} onValueChange={(v) => { setFilterSeason(v); setPageIndex(0); }} disabled={!seasons}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Filter by Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Seasons</SelectItem>
              {seasons?.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={resetFilters} title="Clear all filters">
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end shrink-0">
          <Button onClick={openCreateForm} className="gap-2" disabled={!isReady}>
            <Plus className="h-4 w-4" />
            Assign Staff
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
      <div className="rounded-md border bg-card overflow-x-auto">
        <Table className="min-w-150">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Staff Member</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Specific Role</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!isReady || isLoading) && historyList.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : historyList.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No records found matching your filters.</TableCell></TableRow>
            ) : (
              historyList.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{getStaffName(h.staff_member_id)}</TableCell>
                    <TableCell>{getTeamName(h.team_id)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{getSeasonName(h.season_id)}</Badge>
                    </TableCell>
                    <TableCell>
                      {/* ZMIANA: Taki sam Badge jak w tabeli Staff Members */}
                      <Badge variant={h.role === "Head Coach" ? "default" : "outline"} className="font-normal">
                        {h.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {setRecordToEdit(h); setFormModalOpen(true)}} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setRecordToDelete(h)} title="Delete">
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
        <HistoryFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          historyRecord={recordToEdit} 
          onSuccess={() => mutate()}
          staffList={staffMembers || []}
          teams={teams || []}
          seasons={seasons || []}
        />
      )}

      <AlertDialog open={!!recordToDelete} onOpenChange={(open) => !open && setRecordToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the assignment record for this staff member.
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