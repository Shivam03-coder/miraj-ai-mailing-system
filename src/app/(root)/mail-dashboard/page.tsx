"use client";
import dynamic from "next/dynamic";
const ThreadBox = dynamic(
  () => import("@/app/_components/_mail-dashboard/thread-box"),
  { ssr: false },
);
const EmailViewbox = dynamic(
  () => import("@/app/_components/_mail-dashboard/emai-view-box"),
  { ssr: false },
);

function MaildashBoard() {
  return (
    <div className="f flex flex-1 flex-col gap-4 p-2 pt-0 lg:flex-row">
      <div className="flex-1 rounded-xl bg-white md:min-h-min">
        <ThreadBox />
      </div>
      <div className="flex-1 rounded-xl bg-white md:min-h-min">
        <EmailViewbox />
      </div>
    </div>
  );
}

export default MaildashBoard;
