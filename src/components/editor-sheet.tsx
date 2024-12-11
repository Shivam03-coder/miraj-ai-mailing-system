"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bot } from "lucide-react";
import EmailEditor from "@/lib/tip-tap";
import { useState } from "react";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { useToast } from "@/hooks/use-toast";

type EditorSheetProps = {
  open: boolean;
};

export function EditorSheet({ open }: EditorSheetProps) {
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [subject, setSubject] = useState<string>("");

  const { accountId, account } = useThreads();

  const sendEmail = api.mails.sendEmails.useMutation();

  const { toast } = useToast();

  const handleSend = async (value: string) => {
    if (!account) return;

    sendEmail.mutate(
      {
        accountId,
        threadId: undefined,
        body: value,
        subject,
        from: {
          name: account?.name ?? "Me",
          address: account?.emailAddress ?? "shivam850anand@gmail.com.com",
        },
        to: toValues.map((to) => ({ name: to.value, address: to.value })),
        cc: ccValues.map((cc) => ({ name: cc.value, address: cc.value })),
        replyTo: {
          name: account?.name ?? "Me",
          address: account?.emailAddress ?? "shivam850anand.com",
        },
        inReplyTo: undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "Mail Sent Successfully!",
            description: "Your email has been sent without any issues.",
            className: "text-lg bg-green-300 text-black font-inter",
          });
        },
        onError: () => {
          toast({
            title: "Mail Sending Failed!",
            description:
              "An error occurred while sending your email. Please try again.",
            className: "text-lg bg-red-300 text-black font-inter",
          });
        },
      },
    );
  };

  return (
    <Sheet open={open}>
      <SheetContent
        side="bottom"
        className="max-h-screen overflow-y-auto bg-secondary text-primary"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-inter text-xl font-semibold text-primary">
            <span className="flex items-center gap-2 font-inter text-xl font-semibold text-primary">
              MIRAJ AI MAIL COMPOSING
              <Bot size={23} />
            </span>
          </SheetTitle>
          <SheetDescription>Compose Your Emails Seamlessly.</SheetDescription>
        </SheetHeader>
        <div className="pb-4">
          <EmailEditor
            toValues={toValues}
            setToValues={setToValues}
            setCcValues={setCcValues}
            ccValues={ccValues}
            subject={subject}
            setSubject={setSubject}
            handleSend={handleSend}
            defaultToolbarExpand={true}
            isSending={false}
            to={toValues.map((to) => to.value)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
