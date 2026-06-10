/**
 * LanguageContext — LANG-001
 * Full i18n translation system matching MEMORIAL protocol.
 * 8 languages: EN, ZH, KO, JA, HI, AR, ES, VI
 * Uses flat key-value dictionaries with dot-notation keys.
 *
 * Cross-domain persistence: Accepts ?lang=ZH (or any valid code) in the URL.
 * When detected, it overrides localStorage and persists for the session.
 * This allows navigation from infrastructure-academy.com/?lang=ZH to carry through.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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

const STORAGE_KEY = "iaai-lang";

/** Detect language from URL ?lang= parameter */
function getLangFromURL(): LangCode | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang")?.toUpperCase();
  if (urlLang && DICTIONARIES[urlLang as LangCode]) {
    return urlLang as LangCode;
  }
  return null;
}

/** Resolve initial language: URL param > localStorage > default EN */
function resolveInitialLang(): LangCode {
  // Priority 1: URL parameter (cross-domain navigation)
  const urlLang = getLangFromURL();
  if (urlLang) {
    // Persist it immediately so it sticks
    localStorage.setItem(STORAGE_KEY, urlLang);
    // Clean the URL param without reload
    const url = new URL(window.location.href);
    url.searchParams.delete("lang");
    window.history.replaceState({}, "", url.toString());
    return urlLang;
  }
  // Priority 2: localStorage (returning visitor)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DICTIONARIES[stored as LangCode]) return stored as LangCode;
  }
  // Priority 3: default EN
  return "EN";
}

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
  const [lang, setLangState] = useState<LangCode>(resolveInitialLang);

  // Set document attributes on mount and lang change
  useEffect(() => {
    document.documentElement.lang = lang.toLowerCase();
    document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang.toLowerCase();
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
