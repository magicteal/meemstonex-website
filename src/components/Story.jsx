"use client";
import React, { useEffect, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import { getHomepageSettings } from "../services/api";

const Story = () => {
  const [subtitle, setSubtitle] = useState("the multiversal world of meemstonex");
  const [title, setTitle] = useState("The st<b>o</b>ry of <br /> generations");
  const [description, setDescription] = useState(
    "For three generations, Meemstonex Marble has shaped the poetry of stone where earth’s finest artistry becomes a family’s enduring legacy. From the first chisel strike to today’s modern craftsmanship, our heritage lives in every vein, every polish, and every masterpiece we create. Guided by passion, precision, and pride, we honor nature’s grandeur by transforming raw marble into timeless expressions of beauty and strength. At Meemstonex, we don’t just work with stone we preserve tradition, craft stories, and carve the legacy of generations into every surface we touch"
  );
  const [buttonTitle, setButtonTitle] = useState("discover products");

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const data = await getHomepageSettings();
        if (!mounted) return;
        if (data?.story) {
          if (data.story.subtitle) setSubtitle(data.story.subtitle);
          if (data.story.title) setTitle(data.story.title);
          if (data.story.description) setDescription(data.story.description);
          if (data.story.buttonTitle) setButtonTitle(data.story.buttonTitle);
        }
      } catch (err) {
        console.error("Failed to load story settings:", err);
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="story"
      className="min-h-dvh w-screen bg-black text-blue-50 overflow-y-hidden"
    >
      <div className="flex size-full flex-col items-center pt-20 md:pt-28 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">
          {subtitle}
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title={title}
            sectionId="#story"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />
          {/* Image removed as requested */}
        </div>

        <div className="flex w-full justify-center mt-10">
          <div className="flex h-full w-fit flex-col items-center">
            <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 px-3">
              {description}
            </p>

            <a href="/products" className="mt-5">
              <Button
                id="realm-button"
                title={buttonTitle}
                containerClass=""
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
