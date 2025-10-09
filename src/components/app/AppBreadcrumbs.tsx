"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; href?: string };

function toTitle(label: string) {
  return decodeURIComponent(label)
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/**
 * Shadcn breadcrumb with auto-build from path.
 * - `items`: opcjonalnie nadpisuje auto-crumbs
 * - `rootLabel`/`rootHref`: etykieta i URL dla korzenia (domyślnie Dashboard)
 * - `maxCrumbs`: jeśli ścieżka dłuższa, zwinie środek do ellipsis
 */
export function AppBreadcrumbs({
  items,
  rootLabel = "Dashboard",
  rootHref = "/dashboard",
  maxCrumbs = 5,
}: {
  items?: Crumb[];
  rootLabel?: string;
  rootHref?: string;
  maxCrumbs?: number;
}) {
  const pathname = usePathname();

  const autoItems: Crumb[] = React.useMemo(() => {
    if (items && items.length) return items;
    if (!pathname) return [{ label: rootLabel, href: rootHref }];

    const segments = pathname.split("/").filter(Boolean);

    // Zawsze zaczynamy od korzenia (Dashboard)
    const base: Crumb[] = [{ label: rootLabel, href: rootHref }];

    // /dashboard -> tylko root
    if (segments.length === 1 && `/${segments[0]}` === rootHref) return base;

    let acc = "";
    const rest = segments.map((seg, idx) => {
      acc += `/${seg}`;
      const isLast = idx === segments.length - 1;
      return { label: toTitle(seg), href: isLast ? undefined : acc };
    });

    // Jeśli pierwszy segment nie jest równy rootHref, dodaj korzeń na start
    const startsAtRoot = `/${segments[0]}` === rootHref;
    return startsAtRoot ? rest : [...base, ...rest];
  }, [items, pathname, rootHref, rootLabel]);

  // Collapsing (ellipsis) gdy za dużo segmentów
  let renderItems = autoItems;
  const needsEllipsis = autoItems.length > maxCrumbs;
  if (needsEllipsis) {
    // zachowaj: pierwszy, przedostatni, ostatni; resztę zwiń
    const first = autoItems[0];
    const lastTwo = autoItems.slice(-2);
    renderItems = [first, { label: "…" }, ...lastTwo];
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Ikona Home/Root */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild href={rootHref} aria-label={`Go to ${rootLabel}`}>
            <Link href={rootHref} className="inline-flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{rootLabel}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator po root */}
        {renderItems.length > 0 && <BreadcrumbSeparator />}

        {renderItems
          // nie dubluj root, jeśli już pokazaliśmy go wyżej
          .filter((c, i) => !(i === 0 && c.href === rootHref))
          .map((crumb, i, arr) => {
            const isLast = i === arr.length - 1;
            const isEllipsis = crumb.label === "…";

            if (isEllipsis) {
              return (
                <React.Fragment key={`ellipsis-${i}`}>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={`${crumb.label}-${i}`}>
                <BreadcrumbItem>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
