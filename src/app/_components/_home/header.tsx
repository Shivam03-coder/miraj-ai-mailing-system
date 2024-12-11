"use client";
import { Button } from "@/components/ui/button";
import { NavigationMenuBar } from "@/components/ui/navigationmenu";
import { useisUserAuthenticated } from "@/hooks/use-is-user-authenticated";
import { Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

const Header = () => {
  const Router = useRouter();
  const IsUserAuth = useisUserAuthenticated();
  const matches = useMediaQuery("(min-width: 834px)");
  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full items-center justify-between bg-transparent px-10 py-2 backdrop-blur-2xl">
      <div className="flex-center text-greatBlue-400 gap-4 p-2 text-2xl font-semibold text-black">
        <Rocket size={40} className="text-primary" />
        MIRAJ-X
      </div>
      <div className="flex items-center justify-between gap-4">
        <NavigationMenuBar />
        {!IsUserAuth && (
          <Button
            onClick={() => Router.push("/sign-in")}
            className="bg-primary font-inter font-medium text-secondary"
            variant={"outline"}
          >
            Login
          </Button>
        )}
        {matches && (
          <Button
            onClick={() => Router.push("/mail-dashboard")}
            className="flex items-center gap-3 bg-primary font-inter font-medium text-secondary"
          >
            <Rocket size={23} color="white" />
            Go to dashboard
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
