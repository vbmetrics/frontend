import { notFound } from "next/navigation";
import { apiFetchServer } from "@/lib/api/server";
import MatchSetupClient from "@/components/live/MatchSetup.client"; // <--- Zmiana
import { PageHeader } from "@/components/app/PageHeader";

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
    <div className="w-full mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title="Match Setup"
        description="Configure the match settings before starting live mode."
        breadcrumbs={[{ label: "Live Mode", href: "/live" }, { label: `Setup` }]}
      />

      <MatchSetupClient match={match} />
    </div>
  );
}