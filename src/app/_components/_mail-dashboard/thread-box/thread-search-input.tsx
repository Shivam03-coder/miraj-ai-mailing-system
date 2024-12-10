"use client";
import { Input } from "@/components/ui/input";
import useThreads from "@/hooks/use-threads";
import { Search } from "lucide-react";
import React, { useState } from "react";

const ThreadSerachInput = () => {
  const [SearchValue, setSearchValue] = useState<boolean>();
  const { isFetching } = useThreads();

  return (
    <div className="flex items-center gap-2 rounded bg-paleblue px-3 py-1">
      <Search size={25} />
      <Input
        placeholder="Serach......"
        className="border-none text-xl shadow-none outline-none placeholder:text-black"
      />
    </div>
  );
};

export default ThreadSerachInput;
