import SeasonTableClient from "@/components/api/SeasonTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function SeasonsPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Seasons"
        description="Manage seasons and their details."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Seasons" }]}
      />
      
      <SeasonTableClient />
    </main>
  );
}