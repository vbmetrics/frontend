import { notFound } from "next/navigation";
import { apiFetchServer } from "@/lib/api/server";
import MatchSetupClient from "@/components/live/MatchSetup.client"; // <--- Zmiana

export const dynamic = "force-dynamic";

export default async function SetupPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;

  let match: any;
  try {
    match = await apiFetchServer(`/api/backend/api/v1/match/${matchId}`);
  } catch (e: any) {
    if (e?.status === 404 || e?.status === 401 || e?.status === 403) notFound();
    throw e;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Match Setup</h1>
        <p className="text-sm text-muted-foreground">
          Define the starting lineups for Set 1.
        </p>
      </div>

      <MatchSetupClient match={match} />
    </div>
  );
}