"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { CORE_TRANSLATIONS } from "@/lib/i18n/coreDictionary";
import {
  ALLOWED_LANGUAGE_CODES,
  LANGUAGE_STORAGE_KEY,
  getLanguageMeta,
} from "@/lib/i18n/languages";
import { hasCategoryConsent } from "@/lib/consent/cookieConsent";

interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  isTranslating: false,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

const CACHE_PREFIX = "npia_i18n_cache_v1_";
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "SVG",
  "TEXTAREA",
  "OPTION",
]);

function shouldTranslateText(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.length < 2) return false;
  if (/^[\d\s₹$£€%.,:/+\-–—|·•↗→←()[\]{}©&@#]+$/.test(trimmed)) return false;
  if (/^NPIA\.?$/i.test(trimmed)) return false;
  if (/^No\.\s*\d+$/i.test(trimmed)) return false;
  if (!/[A-Za-z]/.test(trimmed)) return false;
  return true;
}

function readLocalCache(lang: string): Record<string, string> {
  if (typeof window === "undefined" || lang === "en") return {};
  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}${lang}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeLocalCache(lang: string, map: Record<string, string>) {
  if (typeof window === "undefined" || lang === "en") return;
  try {
    const entries = Object.entries(map);
    const trimmed =
      entries.length > 1200 ? Object.fromEntries(entries.slice(-1200)) : map;
    window.localStorage.setItem(
      `${CACHE_PREFIX}${lang}`,
      JSON.stringify(trimmed)
    );
  } catch {
    // Ignore storage quota errors
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<string>("en");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Maps holding canonical English source values so re-translations never drift
  const originalTextMap = useRef(new WeakMap<Text, string>());
  const appliedLangMap = useRef(new WeakMap<Text, string>());
  const originalPlaceholderMap = useRef(new WeakMap<HTMLElement, string>());
  const dictCache = useRef<Record<string, Record<string, string>>>({});
  const inFlightKeys = useRef<Set<string>>(new Set());
  const debounceRef = useRef<number | null>(null);
  const activeLanguageRef = useRef<string>("en");

  useEffect(() => {
    try {
      const sessionLang = window.sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
      const localLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const saved = sessionLang || localLang;
      if (saved && ALLOWED_LANGUAGE_CODES.has(saved) && saved !== "en") {
        activeLanguageRef.current = saved;
        setLanguageState(saved);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    const next = ALLOWED_LANGUAGE_CODES.has(code) ? code : "en";
    activeLanguageRef.current = next;
    setLanguageState(next);

    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        if (hasCategoryConsent("functional")) {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        }
      } catch {
        // Ignore storage access errors
      }
    }
  }, []);

  const getDict = useCallback((lang: string): Record<string, string> => {
    if (!dictCache.current[lang]) {
      dictCache.current[lang] = {
        ...readLocalCache(lang),
        ...(CORE_TRANSLATIONS[lang] ?? {}),
      };
    }
    return dictCache.current[lang];
  }, []);

  const applyTranslationsToDom = useCallback(
    (lang: string, allowFetch: boolean) => {
      if (typeof document === "undefined" || !document.body) return;

      const meta = getLanguageMeta(lang);
      document.documentElement.lang = meta.code;

      if (lang === "en") {
        // Restore every modified node cleanly back to original English
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT
        );
        let node = walker.nextNode() as Text | null;
        while (node) {
          const orig = originalTextMap.current.get(node);
          if (orig !== undefined && node.nodeValue !== orig) {
            node.nodeValue = orig;
          }
          appliedLangMap.current.delete(node);
          node = walker.nextNode() as Text | null;
        }

        document
          .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            "input[placeholder], textarea[placeholder]"
          )
          .forEach((el) => {
            const origPh = originalPlaceholderMap.current.get(el);
            if (origPh !== undefined) el.placeholder = origPh;
          });
        setIsTranslating(false);
        return;
      }

      const dict = getDict(lang);
      const missingStrings = new Set<string>();
      const textTargets: Array<{ node: Text; orig: string; trimmed: string }> =
        [];

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (parent.closest("[data-no-translate='true']")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let current = walker.nextNode() as Text | null;
      while (current) {
        let orig = originalTextMap.current.get(current);
        const currentVal = current.nodeValue ?? "";

        if (orig === undefined) {
          if (!shouldTranslateText(currentVal)) {
            current = walker.nextNode() as Text | null;
            continue;
          }
          orig = currentVal;
          originalTextMap.current.set(current, orig);
        } else {
          // If React updated this text node to new English copy since our last write, refresh canonical source
          const prevApplied = appliedLangMap.current.get(current);
          if (prevApplied && currentVal !== orig && shouldTranslateText(currentVal)) {
            const expectedTranslated = dict[orig.trim()];
            const isOurOwnWrite =
              expectedTranslated && currentVal.trim() === expectedTranslated;
            if (!isOurOwnWrite) {
              orig = currentVal;
              originalTextMap.current.set(current, orig);
            }
          }
        }

        const trimmed = orig.trim();
        textTargets.push({ node: current, orig, trimmed });

        const cached = dict[trimmed];
        if (cached) {
          const leading = orig.match(/^\s*/)?.[0] ?? "";
          const trailing = orig.match(/\s*$/)?.[0] ?? "";
          const nextValue = `${leading}${cached}${trailing}`;
          if (current.nodeValue !== nextValue) {
            current.nodeValue = nextValue;
          }
          appliedLangMap.current.set(current, lang);
        } else if (!inFlightKeys.current.has(`${lang}:${trimmed}`)) {
          missingStrings.add(trimmed);
        }

        current = walker.nextNode() as Text | null;
      }

      // Translate placeholders too
      document
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          "input[placeholder], textarea[placeholder]"
        )
        .forEach((el) => {
          if (el.closest("[data-no-translate='true']")) return;
          let origPh = originalPlaceholderMap.current.get(el);
          if (origPh === undefined) {
            origPh = el.placeholder;
            originalPlaceholderMap.current.set(el, origPh);
          }
          const trimmed = origPh.trim();
          if (!shouldTranslateText(trimmed)) return;
          if (dict[trimmed]) {
            el.placeholder = dict[trimmed];
          } else if (!inFlightKeys.current.has(`${lang}:${trimmed}`)) {
            missingStrings.add(trimmed);
          }
        });

      const batchList = Array.from(missingStrings);
      if (!allowFetch || batchList.length === 0) return;

      const CHUNK_SIZE = 45;
      const chunks: string[][] = [];
      for (let i = 0; i < batchList.length; i += CHUNK_SIZE) {
        chunks.push(batchList.slice(i, i + CHUNK_SIZE));
      }

      batchList.forEach((s) => inFlightKeys.current.add(`${lang}:${s}`));
      setIsTranslating(true);

      Promise.all(
        chunks.map(async (texts) => {
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ targetLang: lang, texts }),
            });
            if (!res.ok) return;
            const data = (await res.json()) as {
              translations?: Record<string, string>;
            };
            if (data.translations) {
              Object.assign(getDict(lang), data.translations);
            }
          } catch {
            // Silently keep source text if offline
          } finally {
            texts.forEach((s) => inFlightKeys.current.delete(`${lang}:${s}`));
          }
        })
      ).then(() => {
        writeLocalCache(lang, getDict(lang));
        if (activeLanguageRef.current === lang) {
          applyTranslationsToDom(lang, false);
          setIsTranslating(false);
        }
      });
    },
    [getDict]
  );

  // Re-run translation on language change and route change
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      applyTranslationsToDom(language, language !== "en");
    }, 60);

    const t2 = window.setTimeout(() => {
      if (language !== "en") {
        applyTranslationsToDom(language, true);
      }
    }, 360);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [language, pathname, applyTranslationsToDom]);

  // Watch DOM updates (e.g., drawers, tabs, step transitions) when non-English is active
  useEffect(() => {
    if (language === "en" || typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver(() => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        applyTranslationsToDom(activeLanguageRef.current, true);
      }, 180);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [language, applyTranslationsToDom]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};
