"use client";
import React, { useEffect, useRef, useState } from "react";
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

    // load next video src on-demand when user interacts
    setCurrentIndex(upcomingVideoIndex);
    if (nextVideoRef.current && !nextVideoRef.current.src) {
      nextVideoRef.current.src = getVideoSrc(upcomingVideoIndex);
      // try to play immediately once source is set
      nextVideoRef.current.play().catch(() => {});
    }
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

  // Lazy-load videos when hero comes into view
  useEffect(() => {
    const el = backgroundVideoRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback: load immediately
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
                  miniVideoRef.current.src = getVideoSrc(
                    (currentIndex % totalVideos) + 1
                  );
                }
                if (nextVideoRef.current && !nextVideoRef.current.src) {
                  nextVideoRef.current.src = getVideoSrc(currentIndex);
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

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
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
                preload="none"
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
            preload="none"
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
            preload="none"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-black">
          m<b>a</b>rbels
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
              containerClass="!bg-yellow-300 flex-center gap-1"
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
