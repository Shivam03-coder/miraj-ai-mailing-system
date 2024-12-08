import Inbox from "@/app/_components/_mail-dashboard/inbox";
import ReplyBox from "@/app/_components/_mail-dashboard/email-box";
import ReplyboxHeader from "@/app/_components/_mail-dashboard/email-header";

function MaildashBoard() {
  return (
    <div className="f flex flex-1 flex-col gap-4 p-2 pt-0 lg:flex-row">
      <div className=" flex-1 rounded-xl bg-white md:min-h-min">
        <Inbox />
      </div>
      <div className="h-[100vh] flex-1 overflow-y-scroll rounded-xl bg-white md:min-h-min">
        <ReplyboxHeader />
        <ReplyBox />
      </div>
    </div>
  );
}

export default MaildashBoard;
