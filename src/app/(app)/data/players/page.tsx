import PlayerTableClient from "@/components/api/PlayerTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function PlayersPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Players"
        description="Manage players and their details."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Players" }]}
      />
      
      <PlayerTableClient />
    </main>
  );
}