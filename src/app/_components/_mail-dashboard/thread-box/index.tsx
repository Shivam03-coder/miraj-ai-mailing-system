"use client";
import ThreadCards from "./threads-col";

function ThreadBox() {
  return (
    <main className="flex max-h-[100vh] flex-1 flex-col gap-2 overflow-scroll p-3">
      <ThreadCards />
    </main>
  );
}

export default ThreadBox;
