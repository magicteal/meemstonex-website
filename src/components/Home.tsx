"use client"; // <-- Add "use client" since we are using useRef
import { useRef } from "react"; // <-- Import useRef
import { ResizableNavbar } from "@/components/ui/resizable-navbar";
import ImageTrailCursor from "@/components/ui/image-trail-cursor";
import { WavyBackground } from "@/components/ui/wavy-background";
import Showcase from "@/components/ui/showcase";

export default function Home() {
  const images = [
    "/images/one.jpg",
    "/images/two.png",
    "/images/three.jpeg",
    "/images/four.jpeg",
    "/images/five.jpg",
  ];

  const heroRef = useRef<HTMLDivElement>(null); // <-- Create the ref

  return (
    <div className="bg-black">
      <ResizableNavbar />

      {/* Pass the ref to the WavyBackground component */}
      <WavyBackground ref={heroRef} className="max-w-4xl mx-auto pb-40">
        {/* Pass the same ref to the ImageTrailCursor */}
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
