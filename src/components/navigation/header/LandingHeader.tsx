import Link from "next/link";

import { Moon, Sun } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Logo } from "@/components/graphics/Logo";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-navbar backdrop-blur-sm">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 md:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    <span className="hidden font-bold text-shadow-indigo-950 sm:inline md:text-xl">
                        vbmetrics
                    </span>
                </Link>

                <nav className="flex items-center gap-2 text-sm font-medium">
                    {/* TODO: Sign in/up cards, for test only it links to */}
                    <a
                        href="http://localhost:3000/dashboard"
                    >
                    <Button variant="navbar" className="hidden text-indigo-950 sm:flex">
                        Sign In
                    </Button>
                    </a>
                    <Button variant="start" className="text-background">
                        Sign Up
                    </Button>
                    <a
                        href="https://github.com/vbmetrics"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-block"
                    >
                        <Button variant="navbar" size="icon" className="text-indigo-950">
                            <FaGithub className="h-[1.4rem] w-[1.4rem]" />
                        </Button>
                    </a>
                    {/* TODO: dark/light mode */}
                    <Button variant="navbar" size="icon" className="text-indigo-950">
                        <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
