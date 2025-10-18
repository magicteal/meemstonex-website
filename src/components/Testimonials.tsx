"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Testimonials() {
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
      className="py-20 bg-[url('/images/marble-bg.jpg')] bg-cover bg-center text-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeInUp}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
            Testimonials
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            An outpour of appreciation for our promise of excellence. This is
            what keeps us delivering only the best to all our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Testimonial video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="text-white">
            <div className="flex items-start gap-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-rose-400"
              >
                <path d="M7 7h3v6H7z" fill="#ef4444" />
                <path d="M14 7h3v6h-3z" fill="#ef4444" />
              </svg>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  Kanishka Choudhry
                </h3>
                <p className="text-sm text-rose-200">
                  Studio Ergonomics, Architect
                </p>
              </div>
            </div>

            <blockquote className="mt-8 text-gray-300 text-lg leading-relaxed">
              “We wanted to show our client what exactly marble can do for their
              place. R K Marble Experience Center can give you the best
              experience of that.”
            </blockquote>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
                <span className="w-3 h-3 rounded-full bg-transparent border-2 border-white/60" />
                <span className="w-3 h-3 rounded-full bg-transparent border-2 border-white/60" />
                <span className="w-3 h-3 rounded-full bg-transparent border-2 border-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
