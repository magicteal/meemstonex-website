"use client";

import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ArrowUpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-arrow-up"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );

  return (
    <footer className="bg-transparent text-white py-12 px-8">
      <div className="container mx-auto">
        {/* "Get in touch" Section */}
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
            Get in touch
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/60 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-sm">
            {/* Social Links */}
            <div className="flex space-x-8">
              <a
                href="#"
                className="hover:text-neutral-400 transition-colors duration-300"
              >
                LinkedIn →
              </a>
              <a
                href="#"
                className="hover:text-neutral-400 transition-colors duration-300"
              >
                Instagram →
              </a>
            </div>

            {/* Spacer */}
            <div className="hidden md:block"></div>

            {/* Back to Top */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 hover:text-neutral-400 transition-colors duration-300"
              >
                <span>Back to top</span>
                <ArrowUpIcon />
              </button>
            </div>

            {/* Copyright */}
            <div className="text-center col-span-2 md:col-span-1 md:text-right">
              <p className="text-neutral-400">
                © {new Date().getFullYear()} Meemstonex
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
