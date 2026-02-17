// server component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/app/PageHeader";

const ITEMS = [
  {
    version: "0.3.0",
    date: "2025-10-01",
    changes: [
      "Live mode groundwork: match creation & setup flow",
      "Docs skeleton & app settings page",
      "Sidebar UX improvements",
    ],
  },
  {
    version: "0.2.0",
    date: "2025-09-15",
    changes: ["Auth polish, protected routes", "Theme & accent system"],
  },
  {
    version: "0.1.0",
    date: "2025-09-01",
    changes: ["Initial public preview"],
  },
];

export default function ChangelogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Changelog"
        description="What’s new in vbmetrics."
        breadcrumbs={[{ label: "Changelog" }]}
      />

      <div className="space-y-4">
        {ITEMS.map((it) => (
          <Card key={it.version}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <span className="mr-2">v{it.version}</span>
                <Badge variant="secondary">{it.date}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="list-disc pl-5 space-y-1">
                {it.changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
