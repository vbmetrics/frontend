import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Globe,
  Calendar,
  MapPin,
  Users,
  User,
  Shield,
  History,
  Briefcase,
  ArrowRight,
  Activity // <--- Dodana ikona
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// Konfiguracja sekcji
const DATA_SECTIONS = [
  {
    title: "Matches",
    href: "/data/matches",
    icon: Activity,
    description: "Manage match records, view results, and safely delete games.",
  },
  {
    title: "Countries",
    href: "/data/countries",
    icon: Globe,
    description: "Manage international regions, ISO codes, and coordinates.",
  },
  {
    title: "Seasons",
    href: "/data/seasons",
    icon: Calendar,
    description: "Setup competition years, leagues, and tournament dates.",
  },
  {
    title: "Arenas",
    href: "/data/arenas",
    icon: MapPin,
    description: "Database of sports venues and their capacities.",
  },
  {
    title: "Teams",
    href: "/data/teams",
    icon: Shield,
    description: "Manage clubs, national teams, and their metadata.",
  },
  {
    title: "Players",
    href: "/data/players",
    icon: User,
    description: "Player profiles, physical attributes, and positions.",
  },
  {
    title: "Player Team History",
    href: "/data/player-team-history",
    icon: History,
    description: "Track player transfers and historical team affiliations.",
  },
  {
    title: "Staff Members",
    href: "/data/staff-members",
    icon: Briefcase,
    description: "Coaches, physiotherapists, and support staff.",
  },
  {
    title: "Staff Team History",
    href: "/data/staff-team-history",
    icon: History,
    description: "Track staff member transfers and historical team affiliations.",
  },
];

export default function ManageDataPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Data"
        description="Select a category below to view, edit, or add new records to the database."
        breadcrumbs={[{ label: "Data" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DATA_SECTIONS.map((item) => (
          <Link key={item.href} href={item.href} className="group block h-full">
            <Card className="h-full transition-all hover:bg-muted/50 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <item.icon className="h-8 w-8 text-primary mb-2" />
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}