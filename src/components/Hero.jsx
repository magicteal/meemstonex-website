"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { getHomepageSettings } from "../services/api";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const router = useRouter();

  const [heroHeading, setHeroHeading] = useState("MEEMSTONEX");
  const [heroParagraph, setHeroParagraph] = useState("Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces. Crafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces.");
  const [heroButtonTitle, setHeroButtonTitle] = useState("Explore Products");
  const [heroButtonLink, setHeroButtonLink] = useState("/products");
  const [videos, setVideos] = useState([
    "/videos/hero-1.mp4",
    "/videos/hero-2.mp4",
    "/videos/hero-3.mp4",
    "/videos/hero-4.mp4",
    "/videos/hero-2.mp4"
  ]);

  const miniVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const observerRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.hero) {
          if (data.hero.heading) setHeroHeading(data.hero.heading);
          if (data.hero.paragraph) {
            const p = data.hero.paragraph;
            if (
              p === "Enter the world of\nmarbles with MEEMSTONEX" ||
              p === "Crafting timeless luxury from nature's finest elements.\nExperience the poetry of premium stones and marbles designed to elevate your architecture." ||
              p === "Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces.\nCrafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces."
            ) {
              setHeroParagraph("Enter the world of Meemstonex, where raw natural stones are transformed into timeless architectural masterpieces. Crafting unmatched luxury for three generations, our premium marble collection brings custom precision and breathtaking beauty to your spaces.");
            } else {
              setHeroParagraph(p);
            }
          }
          if (data.hero.buttonTitle) setHeroButtonTitle(data.hero.buttonTitle);
          if (data.hero.buttonLink) setHeroButtonLink(data.hero.buttonLink);
          if (Array.isArray(data.hero.videos) && data.hero.videos.length > 0) {
            setVideos(data.hero.videos);
          }
        }
      } catch (err) {
        console.error("Failed to load homepage settings:", err);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMiniVideoClick = () => {
    setHasClicked(true);

    const clickedIndex = (currentIndex + 1) % videos.length;
    const newMiniIndex = (clickedIndex + 1) % videos.length;
    const nextPreviewIndex = (newMiniIndex + 1) % videos.length;

    setCurrentIndex(clickedIndex);

    // Update background (main) to the chosen video
    try {
      if (backgroundVideoRef.current) {
        backgroundVideoRef.current.preload = "auto";
        backgroundVideoRef.current.src = videos[clickedIndex];
        backgroundVideoRef.current.load();
        backgroundVideoRef.current.play().catch(() => {});
      }
    } catch (e) {}

    // Update mini to show the following video (so it previews the next choice)
    try {
      if (miniVideoRef.current) {
        miniVideoRef.current.preload = "metadata";
        miniVideoRef.current.src = videos[newMiniIndex];
        miniVideoRef.current.load();
        miniVideoRef.current.play().catch(() => {});
      }
    } catch (e) {}

    // Preload the preview/expanded video to the next preview index
    try {
      if (nextVideoRef.current) {
        nextVideoRef.current.preload = "metadata";
        nextVideoRef.current.src = videos[nextPreviewIndex];
        nextVideoRef.current.load();
      }
    } catch (e) {}
  };

  useEffect(() => {
    // Hide loading screen as soon as the main background video is ready
    if (loadedVideos >= 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", {
          visibility: "visible",
        });

        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current && nextVideoRef.current.play(),
        });

        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useEffect(() => {
    const el = backgroundVideoRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      try {
        el.preload = "auto";
      } catch (e) {}
      el.src = videos[currentIndex];
      return;
    }

    if (!el.src) {
      el.preload = "auto";
      el.src = videos[currentIndex];
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!el.src) el.src = videos[currentIndex];
            setTimeout(() => {
              try {
                if (miniVideoRef.current && !miniVideoRef.current.src) {
                  miniVideoRef.current.preload = "metadata";
                  miniVideoRef.current.src = videos[(currentIndex + 1) % videos.length];
                }
                if (nextVideoRef.current && !nextVideoRef.current.src) {
                  nextVideoRef.current.preload = "metadata";
                  nextVideoRef.current.src = videos[(currentIndex + 1) % videos.length];
                }
              } catch (e) {}
            }, 500);

            observerRef.current.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(el);

    return () => observerRef.current && observerRef.current.disconnect();
  }, [currentIndex, videos]);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  useGSAP(() => {
    if (!heroHeading) return;
    const tl = gsap.timeline();
    
    tl.to(".hero-char", {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      duration: 0.01,
    });
  }, [heroHeading]);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-y-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={miniVideoRef}
                loop
                muted
                playsInline
                preload="metadata"
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          <video
            ref={nextVideoRef}
            loop
            muted
            playsInline
            preload="metadata"
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          <video
            ref={backgroundVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <div className="absolute left-0 top-0 z-40 size-full flex flex-col">

          {/* Full-screen gradient — dark at top and bottom, clear in center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* ── Center Content ── */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-4 text-center">

            {/* Eyebrow badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.07)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#fff", opacity: 0.6 }}
              />
              <span
                className="font-general text-[10px] font-bold uppercase tracking-[0.3em] text-white"
                style={{ opacity: 0.7 }}
              >
                Premium Marble Collection
              </span>
            </div>

            {/* Heading */}
            <h1
              className="special-font hero-heading text-white"
              style={{
                textAlign: "center",
                textShadow: "0 4px 32px rgba(0,0,0,0.5)",
                maxWidth: "90vw",
              }}
            >
              {heroHeading.split("").map((char, index) => (
                <span key={index} className="hero-char inline-block opacity-0">
                  {char === "N" ? <b className="lowercase">n</b> : char}
                </span>
              ))}
            </h1>

            {/* Thin divider */}
            <div
              className="my-5 w-12"
              style={{ height: "1px", background: "rgba(255,255,255,0.25)" }}
            />

            {/* Paragraph */}
            <p
              className="font-general text-white/70"
              style={{
                fontSize: "clamp(0.8rem, 2.2vw, 1rem)",
                lineHeight: 1.75,
                maxWidth: "34rem",
                letterSpacing: "0.03em",
                textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                whiteSpace: "pre-line",
              }}
            >
              {heroParagraph}
            </p>

            {/* CTA Button */}
            <button
              id="watch-trailer"
              onClick={() => router.push(heroButtonLink)}
              className="mt-8 group flex items-center gap-2 rounded-full font-general text-xs font-bold uppercase tracking-widest text-black transition-all duration-300"
              style={{
                background: "#fff",
                padding: "14px 32px",
                boxShadow: "0 0 0 0 rgba(255,255,255,0)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 30px 6px rgba(255,255,255,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0 0 rgba(255,255,255,0)"; }}
            >
              <TiLocationArrow className="text-base" />
              {heroButtonTitle}
            </button>
          </div>

          {/* ── Bottom Bar ── */}
          <div
            className="relative flex items-center justify-between px-6 pb-6 pt-2 sm:px-10"
          >
            {/* Scroll hint */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-5 items-start justify-center rounded-full border p-1"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}
              >
                <div
                  className="h-1.5 w-0.5 rounded-full bg-white"
                  style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}
                />
              </div>
              <span
                className="font-general text-[9px] uppercase tracking-[0.25em] text-white"
                style={{ opacity: 0.4 }}
              >
                Scroll
              </span>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
