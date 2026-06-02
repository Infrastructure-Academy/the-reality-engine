/**
 * LanguageToggle — LANG-001
 * 8-language selector matching MEMORIAL's implementation.
 * Globe icon + current language code, dropdown with all 8 options.
 * Uses LanguageContext for state — switching language translates entire page.
 *
 * CRITICAL FIX: Uses native <select> element for guaranteed mobile compatibility.
 * Previous custom dropdown had a race condition where mousedown outside-click
 * handler closed the dropdown before onClick could fire on items.
 * Native <select> avoids this entirely and works perfectly on iOS Safari.
 */

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

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full
          border border-white/20 hover:border-white/40
          text-white/80 hover:text-white
          transition-all duration-200 cursor-pointer select-none
          ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}
        `}
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <GlobeIcon className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span className="font-mono font-bold tracking-wide">{lang}</span>
        <svg
          viewBox="0 0 10 6"
          fill="currentColor"
          className="w-2.5 h-2.5"
        >
          <path d="M0 0l5 6 5-6z" />
        </svg>
      </div>
      {/* Native select overlaid for guaranteed mobile touch handling */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as LangCode)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ fontSize: "16px" /* prevents iOS zoom */ }}
        aria-label="Select language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label} ({l.native})
          </option>
        ))}
      </select>
    </div>
  );
}
