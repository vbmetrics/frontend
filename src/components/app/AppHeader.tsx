import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { Logo } from "@/components/graphics/Logo";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme/ThemeSwitch";

export function AppHeader() {
  return (
    // ZMIANA: Dodano 'bg-background' (kolor tła z motywu) i 'border-b' (krawędź)
    // To sprawia, że header jest nieprzezroczysty i zasłania wszystko co pod niego wjedzie.
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden font-bold text-shadow-indigo-950 sm:inline md:text-xl">
            vbmetrics
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          {/* ZMIANA: Używaj Link z next/link zamiast <a> i relatywnej ścieżki */}
          <Link href="/live">
            <Button variant="start" className="text-background">
              + CREATE
            </Button>
          </Link>

          <a
            href="https://github.com/vbmetrics"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block"
          >
            <Button
              variant="ghostAccent"
              size="icon"
              aria-label="GitHub repository"
            >
              <FaGithub className="h-5 w-5" />
            </Button>
          </a>
          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}