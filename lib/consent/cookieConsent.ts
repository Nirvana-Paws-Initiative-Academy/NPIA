export type ConsentCategory =
  | "essential"
  | "functional"
  | "analytics"
  | "communications";

export interface CookieConsentPreferences {
  version: 1;
  updatedAt: string;
  decision: "accepted_all" | "rejected_non_essential" | "customized";
  essential: true;
  functional: boolean;
  analytics: boolean;
  communications: boolean;
}

export const CONSENT_STORAGE_KEY = "npia_cookie_consent_v1";
export const CONSENT_COOKIE_NAME = "npia_consent";
export const CONSENT_UPDATED_EVENT = "npia:consent-updated";
export const OPEN_COOKIE_SETTINGS_EVENT = "npia:open-cookie-settings";

export const DEFAULT_REJECTED_CONSENT: CookieConsentPreferences = {
  version: 1,
  updatedAt: "",
  decision: "rejected_non_essential",
  essential: true,
  functional: false,
  analytics: false,
  communications: false,
};

export const DEFAULT_ACCEPTED_CONSENT: CookieConsentPreferences = {
  version: 1,
  updatedAt: "",
  decision: "accepted_all",
  essential: true,
  functional: true,
  analytics: true,
  communications: true,
};

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (
      parsed.version === 1 &&
      parsed.essential === true &&
      typeof parsed.functional === "boolean" &&
      typeof parsed.analytics === "boolean" &&
      typeof parsed.communications === "boolean"
    ) {
      return {
        version: 1,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        decision: parsed.decision ?? "customized",
        essential: true,
        functional: parsed.functional,
        analytics: parsed.analytics,
        communications: parsed.communications,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function writeCookieConsent(
  prefs: Omit<CookieConsentPreferences, "version" | "updatedAt" | "essential">
): CookieConsentPreferences {
  const payload: CookieConsentPreferences = {
    version: 1,
    updatedAt: new Date().toISOString(),
    essential: true,
    decision: prefs.decision,
    functional: Boolean(prefs.functional),
    analytics: Boolean(prefs.analytics),
    communications: Boolean(prefs.communications),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota / private mode failures gracefully
    }

    const cookieValue = encodeURIComponent(
      JSON.stringify({
        v: 1,
        f: payload.functional ? 1 : 0,
        a: payload.analytics ? 1 : 0,
        c: payload.communications ? 1 : 0,
      })
    );
    const maxAgeSeconds = 180 * 24 * 60 * 60;
    document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;

    window.dispatchEvent(
      new CustomEvent(CONSENT_UPDATED_EVENT, { detail: payload })
    );

    const activeLang = document.documentElement.lang || "en";
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: payload.decision,
        functional: payload.functional,
        analytics: payload.analytics,
        communications: payload.communications,
        language: activeLang,
      }),
    }).catch(() => {});
  }

  return payload;
}

export function hasCategoryConsent(category: ConsentCategory): boolean {
  if (category === "essential") return true;
  const saved = readCookieConsent();
  if (!saved) return false;
  return Boolean(saved[category]);
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}
