import PlayerTeamHistoryTableClient from "@/components/api/PlayerTeamHistoryTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function PlayerTeamHistoryPage() {
  return (
    <main className="space-y-4 p-4 md:p-6">
      <PageHeader
        title="Player Team History"
        description="Manage player team assignments and history."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Players Team History" }]}
      />
      
      <PlayerTeamHistoryTableClient />
    </main>
  );
}