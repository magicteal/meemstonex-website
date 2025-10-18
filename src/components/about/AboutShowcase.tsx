"use client";
import React from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CometCard } from "@/components/ui/comet-card";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const AboutShowcase: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#06101a] via-[#0b1020] to-[#0f0e0e] py-12">
      <div className="max-w-5xl mx-auto px-8 my-8">
        <motion.div
          className="text-left mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TextGenerateEffect
            words="Showcase"
            className={`${poppins.variable} text-4xl md:text-6xl font-bold text-white`}
            duration={1}
          />
        </motion.div>

        <CometCard className="relative">
          <video
            className="w-full h-[480px] object-cover rounded-md shadow-lg border border-neutral-800"
            src="/videos/dummyVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            Your browser does not support the video tag.
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-md" />
        </CometCard>
      </div>
    </div>
  );
};

export default AboutShowcase;
