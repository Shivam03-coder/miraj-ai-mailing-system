"use client"
import ThreadCards from "./threads-cards";
import ThreadTypesTab from "./thread-types-tab";
import ThreadSerachInput from "./thread-search-input";

function ThreadBox() {
  return (
    <main className="min-h-screen space-y-2 overflow-y-scroll p-3">
      <ThreadTypesTab />
      <ThreadSerachInput />
      <section className="flex max-h-[100vh] flex-1 overflow-scroll flex-col gap-2">
        <ThreadCards />
      </section>
    </main>
  );
}

export default ThreadBox;
