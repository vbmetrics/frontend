// src/app/(app)/data/matches/page.tsx

import MatchTableClient from "@/components/api/MatchTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function MatchesPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Manage Matches"
        description="Database of all matches. Create new games, edit metadata, and safely delete records."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Matches" }]}
      />
      
      <MatchTableClient />
    </main>
  );
}