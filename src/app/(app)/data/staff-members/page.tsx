import StaffMemberTableClient from "@/components/api/StaffMemberTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function StaffMembersPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Staff Members"
        description="Manage coaches, assistants, and other team personnel."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Staff Members" }]}
      />
      
      <StaffMemberTableClient />
    </main>
  );
}