"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const items = [
  { value: "80+", label: "Projects" },
  { value: "100+", label: "Cities" },
  { value: "28+", label: "Years Experience" },
];

export default function Stats() {
  return (
    <section className="relative w-screen overflow-hidden bg-black py-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/img/numbersBG.jpg"
          alt="Completed custom projects background"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        {/* Dark film */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="font-general text-[10px] uppercase tracking-wider text-blue-200/70">
            Completed Custom Projects
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[0.3em] text-white sm:text-3xl md:text-4xl">
            COMPLETED CUSTOM PROJECTS
          </h2>
        </div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 gap-10 text-center text-blue-50 sm:grid-cols-3"
        >
          {items.map((s, i) => (
            <StatItem
              key={s.label}
              value={s.value}
              label={s.label}
              delay={i * 150}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

// Count-up item that animates from 1 to the final value when it enters the viewport
function StatItem({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6, once: true });

  const { end, suffix } = useMemo(() => {
    const digits = value.replace(/[^0-9]/g, "");
    const end = Number(digits || 0);
    const suffix = value.replace(/[0-9]/g, "");
    return { end, suffix };
  }, [value]);

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!inView) return;
    let af;
    const duration = 1200; // ms
    const start = performance.now() + delay;
    const from = 1;
    const animate = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(from + (end - from) * eased);
      setCurrent(v);
      if (t < 1) af = requestAnimationFrame(animate);
    };
    af = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(af);
  }, [inView, end, delay]);

  return (
    <li ref={ref} className="flex flex-col items-center">
      <div className="text-3xl font-semibold tracking-wider md:text-4xl">
        {current}
        {suffix}
      </div>
      <div className="mt-2 text-base tracking-[0.3em] text-blue-100/90">
        {label}
      </div>
    </li>
  );
}
