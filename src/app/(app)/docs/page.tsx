import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Book,
  Code2,
  Lightbulb,
  Terminal,
  Info,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

// --- MOCK DATA: Struktura nawigacji dokumentacji ---
const DOCS_NAV = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "#intro", active: true },
      { title: "Installation", href: "#install" },
      { title: "Architecture", href: "#arch" },
    ],
  },
  {
    title: "Data Management",
    items: [
      { title: "Importing Matches", href: "#import" },
      { title: "Managing Players", href: "#players" },
      { title: "Scouting Logic", href: "#scouting" },
    ],
  },
  {
    title: "Analytics API",
    items: [
      { title: "Authentication", href: "#auth" },
      { title: "Fetch Statistics", href: "#endpoints" },
      { title: "Webhooks", href: "#webhooks" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        description="Guides, references, and examples for integrating and using vbmetrics."
        breadcrumbs={[{ label: "Docs" }]}
      />

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* 2. LOCAL SIDEBAR (Sticky Navigation) */}
        <aside className="hidden md:block w-60 shrink-0 sticky top-24">
          <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
            <div className="flex flex-col gap-6">
              {DOCS_NAV.map((section, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <h4 className="font-bold text-sm text-foreground">{section.title}</h4>
                  {section.items.map((item, j) => (
                    <Link
                      key={j}
                      href={item.href}
                      className={`text-sm transition-colors hover:text-primary ${
                        item.active
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-10">
          
          {/* Quick Access Cards */}
          <section className="grid gap-4 md:grid-cols-2">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-500" /> API Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore endpoints to fetch raw match data programmatically.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Book className="h-4 w-4 text-emerald-500" /> User Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn how to generate scouting reports and manage teams.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* --- CONTENT BLOCKS --- */}

          {/* Section: Introduction */}
          <section id="intro" className="space-y-4">
            <div className="space-y-2">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
                Introduction
              </h2>
              <Separator />
            </div>
            <p className="leading-7 text-muted-foreground">
              Welcome to the <strong>vbmetrics</strong> documentation. This platform is designed to help volleyball coaches, scouts, and analysts manage data efficiently. Whether you are importing DataVolley files or tracking player development, this guide will help you get started.
            </p>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This documentation is for the beta version (v0.8.0). Some features described here might be subject to change.
              </AlertDescription>
            </Alert>
          </section>

          {/* Section: Architecture */}
          <section id="arch" className="space-y-4">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              System Architecture
            </h3>
            <p className="leading-7 text-muted-foreground">
              The platform operates on a modular architecture, separating data ingestion from analysis.
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
              <li><strong>Core API:</strong> Handles authentication and data storage (PostgreSQL).</li>
              <li><strong>Analysis Engine:</strong> Processes raw play-by-play data into meaningful stats.</li>
              <li><strong>Frontend:</strong> Next.js application for visualization (this panel).</li>
            </ul>
          </section>

          {/* Section: API Example */}
          <section id="auth" className="space-y-4">
            <div className="space-y-2">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Authentication
              </h2>
              <Separator />
            </div>
            <p className="leading-7 text-muted-foreground">
              All API requests must be authenticated using a Bearer Token. You can generate a token in the <Link href="/settings" className="text-primary hover:underline">Settings</Link> panel.
            </p>

            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Terminal className="h-3 w-3" /> bash
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-xs">Copy</Button>
              </div>
              <code className="text-sm font-mono block overflow-x-auto text-foreground">
                curl -X POST https://api.vbmetrics.com/v1/data/matches \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-d '&#123; "match_id": "m-1024" &#125;'
              </code>
            </div>
          </section>

          {/* Section: Definitions */}
          <section id="definitions" className="space-y-4">
             <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Metric Definitions
            </h3>
             <Card>
                <TableContentMock />
             </Card>
          </section>

           <div className="pt-10 flex justify-between">
              <Button variant="outline" disabled>
                  Previous
              </Button>
              <Button variant="outline" className="gap-2">
                  Next: Data Management <ChevronRight className="h-4 w-4" />
              </Button>
           </div>

        </main>
      </div>
    </div>
  );
}

// Pomocniczy komponent tabeli definicji
function TableContentMock() {
    return (
        <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Term</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Definition</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Formula</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">Kill Block</td>
                        <td className="p-4 align-middle">A block that results in an immediate point.</td>
                        <td className="p-4 align-middle font-mono text-xs">count(block_win)</td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">Perfect Reception</td>
                        <td className="p-4 align-middle">Pass allowing the setter all attack options.</td>
                        <td className="p-4 align-middle font-mono text-xs">grade === '#'</td>
                    </tr>
                     <tr className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">Sideout %</td>
                        <td className="p-4 align-middle">Percentage of successful receptions leading to a point.</td>
                        <td className="p-4 align-middle font-mono text-xs">(SO_points / SO_attempts) * 100</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}