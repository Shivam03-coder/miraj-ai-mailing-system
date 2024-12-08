"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { BotIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import * as React from "react";
import { Textarea } from "./ui/textarea";

type AiComposeBtnProps = {
  isComposing: boolean;
  onGenrate: (token: string) => void;
};

const AiComposeBtn: React.FC<AiComposeBtnProps> = ({
  isComposing,
  onGenrate,
}) => {
  const [Prompt, setPrompt] = React.useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex-center cursor-pointer rounded-lg bg-primary p-1 text-secondary">
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
          value={Prompt}
          placeholder="Enter a prompt"
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
        />
        <DialogFooter>
          <Button className="font-inter text-secondary">Generate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiComposeBtn;
