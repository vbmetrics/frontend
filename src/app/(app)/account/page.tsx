import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppearanceCard } from "@/components/account/AppearanceCard.client";
import { getMe } from "@/lib/api/me";
import { LanguageCard } from "@/components/account/LanguageCard.client";
import { DangerZoneCard } from "@/components/account/DangerZoneCard.client";
import { AccentCard } from "@/components/account/AccentCard.client";

type AccentState = { ok: boolean; accent?: string; error?: string };

async function setAccentAction(_prev: AccentState, formData: FormData): Promise<AccentState> {
  "use server";
  const accent = String(formData.get("accent") || "indigo");
  try {
    const jar = await cookies();
    jar.set("vbm-accent", accent, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return { ok: true, accent };
  } catch {
    return { ok: false, error: "Failed to save accent" };
  }
}

type LangState = { ok: boolean; lang?: "en" | "pl"; error?: string };

async function setLanguageAction(_prev: LangState, formData: FormData): Promise<LangState> {
  "use server";
  const lang = (formData.get("lang") || "en") as "en" | "pl";
  try {
    const jar = await cookies();
    jar.set("vbm-lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    // opcjonalnie zrevaliduj strony zależne od języka
    revalidatePath("/account");
    return { ok: true, lang };
  } catch (e) {
    return { ok: false, error: "Failed to save language" };
  }
}

export default async function AccountPage() {
  const me = await getMe();
  const jar = await cookies();
  const lang = (jar.get("vbm-lang")?.value || "en") as "en" | "pl";
  const accent = (jar.get("vbm-accent")?.value || "indigo");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account settings"
        description="Manage your profile, appearance, and language."
        breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Account" }]}
      />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div><span className="text-muted-foreground">Full name:</span> {me?.full_name ?? "—"}</div>
          <div><span className="text-muted-foreground">Email:</span> {me?.email ?? "—"}</div>
          <div><span className="text-muted-foreground">Role:</span> {me?.role ?? "—"}</div>
        </CardContent>
      </Card>

      {/* Appearance (Theme) */}
      <AppearanceCard />

      {/* Language (toast + server action) */}
      <LanguageCard defaultLang={lang} action={setLanguageAction} />

      {/* Accent (toast + server action) */}
      <AccentCard defaultAccent={accent} action={setAccentAction} />

      {/* Danger zone */}
      <DangerZoneCard />
    </div>
  );
}
