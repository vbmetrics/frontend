// server component
import { ReactNode } from "react";
import Link from "next/link";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Left nav */}
      <aside className="col-span-12 md:col-span-3">
        <nav className="sticky top-20 space-y-1">
          <Link href="/docs" className="text-sm font-semibold opacity-70 hover:opacity-100">
            Documentation
          </Link>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <Link href="/docs/application" className="hover:text-foreground/90 text-muted-foreground">
                Application
              </Link>
            </li>
            <li>
              <Link href="/docs/coding" className="hover:text-foreground/90 text-muted-foreground">
                Coding
              </Link>
            </li>
            <li>
              <Link href="/docs/analytics" className="hover:text-foreground/90 text-muted-foreground">
                Analytics
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="col-span-12 md:col-span-9">{children}</main>
    </div>
  );
}
