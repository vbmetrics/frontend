"use client";

import * as React from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitch } from "@/components/theme/ThemeSwitch";
import { AccentPicker } from "@/components/theme/AccentPicker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type AppSettings = {
  compactTables: boolean;
  autoRefreshMs: number;
  tooltips: boolean;
};

const KEY = "vbm_app_settings";

function load(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { compactTables: false, autoRefreshMs: 0, tooltips: true };
    return JSON.parse(raw);
  } catch {
    return { compactTables: false, autoRefreshMs: 0, tooltips: true };
  }
}

export default function AppSettingsPage() {
  const [s, setS] = React.useState<AppSettings>({ compactTables: false, autoRefreshMs: 0, tooltips: true });

  React.useEffect(() => setS(load()), []);
  React.useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold">App Settings</h1>
        <p className="text-muted-foreground">Preferences that affect this device/browser.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Theme</Label>
              <p className="text-muted-foreground text-sm">Light / Dark (remembered)</p>
            </div>
            <ThemeSwitch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Accent color</Label>
              <p className="text-muted-foreground text-sm">Used across UI highlights</p>
            </div>
            <AccentPicker />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Behavior</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Compact tables</Label>
              <p className="text-muted-foreground text-sm">Reduce paddings in data grids</p>
            </div>
            <Switch checked={s.compactTables} onCheckedChange={(v) => setS({ ...s, compactTables: !!v })} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Tooltips</Label>
              <p className="text-muted-foreground text-sm">Show helpful hints on hover</p>
            </div>
            <Switch checked={s.tooltips} onCheckedChange={(v) => setS({ ...s, tooltips: !!v })} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Auto-refresh (ms)</Label>
              <p className="text-muted-foreground text-sm">0 = off</p>
            </div>
            <Select value={String(s.autoRefreshMs)} onValueChange={(v) => setS({ ...s, autoRefreshMs: Number(v) })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Off</SelectItem>
                <SelectItem value="2000">2,000</SelectItem>
                <SelectItem value="5000">5,000</SelectItem>
                <SelectItem value="10000">10,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                toast.success("Settings saved");
              }}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
