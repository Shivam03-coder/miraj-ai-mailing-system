"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { BotIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { readStreamableValue } from "ai/rsc";
import { handlePromptWithContext } from "@/lib/gemini-ai/action";
import { api } from "@/trpc/react";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";

type AiComposeBtnProps = {
  isComposing: boolean;
  onGenerate: (token: string) => void;
};

const AiComposeBtn: React.FC<AiComposeBtnProps> = ({
  isComposing,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { accountId } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const {
    data: context,
    error,
    isLoading,
  } = api.mails.getMailContext.useQuery({
    accountId,
    threadId: threadId || "",
  });

  if (isLoading) {
    console.log("Loading context...");
  } else if (error) {
    console.error("Error fetching context:", error);
  } else {
    console.log("🚀 ~ context:", context?.subject);
  }

  const aiGenerate = async () => {
    setLoading(true);
    try {
      const response = await handlePromptWithContext(
        prompt,
        (context?.subject as string) ?? "",
      );
      if (response) {
        onGenerate(response);
      }
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-1 text-secondary"
          aria-label="Open AI Mail Composer"
        >
          <BotIcon size={19} />
        </span>
      </DialogTrigger>
      <DialogContent className="bg-secondary sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="font-inter text-xl font-semibold">
              MIRAJ AI MAIL COMPOSING
            </span>
          </DialogTitle>
        </DialogHeader>
        <Textarea
          className="rounded-lg border-none bg-paleblue font-inter text-primary shadow-none outline-none"
          value={prompt}
          placeholder="Enter a prompt"
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          disabled={loading}
        />
        <DialogFooter>
          <Button
            onClick={async () => {
              setPrompt("");
              aiGenerate();
            }}
            className="bg-secondary font-inter text-primary"
          >
            GENERATE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiComposeBtn;
