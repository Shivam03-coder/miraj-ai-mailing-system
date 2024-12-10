"use client";
import ThreadCards from "./threads-cards";

function ThreadBox() {
  return (
    <main className="space-y-2 p-3">
      <section className="flex max-h-[100vh] flex-1 flex-col gap-2 overflow-scroll">
        <ThreadCards />
      </section>
    </main>
  );
}

export default ThreadBox;
