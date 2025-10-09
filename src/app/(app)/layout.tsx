import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppHeader } from "@/components/app/AppHeader";

import { AppSidebar } from "@/components/navigation/sidebar/AppSidebar";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AppHeader />
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="p-1" />
      <main className="w-full mr-20 p-12">
        {children}
      </main>
    </SidebarProvider>
    </>
  );
}
