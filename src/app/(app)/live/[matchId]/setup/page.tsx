// src/app/(app)/live/[matchId]/setup/page.tsx
import { notFound } from "next/navigation";
import { apiFetchServer } from "@/lib/api/server";

// Ta strona używa headers()/cookies() pośrednio, więc na 100% dynamic:
export const dynamic = "force-dynamic";

type PageProps = {
  // W App Routerze params jest "awaitowalne"
  params: Promise<{ matchId: string }>;
};

export default async function SetupPage({ params }: PageProps) {
  const { matchId } = await params;

  let match: any;
  try {
    // UWAGA: bezwzględny URL sklei apiFetchServer na bazie nagłówków
    match = await apiFetchServer(`/api/backend/api/v1/match/${matchId}`);
  } catch (e: any) {
    // jeśli BE zwrócił 404/401/403 — pokaż 404
    const status = e?.status ?? 0;
    if (status === 404 || status === 401 || status === 403) {
      notFound();
    }
    // w dev — inne błędy pokaż głośno
    throw e;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Match setup</h1>
        <p className="text-sm text-muted-foreground">
          Match ID: <code className="font-mono">{matchId}</code>
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-2">Match (from API)</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(match, null, 2)}</pre>
        <p className="mt-4 text-sm text-muted-foreground">
          Placeholder: gdy backend udostępni{" "}
          <code>/api/v1/match/&lt;id&gt;/state</code> i{" "}
          <code>/api/v1/match/&lt;id&gt;/lineup</code>, w tym miejscu
          wyrenderujemy formularz ustawień (P1..P6, Libero) i przejście do{" "}
          <code>/live/{matchId}/coding</code>.
        </p>
      </div>
    </div>
  );
}
