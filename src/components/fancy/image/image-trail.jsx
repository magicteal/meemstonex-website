"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export const ImageTrailItem = ({ children }) => {
  return <>{children}</>;
};

export default function ImageTrail({
  threshold = 60,
  keyframes = { opacity: [0, 1, 0], scale: [1, 1, 1.5] },
  keyframesOptions = { opacity: { duration: 1.8 }, scale: { duration: 1.8 } },
  repeatChildren = 1,
  bindRef,
  children,
  minIntervalMs = 30,
  maxBatchPerMove = 6,
}) {
  const containerRef = useRef(null);
  const lastPos = useRef({ x: null, y: null });
  const lastTimeRef = useRef(0);
  const indexRef = useRef(0);
  const [spawns, setSpawns] = useState([]);

  const pool = useMemo(() => {
    const arr = React.Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        return child.props.children ?? null;
      }
      return null;
    });
    const repeated = [];
    for (let i = 0; i < Math.max(1, repeatChildren); i++) repeated.push(...arr);
    return repeated.filter(Boolean);
  }, [children, repeatChildren]);

  const spawnAt = useCallback(
    (x, y) => {
      if (!pool.length) return;
      const content = pool[indexRef.current % pool.length];
      indexRef.current += 1;
      const id = uuidv4();
      setSpawns((prev) => [...prev, { id, x, y, content }]);
    },
    [pool]
  );

  useEffect(() => {
    const el = bindRef?.current || containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { x: lx, y: ly } = lastPos.current;
      const now = performance.now();

      if (lx == null || ly == null) {
        lastPos.current = { x, y };
        lastTimeRef.current = now;
        spawnAt(x, y);
        return;
      }

      const dx = x - lx;
      const dy = y - ly;
      const dist = Math.hypot(dx, dy);

      if (now - lastTimeRef.current < minIntervalMs) return;

      if (dist > threshold) {
        const steps = Math.min(Math.floor(dist / threshold), maxBatchPerMove);
        for (let i = 1; i <= steps; i++) {
          const t = i / (steps + 1);
          spawnAt(lx + dx * t, ly + dy * t);
        }
      } else if (dist >= threshold * 0.5) {
        spawnAt(x, y);
      }

      lastPos.current = { x, y };
      lastTimeRef.current = now;
    };

    const handleLeave = () => {
      lastPos.current = { x: null, y: null };
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [bindRef, threshold, minIntervalMs, maxBatchPerMove, spawnAt]);

  const removeSpawn = useCallback((id) => {
    setSpawns((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const durationOpacity = keyframesOptions?.opacity?.duration ?? 1.8;
  const durationScale = keyframesOptions?.scale?.duration ?? 1.8;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-20"
    >
      {spawns.map((s) => (
        <motion.div
          key={s.id}
          initial={{
            opacity: keyframes.opacity?.[0] ?? 0,
            scale: keyframes.scale?.[0] ?? 1,
          }}
          animate={{
            opacity: keyframes.opacity ?? [0, 1, 0],
            scale: keyframes.scale ?? [1, 1, 1.5],
          }}
          transition={{
            opacity: {
              ease: "easeInOut",
              ...(keyframesOptions?.opacity || {}),
              duration: durationOpacity,
            },
            scale: {
              ease: "easeOut",
              ...(keyframesOptions?.scale || {}),
              duration: durationScale,
            },
          }}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity",
          }}
          onAnimationComplete={() => removeSpawn(s.id)}
        >
          <div
            className="pointer-events-none"
            style={{ willChange: "transform, opacity" }}
          >
            {s.content}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
