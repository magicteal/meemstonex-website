"use client";
import React from "react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const MissionVision: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
      },
    }),
  };

  return (
    <section className="w-full bg-gradient-to-r from-[#0b0f10] via-[#07121a] to-[#061018] py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left large intro */}
          <motion.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 text-sm text-neutral-400 uppercase tracking-wider">
              [ From Complexity to Clarity ]
            </div>
            <h2
              className={`${poppins.variable} text-3xl md:text-5xl font-semibold text-white leading-tight`}
            >
              Solvance was founded to make financial freedom accessible through
              technology what began as a tool to simplify money management.
            </h2>
          </motion.div>

          {/* Right cards */}
          <div className="order-1 md:order-2 grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2">
            <motion.div
              className="bg-[#073432] rounded-xl p-6 shadow-lg border border-neutral-800"
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  {/* placeholder icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Vision</h4>
                  <p className="text-neutral-300 mt-2 text-sm">
                    To become the world&#39;s most trusted personal finance
                    ecosystem — where clarity, control, and growth come
                    standard.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#073432] rounded-xl p-6 shadow-lg border border-neutral-800"
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4M7.5 12a5.5 5.5 0 1111 0v6h-11v-6z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">Mission</h4>
                  <p className="text-neutral-300 mt-2 text-sm">
                    To help people build sustainable wealth by delivering
                    intuitive financial solutions that adapt to their lives.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
