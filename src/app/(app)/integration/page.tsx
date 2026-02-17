import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileSpreadsheet,
  Database,
  Link as LinkIcon,
  FileUp,
  Construction,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// Konfiguracja kafelków integracji
const INTEGRATIONS = [
  {
    id: "csv",
    title: "Import CSV",
    description: "Upload raw data exported from DataVolley or VolleyStation via CSV files.",
    icon: FileSpreadsheet,
    status: "progress", // planning | progress
    eta: "Q2 2026",
  },
  {
    id: "db",
    title: "Connect Database",
    description: "Direct connection to external SQL (PostgreSQL/MySQL) or NoSQL databases.",
    icon: Database,
    status: "planning",
    eta: "Q3 2026",
  },
  {
    id: "url",
    title: "Extract URL",
    description: "Scrape public match statistics directly from league websites via URL.",
    icon: LinkIcon,
    status: "planning", // Ten jeden wyróżnimy jako "W trakcie prac"
    eta: "Late Feb 2026",
  },
  {
    id: "report",
    title: "Load Report",
    description: "Parse official PDF match reports or VIS JSON files automatically.",
    icon: FileUp,
    status: "planning",
    eta: "Q2 2026",
  },
];

export default function IntegrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Integration"
        description="Connect external data sources to automate your scouting workflow."
        breadcrumbs={[{ label: "Integration" }]}
      />

      {/* 2. GLOBAL ALERT */}
      <Alert className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
        <Construction className="h-4 w-4" />
        <AlertTitle>Module Under Construction</AlertTitle>
        <AlertDescription>
          We are currently building robust connectors. These features will be available in upcoming updates.
        </AlertDescription>
      </Alert>

      {/* 3. GRID OF TOOLS */}
      <div className="grid gap-6 md:grid-cols-2">
        {INTEGRATIONS.map((tool) => (
          <Card 
            key={tool.id} 
            className={`relative overflow-hidden border-dashed ${
              tool.status === 'planning' ? 'opacity-70 bg-muted/30' : 'border-primary/40 bg-muted/10'
            }`}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tool.status === 'progress' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <tool.icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    {tool.status === 'progress' && (
                        <span className="text-xs font-medium text-primary flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" /> In Development
                        </span>
                    )}
                </div>
              </div>
              <Badge variant={tool.status === 'progress' ? "default" : "secondary"}>
                {tool.status === 'progress' ? "Coming Soon" : "Planned"}
              </Badge>
            </CardHeader>
            
            <CardContent className="mt-4">
              <CardDescription className="text-base">
                {tool.description}
              </CardDescription>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center border-t pt-4 bg-muted/20">
                <span className="text-xs text-muted-foreground font-mono">
                    ETA: {tool.eta}
                </span>
                <Button disabled variant="ghost" size="sm" className="gap-2">
                    Configure
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>

            {/* Opcjonalnie: Nakładka "Coming Soon" dla kafelków 'planning' */}
            {tool.status === 'planning' && (
                <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] z-10 pointer-events-none" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}