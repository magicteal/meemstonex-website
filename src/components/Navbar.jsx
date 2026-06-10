"use client";
import React, { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "../lib/i18n";
import ContactFormModal from "./ContactFormModal";

const Navbar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const pathname = usePathname?.() || "/";
  const isProductsPage = pathname.startsWith("/products");
  const isHome = pathname === "/" || pathname === "";
  const t = useTranslation();

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // hide / show floating nav on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
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
    setIsAudioPlaying((p) => !p);
    setIsIndicatorActive((p) => !p);
  };

  useEffect(() => {
    if (!audioElementRef.current) return;
    if (isAudioPlaying) audioElementRef.current.play().catch(() => {});
    else audioElementRef.current.pause();
  }, [isAudioPlaying]);

  // nav text colour based on page + scroll state
  const hasScrolled = currentScrollY > 0;
  const isDarkThemePage = isProductsPage || pathname.startsWith("/categories");
  const navTextClass = isDarkThemePage
    ? "text-blue-50"
    : isHome
      ? hasScrolled ? "text-white" : "text-black"
      : "text-black";

  const desktopLinks = [
    { label: t("home") || "Home", href: "/" },
    { label: t("products") || "Products", href: "/products" },
  ];

  const mobileLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  return (
    <>
      {/* ── Main nav bar ── */}
      <div
        ref={navContainerRef}
        className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between p-4">
            {/* Logo slot */}
            <div className="flex items-center gap-7">
              <Link href="/" aria-label="Home" />
            </div>

            {/* Right controls */}
            <div className="flex h-full items-center">
              {/* Desktop links */}
              <div className="hidden md:flex md:items-center md:gap-6" role="navigation" aria-label="Primary">
                {desktopLinks.map(({ label, href }) => (
                  <Link key={href} className={`nav-hover-btn ${navTextClass}`} href={href} aria-label={`Go to ${label}`}>
                    {label}
                  </Link>
                ))}
                <button className={`nav-hover-btn ${navTextClass}`} onClick={() => setContactOpen(true)} aria-label="Open contact form">
                  {t("contact") || "Contact us"}
                </button>
              </div>

              {/* Hamburger — mobile only */}
              <button
                className={`ml-4 md:hidden inline-flex items-center justify-center w-10 h-10 ${navTextClass}`}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <span className="sr-only">Toggle menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Audio bars */}
              <button className="ml-6 flex items-center space-x-0.5" onClick={toggleAudioIndicator} aria-label="Toggle audio">
                <audio ref={audioElementRef} className="hidden" src="/audio/loop.mp3" loop />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={`indicator-line ${isIndicatorActive ? "active" : ""} ${navTextClass}`}
                    style={{ animationDelay: `${bar * 0.1}s` }}
                  />
                ))}
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* ── Mobile slide-in sheet (always in DOM, slides via CSS) ── */}
      <>
        {/* Backdrop — fades in/out */}
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none",
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Black panel */}
        <nav
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "82vw",
            maxWidth: "360px",
            zIndex: 999,
            backgroundColor: "#000",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.45s cubic-bezier(0.76,0,0.24,1)",
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#555", fontFamily: "var(--font-general, sans-serif)" }}>
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
            {mobileLinks.map(({ label, href }, idx) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "22px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(24px)",
                  transition: `opacity 0.45s ease ${0.15 + idx * 0.07}s, transform 0.45s ease ${0.15 + idx * 0.07}s`,
                }}
              >
                <span style={{ fontSize: "10px", color: "#444", fontWeight: 700, width: 22, textAlign: "right", letterSpacing: "0.15em", flexShrink: 0 }}>
                  0{idx + 1}
                </span>
                <span style={{ fontFamily: "var(--font-zentry, sans-serif)", fontSize: "clamp(2rem, 10vw, 2.5rem)", fontWeight: 900, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {label}
                </span>
                <span style={{ marginLeft: "auto", color: "#4f8cff", fontSize: "18px", opacity: 0.6 }}>→</span>
              </Link>
            ))}

            {/* Contact */}
            <button
              onClick={() => { setContactOpen(true); setMobileOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "22px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateX(0)" : "translateX(24px)",
                transition: `opacity 0.45s ease ${0.15 + mobileLinks.length * 0.07}s, transform 0.45s ease ${0.15 + mobileLinks.length * 0.07}s`,
              }}
            >
              <span style={{ fontSize: "10px", color: "#444", fontWeight: 700, width: 22, textAlign: "right", letterSpacing: "0.15em", flexShrink: 0 }}>
                0{mobileLinks.length + 1}
              </span>
              <span style={{ fontFamily: "var(--font-zentry, sans-serif)", fontSize: "clamp(2rem, 10vw, 2.5rem)", fontWeight: 900, textTransform: "uppercase", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {t("contact") || "Contact"}
              </span>
              <span style={{ marginLeft: "auto", color: "#4f8cff", fontSize: "18px", opacity: 0.6 }}>→</span>
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#333", fontFamily: "var(--font-general, sans-serif)" }}>
              Meemstonex © {new Date().getFullYear()}
            </p>
          </div>
        </nav>
      </>

      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Navbar;
