"use client";
import React from "react";
import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const Story = () => {
  return (
    <section
      id="story"
      className="min-h-dvh w-screen bg-black text-blue-50 overflow-y-hidden"
    >
      <div className="flex size-full flex-col items-center pt-20 md:pt-28 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">
          the multiversal world of meemstonex
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="The st<b>o</b>ry of <br /> generations<b>"
            sectionId="#story"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />
          {/* Image removed as requested */}
        </div>

        <div className="flex w-full justify-center mt-10">
          <div className="flex h-full w-fit flex-col items-center">
            <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 px-3">
              For three generations, Meemstonex Marble has shaped the poetry of
              stone where earth’s finest artistry becomes a family’s enduring
              legacy. From the first chisel strike to today’s modern
              craftsmanship, our heritage lives in every vein, every polish, and
              every masterpiece we create. Guided by passion, precision, and
              pride, we honor nature’s grandeur by transforming raw marble into
              timeless expressions of beauty and strength. At Meemstonex, we
              don’t just work with stone we preserve tradition, craft stories,
              and carve the legacy of generations into every surface we touch
            </p>

            <a href="/products" className="mt-5">
              <Button
                id="realm-button"
                title="discover products"
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
