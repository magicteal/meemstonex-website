"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  bgImage?: string;
  bgClassName?: string; // for gradient backgrounds (tailwind classes)
  speed?: number; // multiplier for parallax motion
  overlay?: boolean; // dark overlay for readability
  className?: string;
};

const ParallaxSection: React.FC<Props> = ({
  children,
  bgImage,
  bgClassName,
  speed = 0.18,
  overlay = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    const bg = bgRef.current;
    if (!el || !bg) return;

    let rafId: number | null = null;

    const handle = () => {
      const rect = el.getBoundingClientRect();
      // rect.top is distance from top of viewport; multiply for depth
      const translate = Math.round(rect.top * speed);
      // apply a subtle invert so backgrounds lag behind
      bg.style.transform = `translateY(${translate}px)`;
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(handle);
    };

    // initial position
    handle();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // IntersectionObserver for fade-in
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* background layer */}
      <div
        ref={bgRef}
        aria-hidden
        className={`absolute inset-0 -z-10 bg-center bg-cover transition-transform will-change-transform ${
          bgClassName ?? ""
        }`}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      />

      {overlay && (
        <div className="absolute inset-0 -z-5 bg-black/30 pointer-events-none" />
      )}

      <div
        className={`relative transition-all duration-700 ease-out transform ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
