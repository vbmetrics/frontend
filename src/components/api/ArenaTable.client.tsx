"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, Plus, Pencil, Trash2, Loader2, MapPin } from "lucide-react";
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

export interface ArenaReadDTO {
  id: string;
  name: string;
  city?: string | null;
  address?: string | null;
  capacity?: number | null;
  country_code: string;
  created_at?: string;
  updated_at?: string;
}

// --- UTILS & API CALLS ---

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return (await r.json()) as ArenaReadDTO[];
};

async function apiCall(url: string, method: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
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

// --- COMPONENT: ARENA FORM (CREATE / UPDATE) ---

function ArenaFormDialog({
  isOpen,
  onClose,
  arena,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  arena: ArenaReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      name: formData.get("name") as string,
      country_code: (formData.get("country_code") as string).toUpperCase(),
    };

    const city = formData.get("city") as string;
    data.city = city ? city : null;

    const address = formData.get("address") as string;
    data.address = address ? address : null;

    const capacity = formData.get("capacity") as string;
    data.capacity = capacity ? Number(capacity) : null;

    try {
      if (arena) {
        await apiCall(`/api/backend/api/v1/arena/${arena.id}`, "PATCH", data);
        toast.success("Arena updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/arena/`, "POST", data);
        toast.success("Arena created successfully");
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
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{arena ? "Edit Arena" : "Add New Arena"}</DialogTitle>
          <DialogDescription>
            {arena ? "Update the details for this arena." : "Provide details for the new sports hall."}
          </DialogDescription>
        </DialogHeader>

        <form id="arena-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Arena Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" defaultValue={arena?.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={arena?.city || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country_code">Country (ISO 2) <span className="text-red-500">*</span></Label>
              <Input id="country_code" name="country_code" placeholder="PL, IT, US..." minLength={2} maxLength={2} defaultValue={arena?.country_code} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input id="address" name="address" placeholder="Street, ZIP Code..." defaultValue={arena?.address || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" min={1} placeholder="e.g. 10000" defaultValue={arena?.capacity || ""} />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="arena-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {arena ? "Save Changes" : "Create Arena"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function ArenaTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [arenaToEdit, setArenaToEdit] = React.useState<ArenaReadDTO | null>(null);
  const [arenaToDelete, setArenaToDelete] = React.useState<ArenaReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    return `/api/backend/api/v1/arena/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<ArenaReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const arenas = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = arenas.length === pageSize; 

  const confirmDelete = async () => {
    if (!arenaToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/arena/${arenaToDelete.id}`, "DELETE");
      toast.success("Arena deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete arena");
    } finally {
      setArenaToDelete(null);
    }
  };

  const openCreateForm = () => {
    setArenaToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (arena: ArenaReadDTO) => {
    setArenaToEdit(arena);
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
              placeholder="Search arena or city..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Arena
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
              <TableHead className="w-75">Arena Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Capacity</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && arenas.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : arenas.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No arenas found.</TableCell></TableRow>
            ) : (
              arenas.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {a.city ? `${a.city}, ` : ""}<span className="uppercase font-mono text-xs">{a.country_code}</span>
                        </span>
                        {a.address && <span className="text-xs text-muted-foreground mt-0.5">{a.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                        {a.capacity ? new Intl.NumberFormat().format(a.capacity) : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(a)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setArenaToDelete(a)} title="Delete">
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
        <ArenaFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          arena={arenaToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!arenaToDelete} onOpenChange={(open) => !open && setArenaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the arena <strong>{arenaToDelete?.name}</strong>. This action cannot be undone.
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