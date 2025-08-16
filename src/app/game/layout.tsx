"use client";
import { Header } from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="text-center flex flex-col items-center">
        <h1 className="font-hartone text-[39px] leading-[100%]  tracking-wider text-center text-black ">
          Find the colour
        </h1>
        <p className="font-sintony text-sm text-black">
          You can click a picture or mix colours!
        </p>
      </div>
      {children}
    </>
  );
};

export default Layout;
