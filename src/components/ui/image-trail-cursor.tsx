"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImageTrailCursorProps {
  images: string[];
  containerRef: React.RefObject<HTMLElement>; // <-- Add this prop
  className?: string;
  imageClassName?: string;
  spacing?: number;
  maxPoints?: number;
  disappearDelay?: number;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  imageUrl: string;
}

const ImageTrailCursor: React.FC<ImageTrailCursorProps> = ({
  images,
  containerRef, // <-- Destructure the new prop
  className,
  imageClassName,
  spacing = 75,
  maxPoints = 7,
  disappearDelay = 200,
}) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const idCounter = useRef<number>(0);
  const lastMoveTime = useRef<number>(Date.now());

  useEffect(() => {
    const container = containerRef.current; // <-- Use the passed ref
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (images.length === 0) return;

      lastMoveTime.current = Date.now();
      const { clientX, clientY } = e;

      setTrail((prev) => {
        let newTrail = [...prev];
        const last = newTrail[newTrail.length - 1];

        if (
          !last ||
          Math.hypot(clientX - last.x, clientY - last.y) >= spacing
        ) {
          const id = idCounter.current++;
          newTrail.push({
            id,
            x: clientX,
            y: clientY,
            imageUrl: images[id % images.length],
          });

          if (newTrail.length > maxPoints) {
            newTrail = newTrail.slice(newTrail.length - maxPoints);
          }
        }
        return newTrail;
      });
    };

    const clearTrailInterval = setInterval(() => {
      if (Date.now() - lastMoveTime.current > disappearDelay) {
        setTrail([]);
      }
    }, 100);

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearInterval(clearTrailInterval);
    };
  }, [containerRef, images, spacing, maxPoints, disappearDelay]);

  return (
    <div className={cn("pointer-events-none", className)}>
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: item.x,
              y: item.y,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
            className="z-50"
          >
            <img
              src={item.imageUrl}
              alt="cursor trail"
              className={cn(
                "w-24 h-24 object-cover rounded-md shadow-lg",
                imageClassName
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ImageTrailCursor;
