"use client";

import * as React from "react";
import { toast } from "sonner";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Lang = "en" | "pl";
type LangState = { ok: boolean; lang?: Lang; error?: string };

export function LanguageCard({
  defaultLang,
  action,
}: {
  defaultLang: Lang;
  action: (prev: LangState, form: FormData) => Promise<LangState>;
}) {
  const [state, formAction, pending] = useActionState<LangState, FormData>(action, { ok: false });
  const [lang, setLang] = React.useState<Lang>(defaultLang);

  React.useEffect(() => {
    if (state.ok) {
      toast.success(state.lang === "pl" ? "Zapisano język: polski" : "Language saved: English");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <RadioGroup
            name="lang"
            value={lang}
            onValueChange={(v) => setLang(v as Lang)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2 rounded-md border p-3">
              <RadioGroupItem id="lang-en" value="en" />
              <Label htmlFor="lang-en" className="cursor-pointer">English</Label>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <RadioGroupItem id="lang-pl" value="pl" />
              <Label htmlFor="lang-pl" className="cursor-pointer">Polski</Label>
            </div>
          </RadioGroup>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save language"}
          </Button>
          <p className="text-sm text-muted-foreground">
            We store your language in a cookie (<code>vbm-lang</code>). Later we’ll wire it to the app’s i18n.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
