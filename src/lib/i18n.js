"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    products: "Products",
    privacy_policy: "Privacy Policy",
    language_english: "English",
    language_hindi: "हिन्दी",
  },
  hi: {
    products: "उत्पाद",
    privacy_policy: "गोपनीयता नीति",
    language_english: "English",
    language_hindi: "हिन्दी",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      if (typeof window !== "undefined")
        return localStorage.getItem("lang") || "en";
    } catch (e) {}
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {}
  }, [lang]);

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
