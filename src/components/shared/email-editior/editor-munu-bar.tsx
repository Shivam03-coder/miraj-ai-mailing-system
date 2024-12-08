import TooltipBtn from "@/components/tool-tip-btn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const EditorMenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  const menuItems = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      icon: Bold,
      label: "Bold",
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      icon: Italic,
      label: "Italic",
    },
    {
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      icon: Strikethrough,
      label: "Strikethrough",
    },
    {
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      icon: Code,
      label: "Code",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive("heading", { level: 1 }),
      icon: Heading1,
      label: "Heading 1",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      icon: Heading2,
      label: "Heading 2",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive("heading", { level: 3 }),
      icon: Heading3,
      label: "Heading 3",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive("heading", { level: 4 }),
      icon: Heading4,
      label: "Heading 4",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor.isActive("heading", { level: 5 }),
      icon: Heading5,
      label: "Heading 5",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor.isActive("heading", { level: 6 }),
      icon: Heading6,
      label: "Heading 6",
    },
    {
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      icon: List,
      label: "Bullet List",
    },
    {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      icon: ListOrdered,
      label: "Ordered List",
    },
    {
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      icon: Quote,
      label: "Blockquote",
    },
    {
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      icon: Undo,
      label: "Undo",
      disabled: !editor.can().undo(),
    },
    {
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      icon: Redo,
      label: "Redo",
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap my-2 w-full gap-2 bg-paleblue shadow-sm rounded-lg p-2 ">
      {menuItems.map(
        ({ action, isActive, icon: Icon, label, disabled }, index) => (
          <TooltipBtn key={index} tooltiplabel={label}>
            <button
              className={
                isActive
                  ? "rounded-lg bg-primary p-[3px] text-secondary transition-all"
                  : "rounded-lg p-[3px] transition-all hover:bg-primary hover:text-secondary"
              }
              onClick={action}
              disabled={disabled}
            >
              <Icon className="text-secondary-foreground size-5" />
            </button>
          </TooltipBtn>
        ),
      )}
    </div>
  );
};

export default EditorMenuBar;
