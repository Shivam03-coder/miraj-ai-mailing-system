"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Text from "@tiptap/extension-text";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const EmailEditor = () => {
  const [value, setValue] = useState<string>("");

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

  return (
    <Card className="w-full bg-slate-500">
      <div className="prose w-full px-4">
        <EditorContent editor={editor} />
      </div>
    </Card>
  );
};

export default EmailEditor;
