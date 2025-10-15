"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/section-header";
import AboutShowcase from "@/components/about/AboutShowcase";
import MissionVision from "@/components/about/MissionVision";
import NumbersSection from "@/components/about/NumbersSection";

const AboutPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="text-white">
      {/* Header - Fade in on load */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <SectionHeader
          title="Our"
          highlight="Story"
          subtitle="Crafting legacies in stone since our inception."
        />
      </motion.div>

      <main>
        {/* Showcase - Slide in from left */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInLeft}
        >
          <AboutShowcase />
        </motion.div>

        {/* Mission & Vision - Fade in up */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <MissionVision />
        </motion.div>

        {/* Numbers / Stats - Slide in from right */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideInRight}
        >
          <NumbersSection />
        </motion.div>

        {/* Visit Studio CTA - Fade in up */}
        <motion.div
          className="max-w-4xl mx-auto px-8 py-12 text-center text-neutral-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <h3 className="text-2xl md:text-3xl mb-4">Visit our studio</h3>
          <p className="mb-6">
            Schedule a visit to see our materials and workshop in person.
          </p>
          <a className="inline-block bg-teal-400 text-black font-semibold px-6 py-3 rounded-md">
            Schedule a Visit
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutPage;
