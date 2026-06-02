/**
 * LanguageContext — LANG-001
 * Full i18n translation system matching MEMORIAL protocol.
 * 8 languages: EN, ZH, KO, JA, HI, AR, ES, VI
 * Uses flat key-value dictionaries with dot-notation keys.
 * t() function returns translated string or falls back to EN then key.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { EN } from "@/i18n/en";
import { ZH } from "@/i18n/zh";
import { KO } from "@/i18n/ko";
import { JA } from "@/i18n/ja";
import { HI } from "@/i18n/hi";
import { AR } from "@/i18n/ar";
import { ES } from "@/i18n/es";
import { VI } from "@/i18n/vi";

export type LangCode = "EN" | "ZH" | "KO" | "JA" | "HI" | "AR" | "ES" | "VI";

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "EN", label: "EN", native: "EN" },
  { code: "ZH", label: "中文", native: "ZH" },
  { code: "KO", label: "한국어", native: "KO" },
  { code: "JA", label: "日本語", native: "JA" },
  { code: "HI", label: "हिन्दी", native: "HI" },
  { code: "AR", label: "العربية", native: "AR" },
  { code: "ES", label: "Español", native: "ES" },
  { code: "VI", label: "Tiếng Việt", native: "VI" },
];

const DICTIONARIES: Record<LangCode, Record<string, string>> = {
  EN,
  ZH,
  KO,
  JA,
  HI,
  AR,
  ES,
  VI,
};

interface LanguageContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  setLang: () => {},
  t: (key) => key,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("iaai-lang");
      if (stored && DICTIONARIES[stored as LangCode]) return stored as LangCode;
    }
    return "EN";
  });

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem("iaai-lang", newLang);
    document.documentElement.lang = newLang.toLowerCase();
    // RTL for Arabic
    document.documentElement.dir = newLang === "AR" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string): string => {
      return DICTIONARIES[lang]?.[key] ?? DICTIONARIES.EN?.[key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Get full context (lang, setLang, t) */
export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand: just the t() function */
export function useT() {
  const { t } = useContext(LanguageContext);
  return t;
}
