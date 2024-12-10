"use client";
import { Card } from "@/components/ui/card";
import useThreads from "@/hooks/use-threads";
import { format, formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setThreadId } from "@/store/states";
import LottieComponent from "@/lib/lottie-react";
import ThreadSerachInput from "./thread-search-input";

// Optimized labelChecker function using a Map for better performance
const labelChecker = (label: string) => {
  const labelColors = new Map([
    ["inbox", "bg-teal-500"],
    ["important", "bg-yellow-500"],
    ["unread", "bg-gray-400"],
  ]);

  return labelColors.get(label) || "bg-gray-300";
};

const ThreadCards = () => {
  const { threads, isFetching } = useThreads();
  const dispatch = useAppDispatch();
  const threadId = useAppSelector((state) => state.account.threadId);

  const threadsGroup = threads?.reduce(
    (acc, thread) => {
      const date: string = format(
        thread.emails[0]?.sentAt ?? new Date(),
        "yyyy-MM-dd",
      );

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);

      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  if (!threads || threads.length === 0 || isFetching) {
    return (
      <div className="flex-center h-screen w-full flex-col gap-3">
        <LottieComponent />
        <h5>WE ARE GETTING YOUR NEW MAILS.....</h5>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-4 overflow-y-scroll">
      <ThreadSerachInput />
      {Object.entries(threadsGroup).map(([date, thread]) => (
        <div key={date}>
          <span className="te rounded bg-secondary px-2 py-1">{date}</span>
          {thread.map((thr) => {
            const lastEmail = thr.emails.at(-1);

            return (
              <Card
                onClick={() => dispatch(setThreadId(thr.id))}
                key={thr.id}
                className={`my-3 flex cursor-pointer flex-col gap-4 bg-secondary p-4 text-primary transition-all hover:bg-paleblue ${threadId === thr.id ? "bg-paleblue" : "bg-secondary"}`}
              >
                <div className="flex w-full justify-between">
                  <div className="rounded-lg bg-primary px-2 text-left text-secondary">
                    {lastEmail?.from.name || "Anonymous mail"}
                  </div>
                  <div className="flex-center rounded-full bg-green-300 px-2 font-inter text-sm">
                    {formatDistanceToNow(lastEmail?.sentAt ?? new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="font-inter text-sm font-medium">
                  {thr.subject}
                </div>
                <div
                  className="font-inter text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(lastEmail?.bodySnippet ?? "", {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                />
                {thr.emails[0]?.subject.length && (
                  <div className="flex gap-2">
                    {thr.emails[0]?.sysLabels.map((label) => (
                      <div
                        key={label}
                        className={`${labelChecker(label)} rounded px-1`}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ThreadCards;
