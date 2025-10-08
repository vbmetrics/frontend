import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartD3 } from "@/components/charts/BarChartD3";
import { LineChartD3 } from "@/components/charts/LineChartD3";
import { Badge } from "@/components/ui/badge";

const ROTATION_SO = [
  { label: "R1", value: 58 },
  { label: "R2", value: 64 },
  { label: "R3", value: 60 },
  { label: "R4", value: 66 },
  { label: "R5", value: 59 },
  { label: "R6", value: 63 },
];

const POINT_DIFF = [
  { x: "Set 1", y: 3 },
  { x: "Set 2", y: -4 },
  { x: "Set 3", y: 6 },
  { x: "Set 4", y: 1 },
];

export default function AnalyticsOverviewPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle>Sideout% by rotation</CardTitle>
            <Badge variant="secondary">Last 10 matches</Badge>
          </CardHeader>
          <CardContent>
            <BarChartD3 data={ROTATION_SO} height={260} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Point differential per set</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartD3 data={POINT_DIFF} height={260} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
