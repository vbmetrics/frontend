import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartD3 } from "@/components/charts/BarChartD3";

const ROT_EFF = [
  { label: "R1", value: 0.22 },
  { label: "R2", value: 0.18 },
  { label: "R3", value: 0.25 },
  { label: "R4", value: 0.19 },
  { label: "R5", value: 0.21 },
  { label: "R6", value: 0.24 },
].map((d) => ({ label: d.label, value: Math.round(d.value * 100) })); // show %

export default function RotationsPage() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rotation efficiency (Pts/Rally)</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartD3 data={ROT_EFF} height={280} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Highlight rotations under 20% and prioritize serve targets to push them under pressure.
        </CardContent>
      </Card>
    </section>
  );
}
