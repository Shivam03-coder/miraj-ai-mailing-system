"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bot } from "lucide-react";
import EmailEditor from "@/lib/tip-tap";
import { useState } from "react";

type EditorSheetProps = {
  setOpen: (open: boolean) => void;
  open: boolean;
};

export function EditorSheet({ open, setOpen }: EditorSheetProps) {
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [subject, setSubject] = useState<string>("");

  const handleSend = async () => {
    console.log("Sending email...");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="bg-secondary text-primary max-h-screen overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
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
