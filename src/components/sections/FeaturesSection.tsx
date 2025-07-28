import { Feature } from "@/components/sections/feature/Feature";

export function FeaturesSection() {
    return (
        <section className="w-full py-20 mb-24">
            <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
                <div className="mx-auto flex flex-wrap justify-center text-center gap-8 md:gap-12">
                    <Feature
                        icon="gather"
                        name="Gather"
                        description="Gather match data easily with our simple statistical codes."
                    />
                    <Feature
                        icon="store"
                        name="Store"
                        description="Store match data in ready-to-use format."
                    />
                    <Feature
                        icon="analyze"
                        name="Analyze"
                        description="Turn collected information into insights."
                    />
                    <Feature
                        icon="share"
                        name="Share"
                        description="Prepare strategies and share with your team."
                    />
                </div>
            </div>
        </section>
    );
}
