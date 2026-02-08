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
} from "lucide-react";

// Konfiguracja sekcji - łatwo dodać nowe w przyszłości
const DATA_SECTIONS = [
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
    title: "Staff Members",
    href: "/data/staff-members",
    icon: Briefcase,
    description: "Coaches, physiotherapists, and support staff.",
  },
  {
    title: "Player Team History",
    href: "/data/player-team-history",
    icon: History,
    description: "Track player transfers and historical team affiliations.",
  },
];

export default function ManageDataPage() {
  return (
    <div className="space-y-6">
      {/* Nagłówek strony */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Manage Data</h1>
        <p className="text-muted-foreground">
          Select a category below to view, edit, or add new records to the
          database.
        </p>
      </div>

      {/* Grid z kartami */}
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