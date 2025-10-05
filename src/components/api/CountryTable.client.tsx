"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type CountryReadDTO = {
  name: string;
  alpha_2_code: string;
  latitude: number;
  longitude: number;
  created_at?: string | null;
  updated_at?: string | null;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`${r.status}: ${t || r.statusText}`);
  }
  return (await r.json()) as CountryReadDTO[];
};

function formatDate(d?: string | null) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return "—";
  }
}

export default function CountryTableClient() {
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const [customOpen, setCustomOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState<string>("25");

  const skip = pageIndex * pageSize;
  const url = `/api/backend/api/v1/country?limit=${pageSize}&skip=${skip}`;

  const { data, error, isLoading, mutate, isValidating } = useSWR<CountryReadDTO[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true as any, // SWR 2 nie ma oficjalnie tego pola, ale nie szkodzi; zostawiamy dla czytelności
    }
  );

  const countries = data ?? [];
  const showingFrom = countries.length ? skip + 1 : 0;
  const showingTo = skip + countries.length;

  const canPrev = pageIndex > 0;
  const canNext = countries.length === pageSize; // brak total -> Next tylko gdy pełna strona

  function applyPageSize(n: number) {
    const sanitized = Math.max(1, Math.min(1000, Math.floor(n)));
    setPageSize(sanitized);
    setPageIndex(0);
    mutate(); // odśwież
  }

  function applyCustom() {
    const n = Number(customValue);
    if (Number.isFinite(n) && n > 0) {
      applyPageSize(n);
      setCustomOpen(false);
    }
  }

  if (error) {
    if ((error as Error).message.startsWith("401:"))
      return <p className="text-sm text-red-600">Nieautoryzowano — zaloguj się.</p>;
    return (
      <div className="text-sm">
        <p className="text-red-600 font-medium">Błąd: {(error as Error).message}</p>
        <Button variant="outline" size="sm" onClick={() => mutate()}>Spróbuj ponownie</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {isLoading ? "Ładowanie…" : `Wyświetlane: ${showingFrom}–${showingTo}`}
        </div>

        <div className="flex items-center gap-2">
          {/* Page size selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Wierszy na stronę: {pageSize}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {[5, 10, 20].map((n) => (
                <DropdownMenuItem key={n} onClick={() => applyPageSize(n)}>
                  {n}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setCustomOpen((v) => !v)}>
                Niestandardowa…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom page size popover */}
          <Popover open={customOpen} onOpenChange={setCustomOpen}>
            <PopoverTrigger asChild>
              <span className="sr-only">Ustaw niestandardowy rozmiar strony</span>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Wierszy na stronę</label>
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyCustom();
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setCustomOpen(false)}>
                    Anuluj
                  </Button>
                  <Button size="sm" onClick={applyCustom}>
                    Zastosuj
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={!canPrev || isValidating}
            >
              ← Poprzednia
            </Button>
            <span className="text-sm tabular-nums">Strona {pageIndex + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={!canNext || isValidating}
            >
              Następna →
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Państwo</TableHead>
              <TableHead>Kod</TableHead>
              <TableHead className="text-right">Szer. (lat)</TableHead>
              <TableHead className="text-right">Dł. (lon)</TableHead>
              <TableHead>Utworzono</TableHead>
              <TableHead>Aktualizacja</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading && countries.length === 0
              ? Array.from({ length: pageSize }).map((_, i) => ({
                  name: " ",
                  alpha_2_code: `skeleton-${i}`,
                  latitude: 0,
                  longitude: 0,
                  created_at: null,
                  updated_at: null,
                }))
              : countries
            ).map((c, idx) => (
              <TableRow key={c.alpha_2_code || `${c.name}-${idx}`}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="uppercase">{c.alpha_2_code}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.alpha_2_code.startsWith("skeleton")
                    ? "—"
                    : c.latitude.toFixed(2)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.alpha_2_code.startsWith("skeleton")
                    ? "—"
                    : c.longitude.toFixed(2)}
                </TableCell>
                <TableCell>{formatDate(c.created_at ?? null)}</TableCell>
                <TableCell>{formatDate(c.updated_at ?? null)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
