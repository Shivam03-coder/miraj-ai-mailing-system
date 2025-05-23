import React from "react";
import Navbar from "../_components/_home/header";
import LinkAccountbtn from "@/components/linkaccountbtn";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default HomeLayout;
