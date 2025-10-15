"use client";
import React, { useRef, useEffect } from "react";
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

  // Inject Google font 'Great Vibes' client-side so we avoid touching globals
  useEffect(() => {
    const href =
      "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
    if (typeof document === "undefined") return;
    const exists = Array.from(document.head.querySelectorAll("link")).some(
      (l) => l.getAttribute("href") === href
    );
    if (!exists) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

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
        {/* gradient layers behind the heading */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(900px 600px at 10% 35%, rgba(6,182,160,0.14), transparent 30%), radial-gradient(900px 600px at 90% 65%, rgba(128,65,255,0.12), transparent 35%)",
            filter: "blur(64px)",
          }}
        />

        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(1400px 1000px at 8% 30%, rgba(6,182,160,0.22), transparent 35%), radial-gradient(1400px 900px at 92% 70%, rgba(128,65,255,0.18), transparent 40%), radial-gradient(800px 500px at 50% 50%, rgba(0,0,0,0.35), transparent 30%)",
            filter: "blur(84px)",
          }}
        />

        <h1
          className={cn(
            // responsive fluid size
            "select-none",
            "text-[20vw] leading-[0.9] md:text-[15vw] lg:text-[12vw]",
            "text-white"
          )}
          // Prefer Google 'Great Vibes', then the project's --font-script, then generic cursive
          style={{ fontFamily: "'Great Vibes', var(--font-script), cursive" }}
        >
          <span>Meem</span>
          <span className="text-teal-400">stonex</span>
        </h1>

        {subtitle && (
            <p className="mt-6 max-w-3xl text-sm md:text-base text-neutral-300 mx-auto font-bold">
            {subtitle}
            </p>
        )}
      </div>
    </section>
  );
}
