"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocalStorage } from "usehooks-ts";
import { api } from "@/trpc/react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    threadNum?: number; // Made optional initially
  }[];
}) {
  const [CurrentTab, setCurrentTab] = useLocalStorage("Current-tab", "");
  const [hydrated, setHydrated] = useState(false);
  const [accountId] = useLocalStorage("accountId", "");

  const { state } = useSidebar();

  // Queries to fetch email thread numbers
  const { data: InboxThreads } = api.mails.getEmailtypesNumber.useQuery({
    accountId,
    tab: "inbox",
  });
  const { data: SentThreads } = api.mails.getEmailtypesNumber.useQuery({
    accountId,
    tab: "sent",
  });
  const { data: DraftThreads } = api.mails.getEmailtypesNumber.useQuery({
    accountId,
    tab: "draft",
  });

  // Map thread numbers dynamically after fetching data
  const updatedData = items.map((obj) => {
    if (obj.title === "inbox") {
      return { ...obj, threadNum: InboxThreads || 0 }; // Default to 0 if data is undefined
    } else if (obj.title === "draft") {
      return { ...obj, threadNum: DraftThreads || 0 };
    } else if (obj.title === "sent") {
      return { ...obj, threadNum: SentThreads || 0 };
    }
    return obj;
  });

  // Hydrate the component after fetching data to ensure client-side rendering
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // Prevent premature rendering
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <h5>Email-Type</h5>
      </SidebarGroupLabel>
      <SidebarMenu>
        {updatedData.map((item) => (
          <section
            key={item.title}
            onClick={() => setCurrentTab(item.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`${
                  CurrentTab === item.title && state === "expanded"
                    ? "bg-paleblue"
                    : "bg-neutral-50"
                }`}
                tooltip={item.title}
              >
                <div className="flex items-center gap-16">
                  <div className="flex items-center gap-2">
                    <span className="-left-5">{item.icon}</span>
                    <span className="text-primary">{item.title}</span>
                  </div>
                  <div className="flex-center size-6 rounded-full bg-slate-300 font-inter text-xs font-semibold text-primary">
                    {item.threadNum}
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </section>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
