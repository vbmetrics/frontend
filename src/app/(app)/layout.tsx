import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppHeader } from "@/components/navigation/header/AppHeader";

import { AppSidebar } from "@/components/navigation/sidebar/AppSidebar";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AppHeader />
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full mr-20">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </>
  );
}
