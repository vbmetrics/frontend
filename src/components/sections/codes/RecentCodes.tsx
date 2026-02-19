"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Copy, PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { RallyRecord } from "@/types/live";

// Upewnij się, że RallyRecord w types/live.ts ma pole `set_number?: number`
export const columns: ColumnDef<RallyRecord>[] = [
  {
    accessorKey: "rally_number_in_set",
    header: "No.",
    cell: ({ row }) => (
      <div className="font-mono text-muted-foreground">#{row.getValue("rally_number_in_set")}</div>
    ),
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="font-bold tabular-nums">
          {r.home_score}:{r.away_score}
        </div>
      );
    },
  },
  {
    accessorKey: "raw_rally_code",
    header: "Code",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-base px-2 py-1 uppercase">
        {row.getValue("raw_rally_code")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const rally = row.original;

      return (
        <div className="flex items-center justify-end gap-1">
          {/* EDIT */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={false}
            onClick={() => {
              toast.info("Edit functionality coming soon!");
            }}
            title="Edit action (Coming soon)"
          >
            <PenLine className="h-4 w-4" />
          </Button>

          {/* AI EXPLAIN */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            disabled={false}
            onClick={() => {
              toast.info("AI Explain functionality coming soon!");
            }}
            title="Explain with AI (Coming soon)"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          {/* COPY */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              navigator.clipboard.writeText(rally.raw_rally_code);
              toast.success("Copied to clipboard");
            }}
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

interface RecentCodesTableProps {
  rallies: RallyRecord[];
  currentSetNumber: number;
  onUndo: () => void;
}

export function RecentCodesTable({ rallies, currentSetNumber, onUndo }: RecentCodesTableProps) {
  const [selectedSet, setSelectedSet] = React.useState<number>(currentSetNumber);

  React.useEffect(() => {
    setSelectedSet(currentSetNumber);
  }, [currentSetNumber]);

  // Optymalizacja: Zabezpieczamy listę dostępnych setów
  const availableSets = React.useMemo(() => {
    return Array.from(
      new Set([...rallies.map(r => r.set_number || 1), currentSetNumber])
    ).sort((a, b) => a - b);
  }, [rallies, currentSetNumber]);

  // Optymalizacja: Zabezpieczamy dane dla tabeli (nie generujemy nowej tablicy co render)
  const filteredRallies = React.useMemo(() => {
    return rallies.filter(r => (r.set_number || 1) === selectedSet);
  }, [rallies, selectedSet]);

  const table = useReactTable({
    data: filteredRallies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-3">
      {/* Pasek narzędzi / Filtrowanie */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRallies.length} actions...
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="set-filter" className="text-sm font-medium">Filter by Set:</label>
          <select
            id="set-filter"
            value={selectedSet}
            onChange={(e) => setSelectedSet(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {availableSets.map((setNum) => (
              <option key={setNum} value={setNum}>
                Set {setNum}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela z przewijaniem */}
      <div className="rounded-md border bg-card overflow-hidden">
        <div className="max-h-80 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No actions in this set yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}