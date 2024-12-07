import {
  Archive,
  ArchiveX,
  EllipsisVertical,
  Merge,
  Redo,
  Timer,
  Trash,
  Undo,
} from "lucide-react";
import React from "react";

const ReplyboxHeader = () => {
  return (
    <nav className="flex h-10 w-full items-center justify-between bg-paleblue px-5">
      <div className="flex h-full items-center gap-5 text-primary">
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <ArchiveX size={20} />
        </button>
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Archive size={20} />
        </button>
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Trash size={20} />
        </button>
        <div className="h-[70%] w-[2px] bg-primary" />
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Timer size={19} />
        </button>
      </div>
      <div className="flex h-full items-center gap-5 text-primary">
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Undo size={20} />
        </button>
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Merge size={20} />
        </button>
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <Redo size={20} />
        </button>
        <div className="h-[70%] w-[2px] bg-primary" />
        <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
          <EllipsisVertical size={19} />
        </button>
      </div>
    </nav>
  );
};

export default ReplyboxHeader;
