import Link from "next/link";
import {
  Home,
  Settings,
  BarChart3,
  Users,
  Database,
  ClipboardList,
  CalendarClock,
  PlugZap,
  BookText,
  History, // changed icon for Changelog
} from "lucide-react";

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

import { OrgTeamSeasonSwitchers } from "@/components/navigation/sidebar/OrgTeamSeasonSwitchers";
import { StatusDots } from "@/components/navigation/sidebar/StatusDots";
import { SidebarUser } from "@/components/navigation/sidebar/SidebarUser";

const itemsApp = [
  { title: "Dashboard",   url: "/dashboard",    icon: Home },
  { title: "Matches",     url: "/matches",      icon: CalendarClock },
  { title: "Scouting",    url: "/scouting",     icon: ClipboardList },
  { title: "Players",     url: "/players",      icon: Users },
  { title: "Analytics",   url: "/analytics",    icon: BarChart3 },
  { title: "Data",        url: "/data",         icon: Database },
  { title: "Integration", url: "/integrations", icon: PlugZap },
  { title: "Settings",    url: "/settings",     icon: Settings },
];

const itemsHelp = [
  { title: "Feedback",      url: "/help/feedback",  icon: BookText },
  { title: "Documentation", url: "/help/docs",      icon: BookText },
  { title: "Changelog",     url: "/help/changelog", icon: History }, // changed here
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="group/sidebar pt-0 md:pt-10">
      <SidebarHeader />

      <SidebarContent>
        {/* Context switchers (expand vs. icon-only handled inside) */}
        <OrgTeamSeasonSwitchers />

        {/* Application */}
        <SidebarGroup>
          {/* Status dots ABOVE the label; hide in icon mode */}
          <StatusDots className="group-data-[collapsible=icon]/sidebar:hidden" />

          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {itemsApp.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} aria-label={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help */}
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsHelp.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} aria-label={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
