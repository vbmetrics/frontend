import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Logo } from "@/components/graphics/Logo";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button.variants";
import { ThemeSwitch } from "@/components/theme/ThemeSwitch";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full header-surface isolate">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden font-bold sm:inline md:text-xl">vbmetrics</span>
        </Link>

        <nav className="relative z-10 pointer-events-auto flex items-center gap-2 text-sm font-medium">
          {/* Jeden CTA: otwiera modal logowania (z możliwością przełączenia na Sign up) */}
          <Link
            href={{ pathname: "/", query: { signin: "1", tab: "signin", next: "/dashboard" } }}
            className={cn(
              buttonVariants({ variant: "start" }),
              "hidden sm:inline-flex text-background"
            )}
          >
            Get started
          </Link>

          <a
            href="https://github.com/vbmetrics"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block"
          >
            <Button variant="ghostAccent" size="icon" aria-label="GitHub repository">
              <FaGithub className="h-[1.4rem] w-[1.4rem]" />
            </Button>
          </a>

          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}
