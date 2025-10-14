"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A component that reveals text word by word as the user scrolls.
 * @param children The text content to be revealed.
 * @param className Optional CSS classes for the container.
 */
export const TextReveal = ({ children, className }: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Use useScroll to track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Animation starts when the top of the container enters the viewport and ends when it leaves
  });

  // Split the text content into individual words
  const words = React.Children.toArray(children).join(" ").split(" ");

  return (
    <div ref={ref} className={cn("relative z-10", className)}>
      <div className="relative text-5xl md:text-7xl font-bold text-white text-left">
        {words.map((word, i) => {
          // Calculate the start and end points for each word's animation
          const start = i / words.length;
          // The reveal is quicker than the scroll distance
          const end = start + (1 / words.length) * 0.8;

          // Use useTransform to map scroll progress to opacity
          const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
          return (
            <Word key={i} opacity={opacity}>
              {word}
            </Word>
          );
        })}
      </div>
    </div>
  );
};

interface WordProps {
  children: React.ReactNode;
  opacity: any; // framer-motion MotionValue
}

// Word component that wraps each word in a motion.span
const Word = ({ children, opacity }: WordProps) => {
  return (
    <span className="relative inline-block mr-3 mt-3">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export default TextReveal;
