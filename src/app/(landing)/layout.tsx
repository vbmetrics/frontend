import { LandingHeader } from "@/components/navigation/header/LandingHeader";
import { Footer } from "@/components/navigation/footer/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}