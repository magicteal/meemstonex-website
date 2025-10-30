"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  ShoppingCart,
  CheckCircle2,
  Truck,
} from "lucide-react";

const steps = [
  { id: 1, title: "Lets Connect One on One", Icon: Users },
  { id: 2, title: "Explore our Catalog", Icon: BookOpen },
  { id: 3, title: "Place The Order", Icon: ShoppingCart },
  { id: 4, title: "Approval", Icon: CheckCircle2 },
  { id: 5, title: "Delivery and Installation", Icon: Truck },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

const OurProcess = () => {
  return (
    <section className="relative w-full bg-black py-20 text-blue-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <p className="font-general text-[10px] uppercase tracking-wider text-blue-200/70">
            Our Process
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-widest text-white sm:text-3xl md:text-4xl">
            YOUR DREAM TEMPLE IN 5 STEPS
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-200/80">
            Looking to design your Dream Temple? Here's how you can get started.
          </p>
        </div>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row gap-6 md:gap-6 items-stretch md:items-center justify-start md:justify-between overflow-visible px-4 md:px-0 pb-2"
        >
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.li
                variants={itemVariants}
                className="flex flex-col items-center text-center w-full md:min-w-0 md:flex-1"
              >
                <div className="mb-5 flex  h-20 w-20   items-center justify-center rounded-full border border-blue-200/20 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm">
                  <step.Icon
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-blue-100"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-amber-300/90">
                  {step.id}
                </div>
                <div className="mt-1 max-w-[12rem] text-xs sm:text-sm md:text-base text-blue-100/90">
                  {step.title}
                </div>
              </motion.li>

              {/* connectors: vertical on mobile, horizontal on md+ */}
              {idx < steps.length - 1 && (
                <>
                  {/* mobile vertical connector */}
                  <div className="flex md:hidden w-full justify-center">
                    <div className="h-8 sm:h-10 w-px border-l border-dashed border-blue-200/40" />
                  </div>

                  {/* desktop horizontal connector */}
                  <div className="hidden md:flex items-center justify-center mt-10 md:mt-0">
                    <svg
                      width="80"
                      height="24"
                      viewBox="0 0 80 24"
                      fill="none"
                      className="text-blue-200/40"
                    >
                      <path
                        d="M2 12 C 20 12, 60 12, 78 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </motion.ul>
      </div>

      {/* subtle gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-blue-500/10 to-transparent" />
    </section>
  );
};

export default OurProcess;
