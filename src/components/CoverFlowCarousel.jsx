"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Local demo items (replace with props/data source if desired)
const demoItems = [
  { id: 1, title: "Nature's Gift", imageUrl: "/img/gallery-1.webp" },
  { id: 2, title: "Pro Crunch", imageUrl: "/img/gallery-2.webp" },
  { id: 3, title: "Milkshake Hairspa", imageUrl: "/img/gallery-3.webp" },
  { id: 4, title: "Skin Wellness", imageUrl: "/img/gallery-4.webp" },
  { id: 5, title: "Collectivo Lux", imageUrl: "/img/gallery-5.webp" },
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
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));

  const handlePrev = () =>
    setActiveIndex((p) => (p > 0 ? p - 1 : items.length - 1));
  const handleNext = () =>
    setActiveIndex((p) => (p < items.length - 1 ? p + 1 : 0));

  // Center the active card (w-64 -> 256px) with 16px gutters (mx-2)
  const trackTranslation = `calc(50% - ${activeIndex * 272}px - 128px)`; // 128px = half of 256px

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden py-12">
      <div className="relative h-[450px] w-full max-w-6xl [perspective:1000px]">
        <div
          className="flex h-full items-center [transform-style:preserve-3d]"
          style={{
            transform: `translateX(${trackTranslation})`,
            transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {items.map((item, index) => (
            <div className="mx-2" key={item.id}>
              <CoverFlowCard
                item={item}
                isActive={index === activeIndex}
                offset={index - activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

// Section wrapper placed after Our Process with proper padding to match theme
export default function CoverFlowCarousel({ items = demoItems }) {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <CoverFlowCore items={items} />
      </div>
    </section>
  );
}
