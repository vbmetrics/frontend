import TeamTableClient from "@/components/api/TeamTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function TeamsPage() {
  return (
    <main className="space-y-6">
        <PageHeader
            title="Teams"
            description="Manage clubs and national teams, their contact details, and locations."
            breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Teams" }]}
        />
      
        <TeamTableClient />
    </main>
  );
}