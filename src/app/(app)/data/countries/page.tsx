import CountryTableClient from "@/components/api/CountryTable.client";
import { PageHeader } from "@/components/app/PageHeader";

export default function CountriesPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Countries"
        description="Manage countries and their details."
        breadcrumbs={[{ label: "Data", href: "/data" }, { label: "Countries" }]}
      />
      
      <CountryTableClient />
    </main>
  );
}