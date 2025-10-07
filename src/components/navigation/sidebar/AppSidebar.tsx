import Link from "next/link";
import { Home, Search, Settings, Send, BookText, Database } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarUser } from "@/components/navigation/sidebar/SidebarUser";

const itemsApp = [
  { title: "Home",        url: "/dashboard", icon: Home },
  { title: "Manage Data", url: "/data",      icon: Database },
  { title: "Search",      url: "/search",    icon: Search },     // adjust when ready
  { title: "Settings",    url: "/settings",  icon: Settings },   // adjust when ready
];

const itemsHelp = [
  { title: "Feedback",      url: "#", icon: Send },
  { title: "Documentation", url: "#", icon: BookText },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="pt-0 md:pt-10">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsApp.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsHelp.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
