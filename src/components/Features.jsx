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
    <div className="relative w-full h-48 md:h-[55vh] overflow-hidden rounded-md">
      <LazyVideo
        src={src}
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 text-blue-50">
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
          className="absolute inset-0 z-20"
        />
      )}
    </div>
  );
};

const Features = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-7">
          {[
            {
              name: "TABLE TOP",
              video: "videos/feature-1.mp4",
              desc: "Where sophistication meets strength — Meemstonex Counters, crafted to define modern elegance in every space",
            },
            {
              name: "Marble temple",
              video: "videos/feature-2.mp4",
              desc: "Meemstonex Mandirs sacred spaces sculpted in pure marble, embodying devotion, peace, and eternal grace",
            },
            {
              name: "MARBLE MASJID WORK",
              video: "videos/feature-1.mp4",
              desc: "Sacred mosque elements crafted in premium marble with uncompromising quality.",
            },
            {
              name: "STONE FOUNTAIN",
              video: "videos/feature-1.mp4",
              desc: "Let serenity flow with Meemstonex Fountains, where artistry in stone brings movement, life, and timeless beauty.",
            },
            {
              name: "INLAY WORK",
              video: "videos/feature-5.mp4",
              desc: "Artful stone inlay that blends tradition with precision craftsmanship.",
            },
            {
              name: "WALL PANELS",
              video: "videos/feature-2.mp4",
              desc: "Statement wall claddings in marble that elevate interiors with depth and texture.",
            },
            {
              name: "MORAL",
              video: "videos/feature-5.mp4",
              desc: "Expressive marble mural work designed to narrate elegance in stone.",
            },
            {
              name: "MARBLE WASH BASIN",
              video: "videos/feature-1.mp4",
              desc: "Sleek and refined basins carved from premium marble for timeless bathrooms.",
            },
            {
              name: "HANDICRAFTS PRODUCTS",
              video: "videos/feature-2.mp4",
              desc: "Handcrafted marble artefacts that showcase intricate workmanship.",
            },
          ].map((t) => (
            <BentoTilt key={t.name} className="bento-tilt">
              <BentoCard
                src={t.video}
                title={t.name}
                href={`/categories/${slugify(t.name)}`}
                label={`View ${t.name} category`}
                description={t.desc}
              />
            </BentoTilt>
          ))}

          {/* More coming soon tile */}
          <BentoTilt className="bento-tilt md:col-span-2">
            <div className="flex h-48 w-full rounded-md bg-violet-300 p-5 md:h-[40vh]">
              <div className="flex w-full flex-col justify-between">
                <h1 className="bento-title special-font max-w-64 text-black">
                  M<b>o</b>re co<b>m</b>ing so<b>o</b>n
                </h1>
                <TiLocationArrow className="m-5 scale-[3] self-end text-black/80" />
              </div>
            </div>
          </BentoTilt>
        </div>

        {/* Categories tiles above link to /categories/[slug] pages */}
      </div>
    </section>
  );
};

export default Features;
