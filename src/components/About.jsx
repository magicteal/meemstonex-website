"use client";

import React, { useEffect, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Image from "next/image";
import AboutImageTrail from "./AboutImageTrail";
import { getHomepageSettings } from "../services/api";

// Simple image section with a black film overlay; text styling retained
const About = () => {
  const [imageUrl, setImageUrl] = useState("https://meemstonex-bucket.s3.ap-south-1.amazonaws.com/meemstonex-static/img/sub-hero.webp");
  const [title, setTitle] = useState("Disc<b>o</b>ver the world of <br /> W<b>o</b>rld with Meemstonex");
  const [subtext, setSubtext] = useState("Welcome to Meemstonex");
  const [trailImages, setTrailImages] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.about) {
          if (data.about.imageUrl) setImageUrl(data.about.imageUrl);
          if (data.about.title) setTitle(data.about.title);
          if (data.about.subtext) setSubtext(data.about.subtext);
          if (Array.isArray(data.about.trailImages)) setTrailImages(data.about.trailImages);
        }
      } catch (err) {
        console.error("Failed to load about settings:", err);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div id="about" className="w-screen">
      <section className="relative w-screen min-h-[95vh]">
        {/* Background image */}
        <Image
          src={imageUrl}
          alt="Background"
          fill
          className="absolute inset-0 size-full object-cover"
          sizes="100vw"
          priority={false}
        />

        {/* Black overlay film */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* Image trail overlay (active on hover over image area) */}
        <AboutImageTrail items={trailImages} />

        {/* Text content (unchanged styling) */}
        <div className="relative z-10 flex min-h-[95vh] w-full flex-col items-center justify-center gap-5 px-4 text-center">
          <h2 className="font-general text-sm uppercase md:text-[10px]">
            {subtext}
          </h2>

          <AnimatedTitle
            title={title}
            containerClass="mt-5 !text-white text-center h-full"
          />

        </div>
      </section>
    </div>
  );
};

export default About;
