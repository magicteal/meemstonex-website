"use client";
import React from "react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const NumbersSection: React.FC = () => {
  const stats = [
    { value: "122,637+", label: "Users Globally" },
    { value: "$6,990", label: "Average Balance Per User" },
    { value: "56+", label: "User Satisfaction Rate" },
    { value: "95%", label: "Countries Supported" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
      },
    }),
  };

  return (
    <section className="w-full bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className={`${poppins.variable} text-3xl md:text-4xl font-semibold text-gray-900 mb-4`}
            >
              The <span className="font-extrabold">Numbers</span> Behind
              <br /> Our Mission
            </h3>
            <p className="text-gray-600 max-w-xl">
              Solvance is more than just a platform — it&#39;s a growing
              community of individuals and businesses working toward financial
              clarity. These numbers reflect our commitment to innovation,
              trust, and real results for every user.
            </p>
          </motion.div>

          {/* Right stats */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-[#0f413b] text-white rounded-xl p-8 shadow-lg border border-neutral-800"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  <div className="text-4xl md:text-5xl font-extrabold">
                    {stat.value}
                  </div>
                  <div className="text-neutral-300 mt-2 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NumbersSection;
