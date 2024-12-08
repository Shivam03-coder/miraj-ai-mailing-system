"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import EditorMenuBar from "./editor-munu-bar";
import MailInput from "./mail-input";

const EmailEditor = () => {
  const [value, setValue] = useState<string>("");
  const [IsExpanded, setIsExpanded] = useState<boolean>(false);

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
  if (!editor) return null;
  return (
    <div className="flex w-full flex-col border-none shadow-none">
      <EditorMenuBar editor={editor} />
      <div className="space-y-2 py-2">
        {IsExpanded && (
          <>
            <MailInput
              defaultValues={[]}
              label="To :"
              // @ts-ignore
              onChange={console.log}
              placeholder="Add Recipients"
              value={[]}
            />
            <MailInput
              defaultValues={[]}
              label="Cc :"
              // @ts-ignore
              onChange={console.log}
              placeholder="Add Recipients"
              value={[]}
            />
          </>
        )}
        <div className="flex items-center gap-2 px-1">
          <button
            className="cursor-pointer rounded bg-yellow-300 px-2"
            onClick={() => setIsExpanded(!IsExpanded)}
          >
            <span className="flex gap-2">
              <h6 className="text-red-600">Draft </h6>
              <h6>: To Elliot</h6>
            </span>
          </button>
        </div>
      </div>
      <div className="prose my-2 min-h-[300px] w-full rounded-lg bg-paleblue p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default EmailEditor;
