import { LandingHeader } from "@/components/navigation/header/LandingHeader";
import { Footer } from "@/components/navigation/footer/Footer";
import { AuthDialog } from "@/components/auth/AuthDialog";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingHeader />
      <main>{children}</main>
      <Footer />
      <AuthDialog />
    </>
  );
}
