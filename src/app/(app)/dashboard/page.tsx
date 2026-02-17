import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, BarChart3, Play, Users } from "lucide-react";

const KPIS = [
  { label: "Win Rate", value: "68%", icon: BarChart3, hint: "Last 10 matches" },
  { label: "Sideout %", value: "62%", icon: Play, hint: "Avg. per rotation" },
  { label: "Break Point %", value: "35%", icon: Play, hint: "Serve phase" },
  { label: "Active Players", value: "14", icon: Users, hint: "Roster status" },
];

const RECENT_MATCHES = [
  { date: "2025-10-01", opponent: "AZS Kraków", competition: "PlusLiga", result: "3–1", home: true },
  { date: "2025-09-27", opponent: "VC Gdańsk", competition: "PlusLiga", result: "1–3", home: false },
  { date: "2025-09-20", opponent: "Olsztyn", competition: "Cup", result: "3–0", home: true },
];

const ACTIVITY = [
  { time: "Today · 10:42", text: "Tagged 18 rallies vs AZS Kraków" },
  { time: "Yesterday · 19:10", text: "Imported DataVolley file (VC Gdańsk)" },
  { time: "Mon · 08:05", text: "Updated player #7 position to Opp" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of performance, latest matches, and recent activity."
        // Breadcrumbs auto-build from /dashboard, so you can omit `breadcrumbs` here.
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Create Report</Button>
          </div>
        }
      />

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Two-column: recent matches + quick actions/activity */}
      <section className="grid gap-4 lg:grid-cols-7">
        {/* Recent matches (table) */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Recent matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-27.5">Date</TableHead>
                  <TableHead>Opponent</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_MATCHES.map((m, idx) => (
                  <TableRow key={`${m.date}-${idx}`}>
                    <TableCell className="font-medium">{m.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{m.home ? "Home" : "Away"}</Badge>
                        <span>{m.opponent}</span>
                      </div>
                    </TableCell>
                    <TableCell>{m.competition}</TableCell>
                    <TableCell className="text-right">{m.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right rail: quick start + activity */}
        <div className="grid gap-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Quick start
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm">Start Live Capture</Button>
              <Button variant="outline" size="sm">Add Match</Button>
              <Button variant="outline" size="sm">Import Data</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="text-sm">{a.text}</div>
                  <div className="whitespace-nowrap text-xs text-muted-foreground">{a.time}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
