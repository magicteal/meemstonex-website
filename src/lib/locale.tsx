"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";

type Locale = "en" | "hi";

type ResourceTree = { [key: string]: string | ResourceTree };

const resources: Record<Locale, ResourceTree> = {
  en,
  hi,
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: () => "",
});

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (stored === "en" || stored === "hi") setLocale(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (path: string) => {
    const parts = path.split(".");
    let current: string | ResourceTree = resources[locale];
    for (const part of parts) {
      if (typeof current === "object" && current !== null && part in current) {
        current = (current as ResourceTree)[part];
      } else {
        return path;
      }
    }
    return typeof current === "string" ? current : path;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
