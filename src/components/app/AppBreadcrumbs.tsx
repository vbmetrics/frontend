"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

function toTitle(label: string) {
  return label
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/**
 * If `items` is omitted we build crumbs from the current path.
 * We treat `/dashboard` as the app's "home".
 */
export function AppBreadcrumbs({
  items,
  className,
}: {
  items?: Crumb[];
  className?: string;
}) {
  const pathname = usePathname();

  const autoItems: Crumb[] = React.useMemo(() => {
    if (items && items.length) return items;
    if (!pathname) return [{ label: "Dashboard", href: "/dashboard" }];

    const segments = pathname.split("/").filter(Boolean);
    // Always start from Dashboard
    const base: Crumb[] = [{ label: "Dashboard", href: "/dashboard" }];

    if (segments[0] === "dashboard" && segments.length === 1) {
      return base; // on dashboard
    }

    let acc = "";
    const rest = segments.map((seg, idx) => {
      acc += `/${seg}`;
      const isLast = idx === segments.length - 1;
      return { label: toTitle(seg), href: isLast ? undefined : acc };
    });

    // If the first segment isn't "dashboard", keep Dashboard as root
    return segments[0] === "dashboard" ? rest : [...base, ...rest];
  }, [pathname, items]);

  const lastIdx = autoItems.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex items-center gap-1 text-muted-foreground">
        <li className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 hover:text-foreground"
            aria-label="Go to Dashboard"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>
        {autoItems
          // skip duplicated Dashboard root when auto build already includes it
          .filter((c, i) => !(i === 0 && c.href === "/dashboard"))
          .map((crumb, i) => {
            const isLast = i === lastIdx - 1; // because we filtered possibly one
            return (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
}
