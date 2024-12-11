"use client";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React, { useState } from "react";

const ThreadSearchInput = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center justify-between gap-2 rounded bg-paleblue px-3 py-1">
        <div className="flex flex-1 items-center gap-3">
          <Search size={25} />
          <Input
            placeholder="Search..."
            className="flex-1 border-none font-inter text-xl shadow-none outline-none placeholder:text-black"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <span
          className="cursor-pointer rounded bg-primary text-secondary"
          onClick={() => setSearchValue("")}
        >
          <X size={25} />
        </span>
      </div>

      {/* Display Entered Text */}
      {searchValue && (
        <div className="absolute w-full left-0 right-0 z-10 mt-2 max-h-64 overflow-y-auto rounded-md bg-white p-3 shadow-lg">
          <p className="text-gray-800 text-md">
            You are searching for: <span className="font-bold">{searchValue}</span>
          </p>

          {/* Simulating more content to show overflow behavior */}
          <div className="mt-2 space-y-2">
            <p>Item 1</p>
            <p>Item 2</p>
            <p>Item 3</p>
            <p>Item 4</p>
            <p>Item 5</p>
            <p>Item 6</p>
            <p>Item 7</p>
            <p>Item 8</p>
            <p>Item 9</p>
            <p>Item 10</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadSearchInput;
