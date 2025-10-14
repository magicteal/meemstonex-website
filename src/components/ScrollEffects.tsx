"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once on the client
if (typeof window !== "undefined" && !gsap.getProperty("ScrollTrigger")) {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollEffects sets up:
 * 1. Lenis smooth scrolling
 * 2. GSAP reveal-on-scroll animations for elements with .reveal-on-scroll
 */
export default function ScrollEffects() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      syncTouch: true,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return window.scrollY || document.documentElement.scrollTop;
      },
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    // GSAP reveal animations
    const elements = gsap.utils.toArray<HTMLElement>(".reveal-on-scroll");
    elements.forEach((el: HTMLElement) => {
      gsap.set(el, { opacity: 0, y: 40 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.9,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null; // No UI
}
