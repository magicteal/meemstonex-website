"use client";

import React from "react";
import { useLocale } from "@/lib/locale";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const ArrowUpIcon: React.FC = () => (
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

const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className={`${poppins.className} bg-transparent text-white px-8 mt-32`}
    >
      <div className="container mx-auto">
        {/* Language selector above the rule */}
        <div className="w-full flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Rule above heading */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-32 h-px bg-neutral-700" />
        </div>

        {/* "Get in touch" Section */}
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter drop-shadow-lg">
            Get in touch
          </h2>
        </div>

        {/* Socials centered under the heading */}
        <div className="flex justify-center gap-8 mb-12">
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
          <a
            href="#"
            className="hover:text-neutral-400 transition-colors duration-300"
          >
            Facebook →
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/60 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-sm">
            {/* Copyright (left) */}
            <div className="text-left">
              <p className="text-neutral-400">2025 All rights reserved</p>
            </div>

            {/* Back to Top (center) */}
            <div className="flex justify-center">
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 hover:text-neutral-400 transition-colors duration-300"
              >
                <span>Back to top</span>
                <ArrowUpIcon />
              </button>
            </div>

            {/* Empty right column for symmetry */}
            <div />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

function LanguageSwitcher() {
  // This component is client-only because Footer already has "use client" at the top.
  const { locale, setLocale } = useLocale();

  const setLang = (l: "en" | "hi") => {
    if (l === locale) return;
    setLocale(l);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded ${
          locale === "en"
            ? "bg-white text-black"
            : "bg-transparent text-neutral-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-3 py-1 rounded ${
          locale === "hi"
            ? "bg-white text-black"
            : "bg-transparent text-neutral-400 hover:text-white"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
