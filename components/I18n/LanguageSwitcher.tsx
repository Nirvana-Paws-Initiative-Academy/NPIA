"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguageMeta } from "@/lib/i18n/languages";
import { useLanguage } from "./LanguageProvider";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const current = getLanguageMeta(language);

  return (
    <div
      ref={rootRef}
      data-no-translate="true"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 sm:bottom-4 sm:right-4 z-[96] font-['Instrument_Sans',sans-serif]"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Choose website language"
          className="absolute bottom-11 right-0 w-56 max-w-[calc(100vw-2rem)] max-h-[60svh] overflow-y-auto rounded-2xl border border-[#E2FFE4]/30 bg-[#0B1C0E]/95 p-2 text-[#FAFFFD] shadow-2xl backdrop-blur-xl"
        >
          <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#B2DCB3]">
            Language · भाषा
          </p>
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#245736] text-[#FAFFFD] font-semibold"
                      : "text-[#E2FFE4] hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    {lang.code !== "en" && (
                      <span className="text-[10px] text-[#B2DCB3]/85">
                        {lang.englishName}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <Check className="w-3.5 h-3.5 text-[#E2FFE4] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={`Change language (current: ${current.englishName})`}
        aria-expanded={open}
        title={`Language: ${current.nativeName}`}
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-full border-[1.5px] border-[#4AA552] bg-[#102412]/95 text-[#FAFFFD] shadow-[0_8px_22px_rgba(11,28,14,0.34)] flex items-center justify-center hover:scale-105 hover:bg-[#245736] transition-all cursor-pointer"
      >
        <Languages className="w-4 h-4 text-[#E2FFE4]" aria-hidden="true" />
        <span className="absolute -top-1 -right-1 rounded-full border border-[#102412] bg-[#E2FFE4] px-1 py-[1px] text-[8px] font-bold uppercase leading-none text-[#102412] shadow-sm">
          {current.code}
        </span>
      </button>

      {isTranslating && (
        <span className="sr-only" role="status" aria-live="polite">
          Updating language
        </span>
      )}
    </div>
  );
};
