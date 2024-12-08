"use client";

import EmailEditior from "@/lib/tip-tap";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";
import { api, RouterOutputs } from "@/trpc/react";
import React from "react";

const ReplyBox = () => {
  const { accountId } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const { data: ReplyDeatils } = api.mails.getEmailReplyDetails.useQuery({
    accountId,
    threadId: threadId ?? "",
  });

  if (!ReplyDeatils) {
    return null;
  }

  return <Component ReplyDeatils={ReplyDeatils} />;
};

const Component = ({
  ReplyDeatils,
}: {
  ReplyDeatils: RouterOutputs["mails"]["getEmailReplyDetails"];
}) => {
  const { accountId } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);

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

  const handleSend = () => {};

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

export default ReplyBox;
