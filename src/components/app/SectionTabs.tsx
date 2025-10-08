"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SectionTabs({
  tabs,
}: {
  tabs: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  return (
    <div className="border-b">
      <div className="flex gap-2 px-1">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "inline-flex items-center rounded-t-md px-3 py-2 text-sm",
                active
                  ? "border-b-2 border-primary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
