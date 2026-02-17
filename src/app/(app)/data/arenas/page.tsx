import ArenaTableClient from "@/components/api/ArenaTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function ArenasPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Arenas"
        description="Manage sports halls, capacities, and locations where matches take place."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Arenas" }]}
      />
      
      <ArenaTableClient />
    </main>
  );
}