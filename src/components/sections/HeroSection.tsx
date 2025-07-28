import { TbPlayVolleyball } from "react-icons/tb";

import { Net } from "@/components/graphics/Net";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    return (
        <section className="w-full py-20 text-center md:py-32">
            <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
                <div className="flex justify-center">
                    <Net />
                </div>

                <h2 className="mt-8 mb-8 text-4xl text-indigo-900 md:text-4xl">
                    Volleyball Analytics Made <span className="hand-drawn-highlight">Simple</span>
                </h2>

                <h1 className="mb-12 text-6xl font-extrabold tracking-tight text-indigo-950 md:text-8xl">
                    vbmetrics
                </h1>

                <p className="mx-auto mb-16 max-w-2xl text-xl text-shadow-indigo-900 md:text-2xl">
                    Modern platform to gather, store and analyze volleyball statistics in real-time.
                </p>
                
                <Button
                    variant="start"
                    size="lg"
                    className="h-auto items-center justify-center gap-6 px-10 py-4"
                >
                    <span className="text-2xl font-bold sm:inline">START</span>
                    <TbPlayVolleyball className="size-16 transition-all" />
                </Button>
            </div>
        </section>
    );
}
