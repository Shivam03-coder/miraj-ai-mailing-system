"use client";
import Avatar from "react-avatar";
import { Card } from "@/components/ui/card";
import useThreads from "@/hooks/use-threads";
import { RouterOutputs } from "@/trpc/react";
import { Letter } from "react-letter";
import { formatDistanceToNow } from "date-fns";

type EmailViewCardsprops = {
  email: RouterOutputs["mails"]["getThreads"][0]["emails"][0];
};

const EmailViewCards: React.FC<EmailViewCardsprops> = ({ email }) => {
  const { account } = useThreads();
  return (
    <Card className="mb-5 flex flex-col gap-2 bg-secondary p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {!account ? (
            <Avatar
              name={email.from.name ?? email.from.address}
              email={email.from.address}
              size="32"
              textSizeRatio={2}
              round
              color="black"
            />
          ) : (
            <h6 className="w-max rounded-lg bg-yellow-300 px-2 py-1">
              {email.from.address}
            </h6>
          )}

          <h6 className="w-max rounded-lg bg-green-300 px-2 py-1">
            {email.from.name}
          </h6>
        </div>
        <h6>{formatDistanceToNow(new Date(email.sentAt ?? new Date()))}</h6>
      </div>
      <Letter html={email.body ?? ""} />
    </Card>
  );
};

export default EmailViewCards;
