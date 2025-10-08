import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StackedBarD3 } from "@/components/charts/StackedBarD3";

const PASS_DISTR = [
  { label: "OH1", perfect: 22, good: 18, medium: 9, poor: 6 },
  { label: "OH2", perfect: 15, good: 20, medium: 12, poor: 8 },
  { label: "LIB", perfect: 30, good: 25, medium: 7, poor: 3 },
  { label: "OPP", perfect: 6,  good: 10, medium: 11, poor: 12 },
];
const KEYS = ["perfect", "good", "medium", "poor"];

export default function ServePassPage() {
  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Pass distribution by receiver</CardTitle>
        </CardHeader>
        <CardContent>
          <StackedBarD3 data={PASS_DISTR} keys={KEYS} height={280} />
        </CardContent>
      </Card>
    </section>
  );
}
