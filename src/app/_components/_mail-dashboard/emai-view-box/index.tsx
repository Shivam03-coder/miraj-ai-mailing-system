"use client"
import React from "react";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import ReplyBox from "./email-reply-box";
import LottieComponent from "@/lib/lottie-react";
import animationload from "../../../../../public/lottie/not_found.json";
import EmailViewCards from "./email-view-card";
import EmailViewBoxHeader from "./header";

const EmailViewbox = () => {
  const { threads } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const thread = threads.find((thr) => thr.id === threadId);

  if (!thread) {
    return (
      <div className="flex-center h-full w-full">
        <LottieComponent animationData={animationload} />
      </div>
    );
  }

  return (
    <main className="min-h-screen space-y-2 overflow-y-scroll p-3">
      <div className="flex justify-between rounded-lg border-b-2 bg-slate-200 p-4">
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
      <section className="flex max-h-[100vh] flex-1 flex-col gap-2 overflow-scroll">
        <div className="flex min-h-[400px] flex-col overflow-scroll p-1">
          {thread.emails.map((em) => (
            <EmailViewCards email={em} key={em.id} />
          ))}
        </div>
        {/* Text editior */}
        <div className="flex min-h-[400px] flex-1 flex-col overflow-scroll">
          <ReplyBox />
        </div>
      </section>
    </main>
  );
};

export default EmailViewbox;
