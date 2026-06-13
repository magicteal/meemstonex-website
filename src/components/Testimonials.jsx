"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import AnimatedTitle from "./AnimatedTitle";
import { getHomepageSettings } from "../services/api";

const TestimonialCard = ({ item }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-neutral-950/40 backdrop-blur-md overflow-hidden shadow-xl transition-all duration-500 hover:border-white/20 hover:bg-neutral-900/60">
      <div className="relative aspect-[9/16] w-full bg-black">
        <video
          ref={videoRef}
          src={item.video}
          className="h-full w-full object-cover"
          playsInline
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play testimonial video"
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-xl">
              <FaPlay className="text-lg" />
            </span>
          </button>
        )}
      </div>

      {(item.name || item.role) && (
        <div className="p-4 sm:p-5 border-t border-white/5">
          {item.name && (
            <h4 className="truncate font-general text-sm font-bold uppercase tracking-wide text-white">
              {item.name}
            </h4>
          )}
          {item.role && (
            <p className="truncate font-circular-web text-[10px] font-semibold uppercase tracking-widest text-blue-400/80 mt-0.5">
              {item.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Testimonials = () => {
  const [visible, setVisible] = useState(false);
  const [subtitle, setSubtitle] = useState("What Our Clients Say");
  const [title, setTitle] = useState("TESTIMONIALS");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.testimonials) {
          setVisible(Boolean(data.testimonials.visible));
          if (data.testimonials.subtitle) setSubtitle(data.testimonials.subtitle);
          if (data.testimonials.title) setTitle(data.testimonials.title);
          if (Array.isArray(data.testimonials.items)) setItems(data.testimonials.items);
        }
      } catch (err) {
        console.error("Failed to load testimonials settings:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function updatePerView() {
      const w = window.innerWidth;
      if (w >= 1024) setPerView(3);
      else if (w >= 640) setPerView(2);
      else setPerView(1);
    }
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  const visibleItems = items.filter((item) => item && item.video);

  const maxIndex = Math.max(0, visibleItems.length - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  if (loading || !visible || visibleItems.length === 0) {
    return null;
  }

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="testimonials" className="w-screen bg-black text-blue-50 py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col items-center">
        <p className="font-general text-xs uppercase tracking-[0.25em] text-blue-400 opacity-80 mb-4 text-center">
          {subtitle}
        </p>

        <div className="relative w-full mb-12">
          <AnimatedTitle
            title={title}
            sectionId="#testimonials"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10 text-center"
          />
        </div>

        <div className="relative w-full px-0 sm:px-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
            >
              {visibleItems.map((item, i) => (
                <div
                  key={i}
                  className="shrink-0 px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous testimonials"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-xl transition-colors hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={index === maxIndex}
            aria-label="Next testimonials"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-xl transition-colors hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
