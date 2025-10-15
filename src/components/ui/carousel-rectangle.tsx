"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Card = {
  title: string;
  src: string;
};

type CarouselRectangleProps = {
  cards: Card[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
};

export const CarouselRectangle: React.FC<CarouselRectangleProps> = ({
  cards,
  className,
  autoPlay = true,
  interval = 4000,
}) => {
  const [index, setIndex] = useState(0);
  const count = Math.max(0, cards.length);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || count <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [autoPlay, count, interval]);

  if (count === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full rounded-none shadow-sm border border-neutral-800 overflow-hidden">
        <div className="w-full h-[480px] md:h-[520px] relative">
          <Image
            src={cards[index].src}
            alt={cards[index].title}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Title overlay */}
        <div className="absolute left-6 bottom-6 text-white">
          <h3 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            {cards[index].title}
          </h3>
        </div>

        {/* Controls */}
        <button
          aria-label="Previous"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
          {cards.map((c, i) => (
            <button
              key={`${c.title}-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "w-3 h-3 rounded-full",
                i === index ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselRectangle;
