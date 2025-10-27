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
  // smoothing targets for a fluid cursor trail
  const pointerTarget = useRef({ x: null, y: null });
  const pointerPos = useRef({ x: null, y: null });
  const rafRef = useRef(null);
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

    // on mouse move we only update target; the raf loop will smooth & spawn
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerTarget.current = { x, y };
      // initialize pointerPos immediately if first move
      if (pointerPos.current.x == null) {
        pointerPos.current = { x, y };
        lastPos.current = { x, y };
        lastTimeRef.current = performance.now();
        spawnAt(x, y);
      }
    };

    const handleLeave = () => {
      pointerTarget.current = { x: null, y: null };
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    const smooth = 0.18; // lerp factor (0-1), lower is smoother
    const loop = () => {
      const target = pointerTarget.current;
      if (target && pointerPos.current.x != null) {
        // lerp toward target
        pointerPos.current.x += (target.x - pointerPos.current.x) * smooth;
        pointerPos.current.y += (target.y - pointerPos.current.y) * smooth;

        const lx = lastPos.current.x;
        const ly = lastPos.current.y;
        const px = pointerPos.current.x;
        const py = pointerPos.current.y;
        const now = performance.now();
        const dx = px - (lx ?? px);
        const dy = py - (ly ?? py);
        const dist = Math.hypot(dx, dy);

        if (now - lastTimeRef.current >= minIntervalMs && dist >= threshold * 0.25) {
          // spawn at the smoothed position
          spawnAt(px, py);
          lastPos.current = { x: px, y: py };
          lastTimeRef.current = now;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
