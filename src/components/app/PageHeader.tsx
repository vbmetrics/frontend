import * as React from "react";
import { AppBreadcrumbs } from "@/components/app/AppBreadcrumbs";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs?: React.ComponentProps<typeof AppBreadcrumbs>["items"];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 border-b pb-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <AppBreadcrumbs items={breadcrumbs} />
    </div>
  );
}
