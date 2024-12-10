"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import React, { useState } from "react";
import MailInput from "./mail-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import AiComposeBtn from "@/components/ai-compose-btn";
import EditorMenuBar from "./editor-munu-bar";
import { useAppDispatch } from "@/store/store";
import { setIsSheetEditiorOpen } from "@/store/states";

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
  subject,
  setSubject,
  toValues,
  setToValues,
  ccValues,
  setCcValues,
  to,
  handleSend,
  isSending,
  defaultToolbarExpand = false,
}) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultToolbarExpand);
  const Dispatch = useAppDispatch();

  // Custom Text extension with a keyboard shortcut
  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Shortcut Meta-j triggered");
          return true;
        },
      };
    },
  });

  // Initialize the editor
  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit.configure({}), CustomText],
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML() || "");
    },
  });

  const onGenerate = (generatedText: string) => {
    editor?.commands.insertContent(generatedText);
  };

  // Ensure editor is initialized
  if (!editor) return null;

  return (
    <div className="flex w-full flex-col border-none shadow-none">
      <EditorMenuBar editor={editor} />

      <div className="space-y-2 py-2">
        {isExpanded && (
          <>
            <MailInput
              label="To:"
              onChange={setToValues}
              placeholder="Add Recipients..."
              value={toValues}
            />
            <MailInput
              label="Cc:"
              onChange={setCcValues}
              placeholder="Add Recipients..."
              value={ccValues}
            />
            <Input
              className="rounded-md border-none bg-paleblue outline-none"
              id="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}

        <div className="my-3 flex items-center justify-between gap-2 px-1">
          <button
            className="cursor-pointer rounded bg-yellow-300 px-2"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <span className="flex gap-2">
              <h6 className="text-red-600">Draft</h6>
              <h6>to: {to.join(", ")}</h6>
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
          placeholder="Create Mail..."
          className="placeholder:text-primary"
        />
      </div>

      <Separator />

      <div className="my-3 flex items-center justify-between rounded-lg bg-secondary py-2 pl-2 font-inter">
        <h6 className="text-sm">
          Tip: Press Send Mail for AI-generated suggestions.
        </h6>
        <Button
          disabled={isSending}
          onClick={async () => {
            editor.commands.clearContent();
            await handleSend(editorContent);
            Dispatch(setIsSheetEditiorOpen());
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
