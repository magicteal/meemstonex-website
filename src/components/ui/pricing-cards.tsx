"use client";

import React from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const PricingCards: React.FC = () => {
  return (
    <section className={`${poppins.className} py-20 text-white`}>
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
            Our pricing is transparent,
          </h2>
          <p className="text-4xl text-neutral-600 mt-2">
            just like our process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left card - dark */}
          <div className="relative bg-neutral-900 border border-neutral-800 p-8 shadow-sm overflow-hidden transition-all duration-400 hover:scale-[1.01] hover:shadow-lg">
            {/* glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "0 0 40px rgba(232,59,27,0.18)" }}
            />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-neutral-400">Material Supply</h3>
                <p className="text-neutral-500 text-xs">
                  For clients who need premium
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                <span className="text-2xl text-rose-500">₹</span>
                <span>6,000</span>
              </div>
            </div>

            <ul className="mt-8 space-y-2 text-sm text-neutral-400">
              <li>Wide Range of Material Selection</li>
              <li>Expert Material Consultation</li>
              <li>Quality Assurance Checks</li>
              <li>3-5 Business Day Delivery</li>
            </ul>

            <div className="mt-8">
              <button className="relative overflow-hidden w-full bg-white text-black py-3">
                <span className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-white/20 via-white/40 to-white/10 transition-transform duration-500 ease-out hover:translate-x-0" />
                <span className="relative">Get a Quote</span>
              </button>
            </div>
          </div>

          {/* Right card - orange */}
          <div className="relative bg-[#e83b1b] p-8 shadow-sm overflow-hidden transition-all duration-400 hover:scale-[1.01] hover:shadow-lg">
            <div
              className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300"
              style={{ boxShadow: "0 0 48px rgba(0,0,0,0.06)" }}
            />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-neutral-50">
                  Supply & Installation
                </h3>
                <p className="text-neutral-100 text-xs">
                  An end-to-end solution
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-4xl font-bold text-white flex items-baseline gap-2">
                <span className="text-2xl">₹</span>
                <span>18,000</span>
                <span className="text-sm text-neutral-200">/month</span>
              </div>
            </div>

            <ul className="mt-8 space-y-2 text-sm text-neutral-50">
              <li>Includes Everything in Material Supply</li>
              <li>Professional Site Measurement & Planning</li>
              <li>Expert Installation Team</li>
              <li>Post-Installation Support & Guidance</li>
            </ul>

            <div className="mt-8">
              <button className="relative overflow-hidden w-full bg-neutral-900/40 text-white py-3">
                <span className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-white/10 via-white/20 to-white/5 transition-transform duration-600 ease-out hover:translate-x-0" />
                <span className="relative">Request a Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
