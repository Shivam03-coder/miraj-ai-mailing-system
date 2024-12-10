"use client";
import EmailEditior from "@/lib/tip-tap";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";
import { api, RouterOutputs } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
const EmailReplyBox = () => {
  const { accountId } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const { data: ReplyDeatils } = api.mails.getEmailReplyDetails.useQuery({
    accountId,
    threadId: threadId!,
  });

  if (!ReplyDeatils) {
    return null;
  }

  return <Component ReplyDeatils={ReplyDeatils} />;
};

export const Component = ({
  ReplyDeatils,
}: {
  ReplyDeatils: RouterOutputs["mails"]["getEmailReplyDetails"];
}) => {
  const { threadId } = useAppSelector((state) => state.account);
  const { accountId } = useThreads();
  const { toast } = useToast();

  const [subject, setSubject] = React.useState(
    ReplyDeatils.subject.startsWith("Re:")
      ? ReplyDeatils.subject
      : `Re: ${ReplyDeatils.subject}`,
  );

  const [toValues, setToValues] = React.useState<
    { label: string; value: string }[]
  >(
    ReplyDeatils.to.map((to: any) => ({
      label: to.address ?? to.name,
      value: to.address,
    })) || [],
  );
  const [ccValues, setCcValues] = React.useState<
    { label: string; value: string }[]
  >(
    ReplyDeatils.cc.map((cc: any) => ({
      label: cc.address ?? cc.name,
      value: cc.address,
    })) || [],
  );

  React.useEffect(() => {
    if (!ReplyDeatils || !threadId) return;

    if (!ReplyDeatils.subject.startsWith("Re:")) {
      setSubject(`Re: ${ReplyDeatils.subject}`);
    }
    setToValues(
      ReplyDeatils.to.map((to) => ({
        label: to.address ?? to.name,
        value: to.address,
      })),
    );
    setCcValues(
      ReplyDeatils.cc.map((cc) => ({
        label: cc.address ?? cc.name,
        value: cc.address,
      })),
    );
  }, [ReplyDeatils, threadId]);

  const sendEmail = api.mails.sendEmails.useMutation();

  const handleSend = async (value: string) => {
    if (!ReplyDeatils) return;
    sendEmail.mutate(
      {
        accountId,
        threadId: threadId ?? undefined,
        body: value,
        subject,
        // @ts-ignore
        from: ReplyDeatils.from,
        to: ReplyDeatils.to.map((to) => ({
          name: to.name ?? to.address,
          address: to.address,
        })),
        cc: ReplyDeatils.cc.map((cc) => ({
          name: cc.name ?? cc.address,
          address: cc.address,
        })),
        // @ts-ignore
        replyTo: ReplyDeatils.from,
        inReplyTo: ReplyDeatils.id,
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
    <EmailEditior
      toValues={toValues}
      ccValues={ccValues}
      subject={subject}
      setSubject={setSubject}
      setCcValues={setCcValues}
      setToValues={setToValues}
      to={ReplyDeatils.to.map((to) => to.address)}
      isSending={false}
      handleSend={handleSend}
    />
  );
};

export default EmailReplyBox;
