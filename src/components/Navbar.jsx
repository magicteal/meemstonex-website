"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
// import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "../lib/i18n";
import ContactFormModal from "./ContactFormModal";

// navItems will be translated inside the component using useTranslation

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const pathname = usePathname?.() || "/";
  const isProductsPage = pathname.startsWith("/products");
  const isHome = pathname === "/" || pathname === "";
  const t = useTranslation();
  const navItems = [t("products")];
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying(!isAudioPlaying);
    setIsIndicatorActive(!isIndicatorActive);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      {/** Decide nav text color based on route and scroll */}
      {/** On /products: black at top, white when scrolled; Elsewhere keep current (white) */}
      {(() => {
        return null;
      })()}
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Link href="/" aria-label="Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img src="/img/logo.png" alt="logo" className="w-10" /> */}
            </Link>

            {/* <Button
              id="product-button"
              title="products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            /> */}
          </div>

          {/** compute class once per render */}
          {(() => {
            const hasScrolled = currentScrollY > 0;
            // On products and home pages: make nav text white when user scrolls
            // Elsewhere keep the existing (black) text
            const navTextClass =
              isProductsPage || isHome
                ? hasScrolled
                  ? "text-white"
                  : "text-black"
                : "text-black";
            return (
              <div className="flex h-full items-center">
                <div
                  className="hidden md:flex md:items-center md:gap-6"
                  role="navigation"
                  aria-label="Primary"
                >
                  {navItems.map((item, index) => (
                    <Link
                      className={`nav-hover-btn ${navTextClass}`}
                      key={index}
                      href="/products"
                      aria-label={`Go to ${item}`}
                    >
                      {item}
                    </Link>
                  ))}
                  {/* desktop contact (kept hidden if needed) */}
                  <button
                    className={`nav-hover-btn ${navTextClass}`}
                    onClick={() => setContactOpen(true)}
                    aria-label="Open contact form"
                  >
                    Contact
                  </button>
                </div>

                {/* mobile hamburger */}
                <button
                  className={`ml-4 md:hidden inline-flex items-center justify-center rounded-md p-2 ${navTextClass} hover:bg-gray-100/10`}
                  aria-controls="mobile-menu"
                  aria-expanded={mobileOpen}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {mobileOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>

                <button
                  className="ml-10 flex items-center space-x-0.5"
                  onClick={toggleAudioIndicator}
                >
                  <audio
                    ref={audioElementRef}
                    className="hidden"
                    src="/audio/loop.mp3"
                    loop
                  />

                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`indicator-line ${
                        isIndicatorActive ? "active" : ""
                      } ${navTextClass}`}
                      style={{ animationDelay: `${bar * 0.1}s` }}
                    />
                  ))}
                </button>
              </div>
            );
          })()}
        </nav>
      </header>
      {/* mobile menu overlay and panel */}
      {mobileOpen && (
        <div>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <nav
            id="mobile-menu"
            className="fixed inset-x-4 top-20 z-50 rounded-lg bg-black p-4 shadow-lg md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <ul className="flex flex-col gap-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href="/products"
                    className="block w-full rounded-md bg-blue-600 px-3 py-3 text-center text-base font-medium text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setContactOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-md bg-blue-600 px-3 py-3 text-center text-base font-medium text-white"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
};

export default Navbar;
