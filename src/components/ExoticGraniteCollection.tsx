"use client";
import { motion } from "framer-motion";
import React from "react";

export default function ExoticGraniteCollection({
  title = "Exotic Granite Collection",
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      className="py-20 bg-[#0f0e0e] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
            {title}
          </h2>
          <div className="flex justify-center items-center gap-6 text-sm text-rose-400 mb-6">
            <button className="border-b border-rose-400 pb-1">
              Granite by Colour
            </button>
            <span className="h-4 border-l border-gray-500" aria-hidden />
            <button className="text-gray-300">Granite by Spaces</button>
          </div>

          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Bringing nature’s finest hues to your homes with our range of
            glorious, imported granite. These striking shades are surely going
            to leave you and your guests awestruck!
          </p>
        </div>

        <div className="relative">
          <button
            aria-label="previous"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 text-black rounded-full w-10 h-10 items-center justify-center shadow-md z-10"
          >
            ←
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            <div className="flex flex-col items-center">
              <img
                src="/images/five.jpg"
                alt="White Granite"
                className="w-full h-[360px] object-cover shadow-md"
              />
              <div className="mt-6 text-center text-lg text-gray-200">
                White Granite
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/images/four.jpeg"
                alt="Yellow Granite"
                className="w-full h-[360px] object-cover shadow-md"
              />
              <div className="mt-6 text-center text-lg text-gray-200">
                Yellow Granite
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/images/three.jpeg"
                alt="Blue Granite"
                className="w-full h-[360px] object-cover shadow-md"
              />
              <div className="mt-6 text-center text-lg text-gray-200">
                Blue Granite
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/images/two.png"
                alt="Black Granite"
                className="w-full h-[360px] object-cover shadow-md"
              />
              <div className="mt-6 text-center text-lg text-gray-200">
                Black Granite
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
