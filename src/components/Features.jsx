"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { slugify } from "../lib/categories";
import { TiLocationArrow } from "react-icons/ti";

const BentoTilt = ({ children, className = "" }) => {
  const itemRef = useRef();
  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;

    const el = itemRef.current;
    const { left, top, width, height } = el.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 10;
    const tiltY = (relativeX - 0.5) * -10;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
      el.style.willChange = "transform";
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    itemRef.current.style.transform = "";
    itemRef.current.style.willChange = "auto";
  };

  return (
    <div
      className={className}
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const LazyVideo = ({ src, className = "", ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let observer;
    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start playback when visible
          video.play().catch(() => {});
        } else {
          // Pause when offscreen
          video.pause();
        }
      });
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(onIntersect, {
        root: null,
        threshold: 0.25,
      });
      observer.observe(video);
    } else {
      // Fallback: try to play by default
      video.play().catch(() => {});
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
      {...rest}
    />
  );
};

const BentoCard = ({ src, title, description, href, label }) => {
  return (
    <div className="relative w-full h-48 md:h-[55vh] overflow-hidden rounded-md transition-transform duration-300 ease-out will-change-transform transform-gpu group-hover:scale-105 z-20 group-hover:z-40">
      <LazyVideo
        src={src}
        className="w-full h-full object-cover object-center"
      />
      {/* Black film overlay at 50% opacity */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-black">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={label || (typeof title === "string" ? title : "category")}
          className="absolute inset-0 z-30"
        />
      )}
    </div>
  );
};

const Features = () => {
  // define tiles in a variable so we can observe them
  const tiles = [
    {
      name: "TABLE TOP",
      video: "videos/C1.mp4",
      desc: "Where sophistication meets strength — Meemstonex Counters, crafted to define modern elegance in every space",
    },
    {
      name: "Marble temple",
      video: "videos/C2.mp4",
      desc: "Meemstonex Mandirs sacred spaces sculpted in pure marble, embodying devotion, peace, and eternal grace",
    },
    {
      name: "MOSQUE WORK",
      video: "videos/C3.mp4",
      desc: "Sacred mosque elements crafted in premium marble with uncompromising quality.",
    },
    {
      name: "STONE FOUNTAIN",
      video: "videos/C4.mp4",
      desc: "Let serenity flow with Meemstonex Fountains, where artistry in stone brings movement, life, and timeless beauty.",
    },
    {
      name: "INLAY WORK",
      video: "videos/C5.mp4",
      desc: "Artful stone inlay that blends tradition with precision craftsmanship.",
    },
    {
      name: "WALL PANELS",
      video: "videos/C6.mp4",
      desc: "Statement wall claddings in marble that elevate interiors with depth and texture.",
    },
    // {
    //   name: "MORAL",
    //   video: "videos/C7.mp4",
    //   desc: "Expressive marble mural work designed to narrate elegance in stone.",
    // },
    {
      name: "WASHBASIN",
      video: "videos/C8.mp4",
      desc: "Sleek and refined basins carved from premium marble for timeless bathrooms.",
    },
    {
      name: "HANDICRAFTS PRODUCTS",
      video: "videos/C9.mp4",
      desc: "Handcrafted marble artefacts that showcase intricate workmanship.",
    },
  ];

  const tileRefs = useRef([]);
  const [visible, setVisible] = useState(() =>
    new Array(tiles.length).fill(false)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = tileRefs.current.indexOf(entry.target);
          if (idx === -1) return;
          if (entry.isIntersecting) {
            setVisible((v) => {
              if (v[idx]) return v;
              const copy = [...v];
              copy[idx] = true;
              return copy;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    tileRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
    // tiles length won't change during runtime in this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-black pb-20">
      <div className="container mx-auto px-4 md:px-10">
        <div className="px-5 py-16 md:py-32">
          <p className="font-circular-web text-base md:text-lg text-blue-50">
            Where Everyday Elegance Meets a World of Interconnected Luxury
          </p>
          <p className="mt-3 max-w-md font-circular-web text-sm md:text-lg text-blue-50 opacity-50">
            Immerse yourself in a rich and ever-expanding universe where our
            vibrant array of marble products seamlessly converge, creating an
            interconnected overlay of refined experiences within your home
          </p>
        </div>

        {/* Categories grid: show TABLE TOP alongside others as equal tiles on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {tiles.map((t, index) => {
            const isVisible = visible[index];
            const fromLeft = index % 2 === 0;
            const baseAnim =
              "transform transition-transform duration-700 ease-out opacity-0";
            const enterAnim = isVisible
              ? "opacity-100 translate-x-0"
              : fromLeft
              ? "-translate-x-12"
              : "translate-x-12";
            return (
              <div
                key={t.name}
                ref={(el) => (tileRefs.current[index] = el)}
                className={`group ${baseAnim} ${enterAnim}`}
              >
                <BentoTilt className={`bento-tilt`}>
                  <BentoCard
                    src={t.video}
                    title={t.name}
                    href={`/categories/${slugify(t.name)}`}
                    label={`View ${t.name} category`}
                    description={t.desc}
                  />
                </BentoTilt>
              </div>
            );
          })}

          {/* More coming soon tile */}
          <div className="group bento-tilt md:col-span-2">
            <BentoTilt>
              <div className="relative flex h-40 w-full rounded-md bg-violet-300 p-5 md:h-[30vh] overflow-hidden transition-transform duration-300 transform-gpu group-hover:scale-105">
                {/* Black film overlay */}
                <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
                <div className="flex w-full flex-col justify-between z-20">
                  <h1 className="bento-title special-font max-w-64 text-white">
                    M<b>o</b>re co<b>m</b>ing so<b>o</b>n
                  </h1>
                  <TiLocationArrow
                    size={42}
                    className="mt-4 self-end text-white/80"
                  />
                </div>
              </div>
            </BentoTilt>
          </div>
        </div>

        {/* Categories tiles above link to /categories/[slug] pages */}
      </div>
    </section>
  );
};

export default Features;
