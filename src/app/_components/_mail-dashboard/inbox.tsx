import React from "react";
import Navs from "./tabs";
import SerachInput from "./search-input";
import ThreadCards from "./threads-cards";

function Inbox() {
  return (
    <main className="min-h-screen space-y-2 overflow-y-scroll p-3">
      <Navs />
      <SerachInput />
      <section className="flex max-h-[100vh] flex-1 overflow-scroll flex-col gap-2">
        <ThreadCards />
      </section>
    </main>
  );
}

export default Inbox;
