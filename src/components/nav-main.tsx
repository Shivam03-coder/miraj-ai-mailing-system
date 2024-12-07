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
    threadNum: number;
  }[];
}) {
  const [CurrentTab, setCurrentTab] = useLocalStorage("Current-tab", "");
  const [hydrated, setHydrated] = useState(false);
  const [accountId] = useLocalStorage("accountId", "");

  const { state } = useSidebar();

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

  const updatedData = items.map((obj) => {
    if (obj.title === "inbox") {
      return { ...obj, threadNum: InboxThreads };
    } else if (obj.title === "draft") {
      return { ...obj, threadNum: DraftThreads };
    } else if (obj.title === "sent") {
      return { ...obj, threadNum: SentThreads };
    }
    return obj;
  });

  // SETTING HYDRATED TO TRUE PREVENTS THE COMPONENT FROM RENDERING PREMATURELY ON THE SERVER.

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
        {updatedData.map((item) => (
          <section
            key={item.title}
            onClick={() => setCurrentTab(item.title)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                className={`${CurrentTab === item.title && state === "expanded" ? "bg-paleblue" : "bg-neutral-50"} `}
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
