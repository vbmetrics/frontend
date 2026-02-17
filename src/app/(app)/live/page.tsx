import { StartMatchForm } from "@/components/live/StartMatchForm";
import { PageHeader } from "@/components/app/PageHeader";

export default function LivePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Mode"
        description="Start a live mode session to save match data."
        breadcrumbs={[{ label: "Live Mode" }]}
      />

      <StartMatchForm />
    </div>
  );
}
