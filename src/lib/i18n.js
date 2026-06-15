"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    home: "Home",
    products: "Products",
    blog: "Blog",
    privacy_policy: "Privacy Policy",
    contact: "Contact us",
    footer_copyright: "© Meemstonex 2025, All rights reserved",
    language_english: "English",
    language_hindi: "हिन्दी",
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    blog: "ब्लॉग",
    privacy_policy: "गोपनीयता नीति",
    contact: "संपर्क करें",
    footer_copyright: "© 2025 मीमस्टोनेक्स, सर्वाधिकार सुरक्षित",
    language_english: "English",
    language_hindi: "हिन्दी",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      if (typeof window !== "undefined")
        return localStorage.getItem("lang") || "en";
    } catch {}
    return "en";
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("lang", newLang);
      // Delete existing cookie first to be safe
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Set google translation cookie
      if (newLang === "en") {
        document.cookie = "googtrans=/en/en; path=/;";
      } else {
        document.cookie = "googtrans=/en/hi; path=/;";
      }
      window.location.reload();
    } catch {}
  };

  const t = (key) => {
    return translations[lang] && translations[lang][key]
      ? translations[lang][key]
      : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};

export const useTranslation = () => {
  const { t } = useLanguage();
  return t;
};
