// src/components/account/AppearanceCard.client.tsx
"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={theme ?? "system"} onValueChange={(v) => setTheme(v as any)} className="grid sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id="theme-light" value="light" />
            <Label htmlFor="theme-light" className="cursor-pointer">Light</Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id="theme-dark" value="dark" />
            <Label htmlFor="theme-dark" className="cursor-pointer">Dark</Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id="theme-system" value="system" />
            <Label htmlFor="theme-system" className="cursor-pointer">System</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Theme preference is saved in your browser. You can also expose it as an account setting later.
        </p>
      </CardContent>
    </Card>
  );
}
