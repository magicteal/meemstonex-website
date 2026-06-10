"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Duration constants
const CURTAIN_DURATION = 0.55;
const CURTAIN_EASE = [0.76, 0, 0.24, 1]; // custom cubic-bezier for cinematic feel
const CONTENT_DELAY = 0.35;

// The sweeping curtain overlay
function Curtain({ color, delay }) {
  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: color,
        transformOrigin: "left",
        pointerEvents: "none",
      }}
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{
        scaleX: [0, 1, 1, 0],
        transformOrigin: ["left", "left", "right", "right"],
      }}
      transition={{
        duration: CURTAIN_DURATION * 2,
        delay,
        times: [0, 0.4, 0.6, 1],
        ease: CURTAIN_EASE,
      }}
    />
  );
}

export default function PageTemplate({ children }) {
  const pathname = usePathname();

  return (
    <>
      {/* Curtain layers — back panel slightly delayed for depth */}
      <Curtain color="#dfe6e4" delay={0.04} />
      <Curtain color="#000000" delay={0} />

      {/* Page content fades in after curtain peak */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: CONTENT_DELAY,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
