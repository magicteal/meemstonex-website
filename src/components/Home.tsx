"use client";
import { useRef } from "react";
// import { ResizableNavbar } from "@/components/ui/resizable-navbar";
import { Navbar } from "./ui/resizable-navbar";
import ImageTrailCursor from "@/components/ui/image-trail-cursor";
import { WavyBackground } from "@/components/ui/wavy-background";
import Showcase from "@/components/ui/showcase";

export default function Home() {
  const images = [
    "/next.svg",
    "/vercel.svg",
    "/file.svg",
    "/globe.svg",
    "/window.svg",
  ];

  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-black relative z-0">
      {" "}
      {/* Add relative and z-0 */}
      <ResizableNavbar />
      <WavyBackground ref={heroRef} className="max-w-4xl mx-auto pb-40">
        <ImageTrailCursor
          images={images}
          maxPoints={5}
          containerRef={heroRef}
        />
        <div className="relative z-10">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Meemstonex
          </p>
          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Leverage our expertise to build beautiful and functional websites.
          </p>
        </div>
      </WavyBackground>
      <Showcase />
    </div>
  );
}
