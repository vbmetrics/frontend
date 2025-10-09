// src/components/account/AccentCard.client.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AccentState = { ok: boolean; accent?: string; error?: string };

const ACCENTS = [
  { id: "indigo",  swatch: "bg-[oklch(0.58_0.20_265)] dark:bg-[oklch(0.72_0.19_265)]" },
  { id: "green",   swatch: "bg-[oklch(0.62_0.16_150)] dark:bg-[oklch(0.78_0.16_150)]" },
  { id: "red",     swatch: "bg-[oklch(0.62_0.20_28)]  dark:bg-[oklch(0.78_0.18_28)]"  },
  { id: "blue",    swatch: "bg-[oklch(0.60_0.18_240)] dark:bg-[oklch(0.76_0.18_240)]" },
];

export function AccentCard({
  defaultAccent,
  action,
}: {
  defaultAccent: string;
  action: (prev: AccentState, form: FormData) => Promise<AccentState>;
}) {
  const [state, formAction, pending] = useActionState<AccentState, FormData>(action, { ok: false });
  const [accent, setAccent] = React.useState(defaultAccent);

  // natychmiastowy preview (bez reloadu)
  React.useEffect(() => {
    const html = document.documentElement;
    for (const a of ACCENTS) html.classList.remove(`accent-${a.id}`);
    html.classList.add(`accent-${accent}`);
  }, [accent]);

  React.useEffect(() => {
    if (state.ok) toast.success(`Accent saved: ${state.accent}`);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accent</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="accent" value={accent} />
          <RadioGroup
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            value={accent}
            onValueChange={setAccent}
          >
            {ACCENTS.map((a) => (
              <label
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent",
                  accent === a.id && "ring-2 ring-ring"
                )}
              >
                <RadioGroupItem value={a.id} id={`accent-${a.id}`} className="sr-only" />
                <span className={cn("h-5 w-5 rounded-full shadow", a.swatch)} />
                <span className="capitalize">{a.id}</span>
              </label>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save accent"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Accent controls brand color and default chart palette.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
