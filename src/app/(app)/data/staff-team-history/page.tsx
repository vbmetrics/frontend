import StaffTeamHistoryTableClient from "@/components/api/StaffTeamHistoryTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function StaffTeamHistoryPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Staff Team History"
        description="Manage staff member team assignments and their historical affiliations."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Staff Team History" }]}
      />
      
      <StaffTeamHistoryTableClient />
    </main>
  );
}