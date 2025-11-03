"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const router = useRouter();

  const totalVideos = 4;

  const miniVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const observerRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVideoClick = () => {
    setHasClicked(true);

    // Determine which video the mini is currently showing (so we play exactly that one).
    let chosen;
    try {
      const src = miniVideoRef.current && miniVideoRef.current.src;
      if (src) {
        const m = src.match(/hero-(\d+)\.mp4$/);
        if (m) chosen = Number(m[1]);
      }
    } catch (e) {}
    if (!chosen) chosen = (currentIndex % totalVideos) + 1;

    // Determine following indices
    const newMini = (chosen % totalVideos) + 1;
    const nextPreview = (newMini % totalVideos) + 1;

    // update state to the chosen video
    setCurrentIndex(chosen);

    // Update background (main) to the chosen video
    try {
      if (backgroundVideoRef.current) {
        try {
          backgroundVideoRef.current.preload = "metadata";
        } catch (e) {}
        backgroundVideoRef.current.src = getVideoSrc(chosen);
        backgroundVideoRef.current.load();
        backgroundVideoRef.current.play().catch(() => {});
      }
    } catch (e) {}

    // Update mini to show the following video (so it previews the next choice)
    try {
      if (miniVideoRef.current) {
        try {
          miniVideoRef.current.preload = "metadata";
        } catch (e) {}
        miniVideoRef.current.src = getVideoSrc(newMini);
        miniVideoRef.current.load();
        miniVideoRef.current.play().catch(() => {});
      }
    } catch (e) {}

    // Preload the preview/expanded video to the nextPreview index
    try {
      if (nextVideoRef.current) {
        try {
          nextVideoRef.current.preload = "metadata";
        } catch (e) {}
        nextVideoRef.current.src = getVideoSrc(nextPreview);
        nextVideoRef.current.load();
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
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
      // Fallback: load immediately
      try {
        el.preload = "metadata";
      } catch (e) {}
      el.src = getVideoSrc(currentIndex);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // load background video first
            if (!el.src) el.src = getVideoSrc(currentIndex);
            // load the mini/next video sources lazily after a short delay
            setTimeout(() => {
              try {
                if (miniVideoRef.current && !miniVideoRef.current.src) {
                  try {
                    miniVideoRef.current.preload = "metadata";
                  } catch (e) {}
                  miniVideoRef.current.src = getVideoSrc(
                    (currentIndex % totalVideos) + 1
                  );
                }
                if (nextVideoRef.current && !nextVideoRef.current.src) {
                  try {
                    nextVideoRef.current.preload = "metadata";
                  } catch (e) {}
                  // next video should be the upcoming index (not the current one)
                  const upcoming = (currentIndex % totalVideos) + 1;
                  nextVideoRef.current.src = getVideoSrc(upcoming);
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
  }, [currentIndex]);

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

  const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;
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
                // src will be assigned lazily by IntersectionObserver
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
            // src assigned lazily when hero enters view or on interaction
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
            // src assigned lazily by IntersectionObserver
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* <h1 className="special-font hero-heading absolute </div>bottom-5 right-5 z-40 text-black">
          m<b</div>>a</b>rbels
        </h1> */}

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-black">
              MEEMSTO<b>n</b>EX
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-black">
              Enter the world of <br /> marbles with MEEMSTONEX
            </p>

            <Button
              id="watch-trailer"
              title="Explore Products"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-white flex-center gap-1"
              onClick={() => router.push("/products")}
            />
          </div>
        </div>
      </div>

      {/* <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        m<b>a</b>rbels
      </h1> */}
    </div>
  );
};

export default Hero;
