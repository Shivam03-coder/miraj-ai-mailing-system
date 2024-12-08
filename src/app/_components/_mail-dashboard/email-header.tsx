import TooltipBtn from "@/components/tool-tip-btn";
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

const EmailboxHeader = () => {
  return (
    <nav className="flex h-10 w-full items-center justify-between bg-paleblue px-5">
      <div className="flex h-full items-center gap-5 text-primary">
        <TooltipBtn tooltiplabel="Archive">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <ArchiveX size={20} />
          </button>
        </TooltipBtn>
        <TooltipBtn tooltiplabel="Archive">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Archive size={20} />
          </button>
        </TooltipBtn>
        <TooltipBtn tooltiplabel="Trash">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Trash size={20} />
          </button>
        </TooltipBtn>
        <div className="h-[70%] w-[2px] bg-primary" />
        <TooltipBtn tooltiplabel="Timer">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Timer size={19} />
          </button>
        </TooltipBtn>
      </div>

      <div className="flex h-full items-center gap-5 text-primary">
        <TooltipBtn tooltiplabel="Timer">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Undo size={20} />
          </button>
        </TooltipBtn>
        <TooltipBtn tooltiplabel="Timer">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Merge size={20} />
          </button>
        </TooltipBtn>
        <TooltipBtn tooltiplabel="Timer">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <Redo size={20} />
          </button>
        </TooltipBtn>
        <div className="h-[70%] w-[2px] bg-primary" />
        <TooltipBtn tooltiplabel="Timer">
          <button className="rounded-lg p-1 transition-all hover:bg-primary hover:text-secondary">
            <EllipsisVertical size={19} />
          </button>
        </TooltipBtn>
      </div>
    </nav>
  );
};

export default EmailboxHeader;
