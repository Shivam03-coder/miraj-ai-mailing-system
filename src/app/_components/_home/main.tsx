"use client";
import HighlightCards from "@/components/shared/cards/highlightcard";
import { MarqueeBox } from "@/components/shared/marquee/marqueebox";
import { VideoModal } from "@/components/shared/modals/videomodals";
import BlurFade from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import React from "react";
import FaqAccordion from "./faqsaccordion.tsx";
import { useRouter } from "next/navigation";
import { SocialDock } from "@/components/social-dock.tsx";
import ShineBorder from "@/components/ui/shine-border.tsx";

const MainLayout = () => {
  const Router = useRouter();

  return (
    <main className="h-screen space-y-4">
      <BlurFade
        className="flex-center mx-auto h-full max-w-[600px] flex-col gap-7"
        delay={0.3}
        inView
      >
        <ShineBorder
          className="bg-primary p-4 px-5 text-xl font-medium text-secondary lg:text-3xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          MIRAJ AI MAILING SOFTWARE
        </ShineBorder>

        <header className="space-y-4 px-4 text-center">
          <h1 className="text-primary">
            Automate your emails effortlessly with Miraj.
          </h1>
          <h4 className="text-slate-500">
            No matter your email challenges, <br /> Miraj is here to simplify and
            solve them.
          </h4>
        </header>
        <Button
          onClick={() => Router.push("/mail-dashboard")}
          className="flex items-center gap-3 bg-primary font-inter font-medium text-secondary"
          aria-label="getting-started"
        >
          <Rocket size={23} color="white" />
          Get Started for Free
        </Button>
        <SocialDock />
      </BlurFade>

      {/* VIDEO MODAL */}
      <BlurFade
        className="flex-center mx-auto w-[70%] flex-col gap-7"
        delay={0.3}
        inView
      >
        <VideoModal />
      </BlurFade>

      {/* PROBLEM AND SOLUTION */}
      <section className="h-full pb-10">
        <BlurFade
          className="flex-center mx-auto mt-16 w-full flex-col gap-5"
          delay={0.3}
          inView
        >
          <h4 className="text-primary">Trusted by Leading Teams</h4>
          <MarqueeBox />
        </BlurFade>
        <BlurFade
          className="flex-center mx-auto mt-16 w-full flex-col gap-5"
          delay={0.4}
          inView
        >
          <header className="space-y-4 px-4 text-center">
            <h4 className="mb-4 text-center text-lg font-medium text-primary">
              Let’s Understand the Problem
            </h4>
            <h1 className="text-center text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
              Automate your emails effortlessly with Miraj.
            </h1>
          </header>
        </BlurFade>
        <BlurFade
          className="flex-center mx-auto mt-16 w-full flex-col gap-5"
          delay={0.5}
          inView
        >
          <HighlightCards />
        </BlurFade>
        <div className="my-10">
          <FaqAccordion />
        </div>
      </section>
      {/* PROBLEM AND SOLUTION */}
    </main>
  );
};

export default MainLayout;
