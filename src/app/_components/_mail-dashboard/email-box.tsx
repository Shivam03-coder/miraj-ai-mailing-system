"use client";
import React from "react";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import EmailCard from "./email-card";

const ReplyBox = () => {
  const { threads } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const thread = threads.find((thr) => thr.id === threadId);

  if (!thread) {
    return (
      <div className="p-4">
        <h5>No message selected</h5>
      </div>
    );
  }

  return (
    <main className="flex h-full flex-col gap-2">
      <div className="flex justify-between border-b-2 bg-slate-200 p-4">
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Avatar>
              <AvatarFallback className="bg-slate-500 uppercase text-white">
                {thread.emails[0]?.from.name
                  ?.split(" ")
                  .map((ch) => ch[0])
                  .join("") || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-inter text-primary">
              <h6>{thread.emails[0]?.from.name}</h6>
              <h6>{thread.emails[0]?.subject}</h6>
              <h6>Reply-To:{thread.emails[0]?.from.address}</h6>
            </div>
          </div>
        </div>
        <h6>{format(new Date(thread.emails[0]?.sentAt || ""), "PPpp")}</h6>
      </div>
      <div className="flex max-h-[calc(100vh-2.25rem)] flex-col overflow-scroll p-1">
        {thread.emails.map((em) => (
          <EmailCard email={em} key={em.id} />
        ))}
      </div>

      {/* Text editior */}
      <div className="flex flex-1 bg-slate-500"></div>
    </main>
  );
};

export default ReplyBox;
