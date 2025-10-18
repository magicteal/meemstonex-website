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
  const t = useTranslation();
  const navItems = [t("products")];
  const [contactOpen, setContactOpen] = useState(false);

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
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Link href="/" aria-label="Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.png" alt="logo" className="w-10" />
            </Link>

            {/* <Button
              id="product-button"
              title="products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            /> */}
          </div>

          <div className="flex h-full items-center">
            <div
              className="hidden md:flex md:items-center md:gap-6"
              role="navigation"
              aria-label="Primary"
            >
              {navItems.map((item, index) => (
                <Link
                  className={`nav-hover-btn ${
                    isProductsPage ? "text-black" : "text-white"
                  }`}
                  key={index}
                  href="/products"
                  aria-label={`Go to ${item}`}
                >
                  {item}
                </Link>
              ))}
              <button
                className={`nav-hover-btn ${
                  isProductsPage ? "text-black" : "text-white"
                }`}
                onClick={() => setContactOpen(true)}
                aria-label="Open contact form"
              >
                Contact Us
              </button>
            </div>

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
                  } ${isProductsPage ? "text-black" : "text-white"}`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
};

export default Navbar;
