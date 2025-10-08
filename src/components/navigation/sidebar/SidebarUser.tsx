"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BiCreditCardFront,
  BiDotsVerticalRounded,
  BiLogOut,
  BiNotification,
  BiUserCircle,
  BiBuildings,
} from "react-icons/bi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch"; // shadcn switch

type Me = { id: string; email: string; full_name: string; role?: string };

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${r.status}`);
  return (await r.json()) as Me;
};

function initialsFrom(name?: string, email?: string) {
  const display = (name || email || "").trim();
  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (display.includes("@")) return display[0]?.toUpperCase() || "U";
  return display.slice(0, 2).toUpperCase() || "U";
}

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { data: me, isLoading } = useSWR<Me>("/api/auth/me", fetcher, { revalidateOnFocus: false });

  const displayName = me?.full_name ?? (isLoading ? "Loading…" : "—");
  const email = me?.email ?? (isLoading ? "…" : "—");

  const [notifOn, setNotifOn] = React.useState<boolean>(true);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("prefs.notifications");
      if (raw != null) setNotifOn(JSON.parse(raw));
    } catch {}
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem("prefs.notifications", JSON.stringify(notifOn));
    } catch {}
  }, [notifOn]);

  async function onLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/?signin=1");
      router.refresh();
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip="Profile"
            >
              <Avatar className="h-8 w-8 rounded-full" aria-label="Profile">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {initialsFrom(me?.full_name, me?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="text-muted-foreground truncate text-xs">{email}</span>
              </div>
              <BiDotsVerticalRounded className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {initialsFrom(me?.full_name, me?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="text-muted-foreground truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/account">
                  <BiUserCircle />
                  Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/account/organizations">
                  <BiBuildings />
                  Organizations
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/account/billing">
                  <BiCreditCardFront />
                  Billing
                </Link>
              </DropdownMenuItem>

              {/* Label links to page, switch toggles local UI preference */}
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="justify-between"
              >
                <Link href="/account/notifications" className="inline-flex items-center gap-2">
                  <BiNotification />
                  Notifications
                </Link>
                <Switch
                  checked={notifOn}
                  onCheckedChange={setNotifOn}
                  onClick={(e) => e.stopPropagation()}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onSelect={(e) => {
                e.preventDefault();
                onLogout();
              }}
            >
              <BiLogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
