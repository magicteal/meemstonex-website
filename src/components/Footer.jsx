"use client";
import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "../lib/i18n";

const links = [
  { href: "https://instagram.com", label: "Instagram", icon: <FaInstagram /> },
  { href: "https://facebook.com", label: "Facebook", icon: <FaFacebook /> },
  { href: "https://www.whatsapp.com", label: "WhatsApp", icon: <FaWhatsapp /> },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-screen bg-black py-4 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          &copy; Meemstonex 2025, All rights reserved
        </p>

        <div className="flex justify-center gap-4 md:justify-start">
          {links.map((link) => (
            <a
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-white transition-colors duration-500 ease-in-out hover:text-blue-950"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* <a
            href="#privacy-policy"
            className="text-center text-sm hover:underline md:text-right"
          >
            {t("privacy_policy")}
          </a> */}

          <LanguageSelect />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const LanguageSelect = () => {
  const { lang, setLang } = useLanguage();
  return (
    <select
      id="lang"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="rounded bg-black text-white outline-none"
      aria-label="Language selector"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
};
