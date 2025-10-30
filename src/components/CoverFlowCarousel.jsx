"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Local demo items (replace with props/data source if desired)
const demoItems = [
  { id: 1, title: "Nature's Gift", imageUrl: "/products/P1.jpg" },
  { id: 2, title: "Pro Crunch", imageUrl: "/products/P2.jpg" },
  { id: 3, title: "Milkshake Hairspa", imageUrl: "/products/P3.jpg" },
  { id: 4, title: "Skin Wellness", imageUrl: "/products/P4.jpg" },
  { id: 5, title: "Collectivo Lux", imageUrl: "/products/P5.jpg" },
];

// Single card with 3D transforms
const CoverFlowCard = ({ item, isActive, offset, onClick }) => {
  const absOffset = Math.abs(offset);
  const style = {
    transform: `rotateY(${offset * -25}deg) scale(${
      1 - absOffset * 0.1
    }) translateZ(${absOffset * -80}px) translateX(${offset * 12}%)`,
    opacity: isActive ? 1 : Math.max(0.4, 1 - absOffset * 0.3),
    zIndex: 10 - absOffset,
    filter: `blur(${absOffset * 0.5}px)`,
    transition: "all 0.5s ease-out",
  };

  return (
    <div
      className="relative h-96 w-64 cursor-pointer overflow-hidden rounded-lg shadow-lg flex-shrink-0"
      style={style}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/400x600/ef4444/ffffff?text=Image+Error";
        }}
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
      </div>
      {!isActive && <div className="absolute inset-0 bg-black/20" />}
    </div>
  );
};

// Core carousel
const CoverFlowCore = ({ items }) => {
  const n = items.length;
  const mid = Math.floor(n / 2);
  const [activeIndex, setActiveIndex] = useState(mid);
  const [paused, setPaused] = useState(false);

  const handlePrev = () => setActiveIndex((p) => (p - 1 + n) % n);
  const handleNext = () => setActiveIndex((p) => (p + 1) % n);

  // Auto-advance every 2.5s; pause on hover
  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(handleNext, 2500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, n]);

  // Rotate items so active stays centered in DOM order (prevents jump on wrap)
  const ordered = useMemo(() => {
    if (!n) return [];
    const start = (activeIndex - mid + n) % n;
    return new Array(n).fill(0).map((_, i) => items[(start + i) % n]);
  }, [items, n, activeIndex, mid]);

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h=[450px] w-full max-w-6xl [perspective:1000px]">
        <div className="flex h-full items-center justify-center [transform-style:preserve-3d]">
          {ordered.map((item, i) => {
            const offset = i - mid; // small, centered offsets in [-mid, +mid]
            const isActive = offset === 0;
            return (
              <div className="mx-2" key={item.id}>
                <CoverFlowCard
                  item={item}
                  isActive={isActive}
                  offset={offset}
                  onClick={() =>
                    setActiveIndex((prev) => (prev + offset + n) % n)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {n > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-blue-50 backdrop-blur hover:bg-white/30"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-blue-50 backdrop-blur hover:bg-white/30"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
};

// Section wrapper placed after Our Process with proper padding to match theme
export default function CoverFlowCarousel({ items = demoItems }) {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold tracking-widest text-white sm:text-3xl md:text-4xl">
            Our Products
          </h2>
        </div>
        <CoverFlowCore items={items} />
      </div>
    </section>
  );
}
