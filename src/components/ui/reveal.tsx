"use client";
import React from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
}

const variantsMap = {
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = "fade",
  delay = 0,
  duration = 0.8,
  className,
}) => {
  const variants = variantsMap[direction];
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};
