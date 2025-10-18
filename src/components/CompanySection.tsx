"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CompanySection() {
  return (
    <section className="bg-[#0f0e0e] py-60 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[500px] rounded-none overflow-hidden"
          >
            <Image
              src="/images/one.jpg"
              alt="Company Building"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title with decorative corners */}
            <div className="relative inline-block">
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#06b6a0]"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-white px-6 py-4">
                The Company
              </h2>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#06b6a0]"></div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              The journey of MeemstoneX began with a vision to revolutionize
              digital experiences through innovative design and cutting-edge
              technology. Over the years, we have diversified and expanded,
              creating immersive digital solutions that transform how brands
              connect with their audiences across the digital landscape.
            </p>

            {/* Read More Button */}
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#06b6a0] hover:bg-[#05a190] text-white font-semibold px-8 py-3 rounded-md flex items-center gap-2 transition-colors duration-300"
              >
                Read More
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
