"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalStorage } from "usehooks-ts";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon?: React.ReactNode;
    isActive?: boolean;
  }[];
}) {
  const [CurrentTab, setCurrentTab] = useLocalStorage("Current-tab", "");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <h5>Email-Type</h5>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <section
            key={item.title}
            onClick={() => setCurrentTab(item.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                className={CurrentTab === item.title ? "bg-paleblue" : ""}
                tooltip={item.title}
              >
                <span>{item.icon}</span>
                <span className="text-primary">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </section>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
