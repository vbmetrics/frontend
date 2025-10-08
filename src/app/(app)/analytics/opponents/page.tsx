import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartD3 } from "@/components/charts/BarChartD3";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const OPP_SO = [
  { label: "AZS", value: 57 },
  { label: "GDA", value: 62 },
  { label: "OLS", value: 55 },
  { label: "RAD", value: 64 },
];

const TENDENCIES = [
  { team: "AZS Kraków", notes: "High pipe usage in sideout; setter dumps in R3", risk: "Medium" },
  { team: "VC Gdańsk", notes: "Serve to OH2 weak zone 5; quick to MB in transition", risk: "High" },
  { team: "Olsztyn", notes: "Back-row OPP in R1; float to seams", risk: "Low" },
];

export default function OpponentsPage() {
  return (
    <section className="grid gap-4 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Opponents sideout% (last 5 matches)</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartD3 data={OPP_SO} height={260} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Scouting notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TENDENCIES.map((t) => (
                <TableRow key={t.team}>
                  <TableCell className="font-medium">{t.team}</TableCell>
                  <TableCell>{t.notes}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        t.risk === "High" ? "destructive" : t.risk === "Medium" ? "secondary" : "outline"
                      }
                    >
                      {t.risk}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
