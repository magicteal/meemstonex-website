"use client";
import React, { useRef } from "react";
import ImageTrailCursor from "@/components/ui/image-trail-cursor";
import { cn } from "@/lib/utils";

type HeroMainProps = {
  images: string[];
  className?: string;
  subtitle?: string;
};

export default function HeroMain({
  images,
  className,
  subtitle,
}: HeroMainProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative flex min-h-[80vh] md:min-h-[85vh] w-full items-center justify-center px-6",
        className
      )}
    >
      {/* cursor trail */}
      <ImageTrailCursor
        images={images}
        containerRef={heroRef as React.RefObject<HTMLElement>}
      />

      <div className="relative z-10 text-center">
        <h1
          className={cn(
            // use the script font variable from layout
            "font-[family:var(--font-script)] select-none",
            // responsive fluid size
            "text-[16vw] leading-[0.9] md:text-[12vw] lg:text-[9vw]",
            "text-white"
          )}
        >
          <span>Meem</span>
          <span className="text-teal-400">stonex</span>
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-3xl text-sm md:text-base text-neutral-300 mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
