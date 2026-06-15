"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { slugify } from "../lib/categories";
import { TiLocationArrow } from "react-icons/ti";
import { getHomepageSettings } from "../services/api";
import { DEFAULT_FEATURE_TILES, mergeFeatureTiles } from "../lib/featureTiles";

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
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minWidth: "100%",
        height: "100%",
        minHeight: "100%",
        maxWidth: "none",
        objectFit: "cover",
      }}
      {...rest}
    />
  );
};

const BentoCard = ({ src, title, description, href, label }) => {
  return (
    <div className="relative w-full h-48 md:h-auto md:aspect-square overflow-hidden rounded-md transition-transform duration-300 ease-out will-change-transform transform-gpu group-hover:scale-105 z-20 group-hover:z-40 bg-black">
      <LazyVideo
        src={src}
        className="absolute inset-0 size-full object-cover object-center"
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font uppercase tracking-wider">{title}</h1>
          {description && (
            <p className="mt-2 max-w-64 text-xs md:text-sm opacity-80 font-robert-regular border-l-2 border-blue-500 pl-3">{description}</p>
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
  const [subtitle, setSubtitle] = useState("Where Everyday Elegance Meets a World of Interconnected Luxury");
  const [description, setDescription] = useState("Immerse yourself in a rich and ever-expanding universe where our vibrant array of marble products seamlessly converge, creating an interconnected overlay of refined experiences within your home");
  const [orderedTiles, setOrderedTiles] = useState(DEFAULT_FEATURE_TILES);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.features) {
          if (data.features.subtitle) setSubtitle(data.features.subtitle);
          if (data.features.description) setDescription(data.features.description);

          let tiles = mergeFeatureTiles(data.features.tiles);
          if (Array.isArray(data.features.tilesOrder) && data.features.tilesOrder.length > 0) {
            const order = data.features.tilesOrder;
            tiles = [...tiles].sort((a, b) => {
              const idxA = order.indexOf(a.key);
              const idxB = order.indexOf(b.key);
              const valA = idxA === -1 ? 999 : idxA;
              const valB = idxB === -1 ? 999 : idxB;
              return valA - valB;
            });
          }
          setOrderedTiles(tiles);
        }
      } catch (err) {
        console.error("Failed to load features settings:", err);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const tileRefs = useRef([]);
  const [visible, setVisible] = useState(() =>
    new Array(DEFAULT_FEATURE_TILES.length).fill(false)
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
  }, [orderedTiles]);

  return (
    <section className="bg-black pb-20">
      <div className="container mx-auto px-4 md:px-10">
        <div className="px-5 py-16 md:py-32">
          <p className="font-circular-web text-base md:text-lg text-blue-50">
            {subtitle}
          </p>
          <p className="mt-3 max-w-md font-circular-web text-sm md:text-lg text-blue-50 opacity-50">
            {description}
          </p>
        </div>

        {/* Categories grid: show TABLE TOP alongside others as equal tiles on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {orderedTiles.map((t, index) => {
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
                key={t.key}
                ref={(el) => (tileRefs.current[index] = el)}
                className={`group ${baseAnim} ${enterAnim}`}
              >
                <BentoTilt className={`bento-tilt`}>
                  <BentoCard
                    src={t.video}
                    title={t.name}
                    href={`/categories/${slugify(t.key)}`}
                    label={`View ${t.name} category`}
                    description={t.desc}
                  />
                </BentoTilt>
              </div>
            );
          })}

          {/* More coming soon tile */}
          <div className="group bento-tilt md:col-span-3">
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
