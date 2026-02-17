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

export type StaffRoleType = "head_coach" | "assistant";

export interface StaffMemberReadDTO {
  id: string;
  first_name: string;
  last_name: string;
  role_type: StaffRoleType;
  nationality_code: string;
  created_at?: string;
  updated_at?: string;
}

// --- UTILS & API CALLS ---

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!r.ok) throw new Error("Failed to fetch data");
  return (await r.json()) as StaffMemberReadDTO[];
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

function formatRole(role: StaffRoleType) {
  return role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- COMPONENT: STAFF FORM (CREATE / UPDATE) ---

function StaffFormDialog({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMemberReadDTO | null;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      nationality_code: (formData.get("nationality_code") as string).toUpperCase(),
      role_type: formData.get("role_type") as StaffRoleType,
    };

    try {
      if (staff) {
        await apiCall(`/api/backend/api/v1/staff-member/${staff.id}`, "PATCH", data);
        toast.success("Staff member updated successfully");
      } else {
        await apiCall(`/api/backend/api/v1/staff-member/`, "POST", data);
        toast.success("Staff member created successfully");
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
          <DialogTitle>{staff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          <DialogDescription>
            {staff ? "Update the details for this staff member." : "Fill in the details to add a new staff member."}
          </DialogDescription>
        </DialogHeader>

        <form id="staff-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
            <Input id="first_name" name="first_name" defaultValue={staff?.first_name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name <span className="text-red-500">*</span></Label>
            <Input id="last_name" name="last_name" defaultValue={staff?.last_name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality_code">Nationality (ISO 2) <span className="text-red-500">*</span></Label>
            <Input id="nationality_code" name="nationality_code" placeholder="PL, US, IT..." minLength={2} maxLength={2} defaultValue={staff?.nationality_code} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role_type">Role <span className="text-red-500">*</span></Label>
            <Select name="role_type" defaultValue={staff?.role_type || "head_coach"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="head_coach">Head Coach</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="staff-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {staff ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN TABLE COMPONENT ---

export default function StaffMemberTableClient() {
  const [pageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");

  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [staffToEdit, setStaffToEdit] = React.useState<StaffMemberReadDTO | null>(null);
  const [staffToDelete, setStaffToDelete] = React.useState<StaffMemberReadDTO | null>(null);

  const skip = pageIndex * pageSize;
  
  const queryUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: skip.toString(),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (roleFilter !== "ALL") params.set("role_type", roleFilter);
    return `/api/backend/api/v1/staff-member/?${params.toString()}`;
  }, [pageSize, skip, debouncedSearch, roleFilter]);

  const { data, error, isLoading, mutate, isValidating } = useSWR<StaffMemberReadDTO[]>(
    queryUrl,
    fetcher,
    { keepPreviousData: true as any }
  );

  const staffList = data ?? [];
  const canPrev = pageIndex > 0;
  const canNext = staffList.length === pageSize; 

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      await apiCall(`/api/backend/api/v1/staff-member/${staffToDelete.id}`, "DELETE");
      toast.success("Staff member deleted successfully");
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete staff member");
    } finally {
      setStaffToDelete(null);
    }
  };

  const openCreateForm = () => {
    setStaffToEdit(null);
    setFormModalOpen(true);
  };

  const openEditForm = (staff: StaffMemberReadDTO) => {
    setStaffToEdit(staff);
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
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>

          <Select 
            value={roleFilter} 
            onValueChange={(val) => {
                setRoleFilter(val);
                setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="head_coach">Head Coach</SelectItem>
              <SelectItem value="assistant">Assistant</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || roleFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(""); setRoleFilter("ALL"); setPageIndex(0); }}>
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
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
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Nat.</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && staffList.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : staffList.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No staff members found.</TableCell></TableRow>
            ) : (
              staffList.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">
                      {s.first_name} {s.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.role_type === "head_coach" ? "default" : "secondary"} className="font-normal">
                        {formatRole(s.role_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono uppercase">{s.nationality_code}</TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditForm(s)} title="Edit">
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setStaffToDelete(s)} title="Delete">
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
        <StaffFormDialog 
          isOpen={formModalOpen} 
          onClose={() => setFormModalOpen(false)} 
          staff={staffToEdit} 
          onSuccess={() => mutate()} 
        />
      )}

      <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the staff member <strong>{staffToDelete?.first_name} {staffToDelete?.last_name}</strong>. This action cannot be undone.
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