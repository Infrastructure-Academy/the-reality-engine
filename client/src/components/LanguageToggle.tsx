/**
 * LanguageToggle — LANG-001
 * 8-language selector matching MEMORIAL's implementation.
 * Globe icon + current language code, dropdown with all 8 options.
 * Uses LanguageContext for state — switching language translates entire page.
 */

import { useState, useRef, useEffect } from "react";
import { useLanguage, LANGUAGES, type LangCode } from "@/contexts/LanguageContext";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

interface LanguageToggleProps {
  /** Compact mode for tight spaces */
  compact?: boolean;
}

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      // Use click (not mousedown) so button clicks inside register first
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  function selectLang(code: LangCode) {
    setLang(code);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Select language"
        className={`
          inline-flex items-center gap-1.5 rounded-full
          border border-white/20 hover:border-white/40
          text-white/80 hover:text-white
          transition-all duration-200 cursor-pointer
          ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}
        `}
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <GlobeIcon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span className="font-mono font-bold tracking-wide">{lang}</span>
        <svg
          viewBox="0 0 10 6"
          fill="currentColor"
          className={`w-2.5 h-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M0 0l5 6 5-6z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 z-[10000] rounded-md overflow-hidden shadow-xl"
          style={{
            backgroundColor: "#0f1d32",
            border: "1px solid rgba(255,255,255,0.15)",
            minWidth: "140px",
          }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={(e) => { e.stopPropagation(); selectLang(l.code); }}
              className={`
                w-full flex items-center justify-between px-3 py-2 text-xs
                transition-colors cursor-pointer
                ${lang === l.code
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <span>{l.label}</span>
              <span className="font-mono text-[10px] opacity-60">{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
