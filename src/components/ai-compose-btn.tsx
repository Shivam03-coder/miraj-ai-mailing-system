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
import { handlePromptWithContext } from "@/lib/gemini-ai/action";
import useThreads from "@/hooks/use-threads";
import { useAppSelector } from "@/store/store";
import { turndown } from "@/lib/turn-down";

type AiComposeBtnProps = {
  isComposing: boolean;
  onGenerate: (token: string) => void;
};

const AiComposeBtn: React.FC<AiComposeBtnProps> = ({
  isComposing,
  onGenerate,
}) => {
  const [Open, setOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [Loading, setLoading] = useState<boolean>(false);
  const { account, threads } = useThreads();
  const { threadId } = useAppSelector((state) => state.account);
  const thread = threads.find((thr) => thr.id === threadId);

  const aiGenerate = async () => {
    setLoading(true);

    let context = "";

    if (!isComposing) {
      for (const email of thread?.emails ?? []) {
        const Content = `
        Subject : ${email.subject}
        From : ${email.from.address}
        Sent : ${email.sentAt}
        Body : ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
        `;

        context += Content;
      }

      context += `My name is ${account?.name} , My email address is ${account?.emailAddress}`;
    }

    try {
      const response = await handlePromptWithContext(prompt, context ?? "");
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
    <Dialog open={Open} onOpenChange={setOpen}>
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
          className="rounded-xl border-none bg-paleblue font-inter text-lg text-primary shadow-none outline-none"
          value={prompt}
          placeholder="Enter a prompt"
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          disabled={Loading}
        />
        <DialogFooter>
          <Button
            onClick={async () => {
              setPrompt("");
              aiGenerate();
              setOpen(false);
            }}
            className="w-full bg-primary font-inter text-secondary"
          >
            {Loading ? "GENERATING..." : "GENERATE"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiComposeBtn;
