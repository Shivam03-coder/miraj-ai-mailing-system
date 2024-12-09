"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import React, { useState } from "react";
import EditorMenuBar from "./editor-munu-bar";
import MailInput from "./mail-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import AiComposeBtn from "@/components/ai-compose-btn";

type PropOptions = { label: string; value: string }[];

type EmailEditorProps = {
  subject: string;
  setSubject: (subject: string) => void;

  toValues: PropOptions;
  setToValues: (value: PropOptions) => void;

  ccValues: PropOptions;
  setCcValues: (value: PropOptions) => void;

  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;
  defaultToolbarExpand?: boolean;
};

const EmailEditor: React.FC<EmailEditorProps> = ({
  ccValues,
  handleSend,
  isSending,
  setCcValues,
  setSubject,
  setToValues,
  subject,
  to,
  toValues,
  defaultToolbarExpand,
}) => {
  const [value, setValue] = useState<string>("");
  const [IsExpanded, setIsExpanded] = useState<boolean>(!!defaultToolbarExpand);

  // Custom Text extension with a keyboard shortcut
  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit.configure({}), CustomText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML() || "");
    },
  });

  const onGenerate = (resptxt: string) => {
    editor?.commands.insertContent(resptxt);
  };

  if (!editor) return null;
  return (
    <div className="flex w-full flex-col border-none shadow-none">
      <EditorMenuBar editor={editor} />
      <div className="space-y-2 py-2">
        {IsExpanded && (
          <>
            <MailInput
              label="To :"
              // @ts-ignore
              onChange={setToValues}
              placeholder="Add Recipients....."
              value={toValues}
            />
            <MailInput
              label="Cc :"
              // @ts-ignore
              onChange={setCcValues}
              placeholder="Add Recipients....."
              value={ccValues}
            />
            <Input
              className="rounded-md border-none bg-paleblue outline-none"
              id="subject"
              placeholder="Subject"
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
          </>
        )}
        <div className="my-3 flex items-center justify-between gap-2 px-1">
          <button
            className="cursor-pointer rounded bg-yellow-300 px-2"
            onClick={() => setIsExpanded(!IsExpanded)}
          >
            <span className="flex gap-2">
              <h6 className="text-red-600">Draft </h6>
              <h6>to : {to?.join(", ")}</h6>
            </span>
          </button>
          <AiComposeBtn
            isComposing={!!defaultToolbarExpand}
            onGenerate={onGenerate}
          />
        </div>
      </div>
      <div className="prose my-2 min-h-[200px] w-full rounded-lg bg-paleblue p-2">
        <EditorContent
          editor={editor}
          placeholder="Create Mail....."
          className="placeholder:text-primary"
        />
      </div>
      <Separator />
      <div className="my-3 flex items-center justify-between rounded-lg bg-secondary pl-2 font-inter">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="rounded-lg border border-gray-200 bg-paleblue px-2 py-1.5 text-xs font-semibold text-gray-800">
            Cmd + J
          </kbd>{" "}
          for AI autocomplete
        </span>
        <Button
          disabled={isSending}
          onClick={async () => {
            editor.commands.clearContent();
            await handleSend(value);
          }}
          className="flex items-center gap-3 font-inter text-secondary"
        >
          Send <SendHorizonal size={19} />
        </Button>
      </div>
    </div>
  );
};

export default EmailEditor;
