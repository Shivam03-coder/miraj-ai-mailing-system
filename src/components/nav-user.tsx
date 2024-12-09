"use client";

import { PencilIcon } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { GetUserInfo } from "@/lib/clerk/getuserinfo";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import TooltipBtn from "./tool-tip-btn";

export function NavUser() {
  const [user, setUser] = useState<null | {
    emailAddresses: any;
    firstName: string;
  }>(null);

  const { state: SidebarState } = useSidebar();
  // "expanded" | "collapsed"

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await GetUserInfo();
      if (userInfo) {
        setUser({
          firstName: userInfo.username as string,
          emailAddresses: userInfo.useremail,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="space-y-2">
        <SidebarMenuButton
          size="lg"
          className="bg-primary text-secondary shadow-none data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {SidebarState === "collapsed" ? (
            <TooltipBtn tooltiplabel="Compose Mail">
              <span className="flex-center w-full">
                <PencilIcon size={19} className="text-secondary" />
              </span>
            </TooltipBtn>
          ) : (
            <div className="mx-auto flex items-center justify-center gap-5">
              <PencilIcon size={19} className="text-secondary" />
              <div className="flex-1 text-left font-inter text-sm font-semibold leading-tight">
                COMPOSE AI MAIL
              </div>
            </div>
          )}
        </SidebarMenuButton>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <UserButton />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.firstName}</span>
            <span className="truncate text-xs">{user?.emailAddresses}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
