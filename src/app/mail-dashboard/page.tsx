"use clinet";

import Inbox from "@/app/_components/_mail-dashboard/in-box";
import Emailbox from "@/app/_components/_mail-dashboard/email-box";

function MaildashBoard() {
  return (
    <div className="f flex flex-1 flex-col gap-4 p-2 pt-0 lg:flex-row">
      <div className="flex-1 rounded-xl bg-white md:min-h-min">
        <Inbox />
      </div>
      <div className="flex-1 rounded-xl bg-white md:min-h-min">
        <Emailbox />
      </div>
    </div>
  );
}

export default MaildashBoard;
