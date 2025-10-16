"use client";

import { useRef } from "react";
import Image from "next/image";

// Framer Motion imports
import { motion, useScroll, useTransform } from "framer-motion";

// Define the type for a single carousel item
export type CarouselItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

// Define the props for the component
interface CoverflowCarouselProps {
  items: CarouselItem[];
}

// Card component
const Card = ({
  item,
  index,
  totalItems,
  scrollXProgress,
}: {
  item: CarouselItem;
  index: number;
  totalItems: number;
  scrollXProgress: any; // MotionValue<number>
}) => {
  // Create a continuous value from the scroll progress that maps to the item index
  const itemOffset = useTransform(scrollXProgress, [0, 1], [0, totalItems - 1]);

  // Calculate the position of this card relative to the "active" item
  const position = useTransform(itemOffset, (latest) => index - latest);

  // Use the relative position to drive animations
  const scale = useTransform(
    position,
    [-2, -1, 0, 1, 2],
    [0.7, 0.85, 1.15, 0.85, 0.7]
  );
  const rotateY = useTransform(position, [-1, 0, 1], [60, 0, -60]);
  const opacity = useTransform(
    position,
    [-2, -1, 0, 1, 2],
    [0.4, 0.9, 1, 0.9, 0.4]
  );
  const zIndex = useTransform(position, [-1, 0, 1], [1, 10, 1]);

  // Translate cards horizontally to create the stack
  const x = useTransform(
    position,
    [-2, -1, 0, 1, 2],
    ["-80%", "-40%", "0%", "40%", "80%"]
  );

  return (
    <motion.div
      style={{
        scale,
        rotateY,
        opacity,
        zIndex,
        x,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      }}
      className="relative flex-shrink-0 w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px]"
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={700}
          height={700}
          className="block w-full aspect-square object-cover"
        />
      </div>

      {/* Floor reflection below the cover */}
      <div className="pointer-events-none" aria-hidden="true">
        <Image
          src={item.imageUrl}
          alt=""
          width={700}
          height={700}
          className="block w-full aspect-square object-cover"
          style={{
            transform: "scaleY(-1)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.05) 45%, transparent 70%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.05) 45%, transparent 70%)",
            opacity: 0.3,
            borderRadius: 12,
            marginTop: 8,
          }}
        />
      </div>
    </motion.div>
  );
};

export default function CoverflowCarousel({ items }: CoverflowCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });
  const totalItems = items.length;

  return (
    <div style={{ perspective: 1200 }} className="w-full relative h-[500px]">
      <div
        ref={carouselRef}
        className="w-full h-full overflow-x-auto absolute inset-0 hide-scrollbar"
      >
        {/* Inner container with padding to allow first/last items to be centered */}
        <div
          className="flex items-center h-full"
          style={{
            width: `calc(${totalItems * 50}%)`, // Make the scroll area wide enough
            paddingLeft: "50%",
            paddingRight: "50%",
          }}
        >
          {items.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              index={i}
              totalItems={totalItems}
              scrollXProgress={scrollXProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
