"use client";

import React, { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Image from "next/image";
import AboutImageTrail from "./AboutImageTrail";

// Simple image section with a black film overlay; text styling retained
const About = () => {
  const sectionRef = useRef(null);
  return (
    <div id="about" className="w-screen">
      <section ref={sectionRef} className="relative w-screen min-h-[95vh]">
        {/* Background image */}
        <Image
          src="/img/test.png"
          alt="Background"
          fill
          className="absolute inset-0 size-full object-cover"
          sizes="100vw"
          priority={false}
        />

        {/* Black overlay film */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* Image trail overlay (active on hover over image area) */}
        <AboutImageTrail bindRef={sectionRef} />

        {/* Text content (unchanged styling) */}
        <div className="relative z-10 flex min-h-[95vh] w-full flex-col items-center justify-center gap-5 px-4 text-center">
          <h2 className="font-general text-sm uppercase md:text-[10px]">
            Welcome to Meemstonex
          </h2>

          <AnimatedTitle
            title="Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex"
            containerClass="mt-5 !text-black text-center h-full"
          />

        </div>
      </section>
    </div>
  );
};

export default About;
