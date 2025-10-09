import Link from "next/link";
import { Net } from "@/components/graphics/Net";
import { buttonVariants } from "@/components/ui/button.variants";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="w-full py-20 text-center md:py-32">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
        <div className="flex justify-center">
          <Net />
        </div>

        <h2 className="mt-8 mb-8 text-4xl text-foreground md:text-4xl">
          Volleyball Analytics Made <span className="hand-drawn-highlight">Simple</span>
        </h2>

        <h1 className="mb-12 text-6xl font-extrabold tracking-tight text-foreground md:text-8xl">
          vbmetrics
        </h1>

        <p className="mx-auto mb-16 max-w-2xl text-xl text-muted-foreground md:text-2xl">
          Modern platform to gather, store and analyze volleyball statistics in real-time.
        </p>

        <Link
          href={{ pathname: "/", query: { auth: "1", tab: "signin", next: "/dashboard" } }}
          className={cn(
            buttonVariants({ variant: "start" }),
            "inline-flex items-center justify-center gap-6 px-10 py-6 text-background text-xl font-bold"
          )}
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
