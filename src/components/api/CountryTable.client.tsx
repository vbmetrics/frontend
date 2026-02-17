"use client";

import * as React from "react";
import useSWR from "swr";
import { Search, Plus, Pencil, Trash2, Loader2, Globe2 } from "lucide-react";
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

export interface CountryReadDTO {
  name: string;
  alpha_2_code: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

// --- UTILS & API CALLS ---

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return (await r.json()) as CountryReadDTO[];
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

// --- COMPONENT: COUNTRY FORM (CREATE / UPDATE) ---

function CountryFormDialog({
  isOpen,
  onClose,
  country,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  country: CountryReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      name: formData.get("name") as string,
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
    };

    try {
      if (country) {
        // Update (alpha_2_code is NOT sent in PATCH body per CountryUpdateDTO)
        await apiCall(`/api/backend/api/v1/country/${country.alpha_2_code}`, "PATCH", data);
        toast.success("Country updated successfully");
      } else {
        // Create (alpha_2_code IS required)
        data.alpha_2_code = (formData.get("alpha_2_code") as string).toUpperCase();
        await apiCall(`/api/backend/api/v1/country/`, "POST", data);
        toast.success("Country created successfully");
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
          <DialogTitle>{country ? "Edit Country" : "Add New Country"}</DialogTitle>
          <DialogDescription>
            {country ? "Update geographical details." : "Add a new country to the database."}
          </DialogDescription>
        </DialogHeader>

        <form id="country-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="alpha_2_code">Country Code (ISO 2) <span className="text-red-500">*</span></Label>
            <Input 
              id="alpha_2_code" 
              name="alpha_2_code" 
              placeholder="e.g. PL, US, IT" 
              minLength={2} 
              maxLength={2} 
              defaultValue={country?.alpha_2_code} 
              disabled={!!country} // ZABLOKOWANE podczas edycji (Primary Key)
              required 
            />
            {!!country && <p className="text-xs text-muted-foreground">Country code cannot be changed.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Country Name <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" placeholder="e.g. Poland" defaultValue={country?.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude <span className="text-red-500">*</span></Label>
              <Input 
                id="latitude" 
                name="latitude" 
                type="number" 
                step="any" // Pozwala na ułamki
                placeholder="52.23" 
                defaultValue={country?.latitude} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude <span className="text-red-500">*</span></Label>
              <Input 
                id="longitude" 
                name="longitude" 
                type="number" 
                step="any"
                placeholder="21.01" 
                defaultValue={country?.longitude} 
                required 
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="country-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {country ? "Save Changes" : "Create Country"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function CountryTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [countryToEdit, setCountryToEdit] = React.useState<CountryReadDTO | null>(null);
  const [countryToDelete, setCountryToDelete] = React.useState<CountryReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    return `/api/backend/api/v1/country/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<CountryReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const countries = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = countries.length === pageSize; 

  const confirmDelete = async () => {
    if (!countryToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/country/${countryToDelete.alpha_2_code}`, "DELETE");
      toast.success("Country deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete country");
    } finally {
      setCountryToDelete(null);
    }
  };

  const openCreateForm = () => {
    setCountryToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (country: CountryReadDTO) => {
    setCountryToEdit(country);
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
              placeholder="Search country..."
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
            Add Country
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
              <TableHead className="w-25 text-center">Code</TableHead>
              <TableHead>Country Name</TableHead>
              <TableHead className="text-right">Coordinates (Lat, Lng)</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && countries.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : countries.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No countries found.</TableCell></TableRow>
            ) : (
              countries.map((c) => (
                  <TableRow key={c.alpha_2_code}>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono uppercase text-sm">
                        {c.alpha_2_code}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-base">
                      {c.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                        <Globe2 className="h-4 w-4" />
                        <span className="tabular-nums">{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(c)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setCountryToDelete(c)} title="Delete">
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
        <CountryFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          country={countryToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!countryToDelete} onOpenChange={(open) => !open && setCountryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{countryToDelete?.name}</strong>. If this country is linked to any players or teams, the deletion might fail or cause data issues.
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