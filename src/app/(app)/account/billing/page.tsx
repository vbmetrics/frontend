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
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Check,
  ShieldCheck,
  Download,
  Lock,
  Github,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your subscription plan, payment methods, and invoice history."
        breadcrumbs={[{ label: "Account", href: "/account" }, { label: "Billing" }]}
      />

      {/* 2. ACTIVE PLAN (Visible & Clear) */}
      <Card className="border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                Community Edition
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-100">
                  Active
                </Badge>
              </CardTitle>
              <CardDescription>
                You are currently on the free, open-source tier.
              </CardDescription>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-3xl font-bold">$0.00</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Unlimited Projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Advanced Analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> API Access
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Free Data Use
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Community Support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" /> Integration Features
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="bg-emerald-100/20 dark:bg-emerald-900/20 border-t border-emerald-500/20 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Current plan renews automatically on <span className="font-medium text-foreground">Never</span>.
          </p>
          <a
            href="https://github.com/vbmetrics"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2 border-emerald-200 dark:border-emerald-800">
              <Github className="h-4 w-4" />
              Star on GitHub
            </Button>
          </a>
        </CardFooter>
      </Card>

      {/* 3. FUTURE / PREMIUM SECTION (Blurred Overlay) */}
      <div className="relative group">
        
        {/* --- THE BLUR OVERLAY --- */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl border border-dashed border-primary/30">
          <div className="p-6 text-center space-y-4 max-w-md bg-background/80 shadow-2xl rounded-2xl border">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pro Plan Coming Soon</h3>
              <p className="text-muted-foreground text-sm mt-1">
                We are building advanced features for professional clubs, including cloud video storage, AI analysis, and multi-team management.
              </p>
            </div>
            <Button disabled className="w-full">
              Join Waitlist
            </Button>
            <p className="text-[10px] text-muted-foreground">
              The Community Edition will remain free forever.
            </p>
          </div>
        </div>

        {/* --- THE CONTENT BELOW (Mocked & Unreachable) --- */}
        <div className="space-y-8 opacity-40 pointer-events-none select-none filter grayscale-[0.5]">
          
          {/* Mock Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your credit cards and billing details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-14 rounded bg-muted flex items-center justify-center border">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expiry 12/2028</p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <Button variant="ghost" size="sm">Add Payment Method</Button>
            </CardFooter>
          </Card>

          {/* Mock Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Invoice #INV-2025-00{i}</p>
                        <p className="text-xs text-muted-foreground">Oct {10 + i}, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">$0.00</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}