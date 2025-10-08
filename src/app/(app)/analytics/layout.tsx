import { PageHeader } from "@/components/app/PageHeader";
import { SectionTabs } from "@/components/app/SectionTabs";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Explore performance across rotations, serve/pass, and opponents."
        // Breadcrumbs will auto-build from /analytics/... you can pass explicit items if you want.
      />
      <SectionTabs
        tabs={[
          { href: "/analytics", label: "Overview" },
          { href: "/analytics/rotations", label: "Rotations" },
          { href: "/analytics/serve-pass", label: "Serve/Pass" },
          { href: "/analytics/opponents", label: "Opponents" },
        ]}
      />
      <div className="space-y-6">{children}</div>
    </div>
  );
}
