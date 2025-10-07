"use client";

import * as React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  BiCreditCardFront,
  BiDotsVerticalRounded,
  BiLogOut,
  BiNotification,
  BiUserCircle,
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

type Me = {
  id: string;
  email: string;
  full_name: string;         // ← matches your backend
  role?: string;
};

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`${r.status}`);
  return (await r.json()) as Me;
};

function initialsFrom(name?: string, email?: string) {
  const display = name?.trim() || email || "";
  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (display.includes("@")) return display[0]?.toUpperCase() || "U";
  return display.slice(0, 2).toUpperCase() || "U";
}

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { data: me, error, isLoading } = useSWR<Me>("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
  });

  const displayName = me?.full_name ?? (isLoading ? "Loading…" : "—");
  const email = me?.email ?? (isLoading ? "…" : "—");

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
            >
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <BiUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <BiCreditCardFront />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <BiNotification />
                Notifications
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
