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
    const base: Crumb[] = [{ label: rootLabel, href: rootHref }];

    if (segments.length === 1 && `/${segments[0]}` === rootHref) return base;

    let acc = "";
    const rest = segments.map((seg, idx) => {
      acc += `/${seg}`;
      const isLast = idx === segments.length - 1;
      return { label: toTitle(seg), href: isLast ? undefined : acc };
    });

    const startsAtRoot = `/${segments[0]}` === rootHref;
    return startsAtRoot ? rest : [...base, ...rest];
  }, [items, pathname, rootHref, rootLabel]);

  let renderItems = autoItems;
  const needsEllipsis = autoItems.length > maxCrumbs;
  if (needsEllipsis) {
    const first = autoItems[0];
    const lastTwo = autoItems.slice(-2);
    renderItems = [first, { label: "…" }, ...lastTwo];
  }

  // KLUCZOWA ZMIANA: Filtrujemy elementy przed renderowaniem
  const finalItemsToRender = renderItems.filter(
    (c, i) => !(i === 0 && c.href === rootHref)
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Zawsze pokazujemy twardo zakodowany Root */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild href={rootHref} aria-label={`Go to ${rootLabel}`}>
            <Link href={rootHref} className="inline-flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{rootLabel}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator pojawia się tylko wtedy, gdy MAMY jakieś elementy POZA rootem */}
        {finalItemsToRender.length > 0 && <BreadcrumbSeparator />}

        {finalItemsToRender.map((crumb, i, arr) => {
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