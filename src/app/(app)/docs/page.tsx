// server component
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsHome() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Learn how to use vbmetrics. Pick a section to get started.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/docs/application">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Workspaces, organizations, teams, seasons, permissions.
            </CardContent>
          </Card>
        </Link>

        <Link href="/docs/coding">
          <Card>
            <CardHeader>
              <CardTitle>Coding</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Live mode, action codes, validation and best practices.
            </CardContent>
          </Card>
        </Link>

        <Link href="/docs/analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Charts, reports, exports and how to read them.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
