"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import {
  CONSENT_UPDATED_EVENT,
  DEFAULT_ACCEPTED_CONSENT,
  DEFAULT_REJECTED_CONSENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/consent/cookieConsent";
import "./CookieConsentBanner.css";

export const CookieConsentBanner: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [communications, setCommunications] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = readCookieConsent();
    if (saved) {
      setHasDecision(true);
      setFunctional(saved.functional);
      setAnalytics(saved.analytics);
      setCommunications(saved.communications);
    } else {
      setHasDecision(false);
    }

    const handleOpenSettings = () => {
      const current = readCookieConsent();
      if (current) {
        setFunctional(current.functional);
        setAnalytics(current.analytics);
        setCommunications(current.communications);
      }
      setCustomizeOpen(true);
    };

    const handleUpdated = () => {
      const latest = readCookieConsent();
      if (latest) {
        setHasDecision(true);
        setFunctional(latest.functional);
        setAnalytics(latest.analytics);
        setCommunications(latest.communications);
      }
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    window.addEventListener(CONSENT_UPDATED_EVENT, handleUpdated);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
      window.removeEventListener(CONSENT_UPDATED_EVENT, handleUpdated);
    };
  }, []);

  useEffect(() => {
    if (!customizeOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCustomizeOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [customizeOpen]);

  const handleAcceptAll = () => {
    writeCookieConsent(DEFAULT_ACCEPTED_CONSENT);
    setFunctional(true);
    setAnalytics(true);
    setCommunications(true);
    setHasDecision(true);
    setCustomizeOpen(false);
  };

  const handleRejectNonEssential = () => {
    writeCookieConsent(DEFAULT_REJECTED_CONSENT);
    setFunctional(false);
    setAnalytics(false);
    setCommunications(false);
    setHasDecision(true);
    setCustomizeOpen(false);
  };

  const handleSaveCustom = () => {
    writeCookieConsent({
      decision: "customized",
      functional,
      analytics,
      communications,
    });
    setHasDecision(true);
    setCustomizeOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {!hasDecision && !customizeOpen && (
        <aside
          className="npia-consent-banner"
          aria-label="Cookie and DPDP Consent Notice"
        >
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5 text-[13.5px] leading-relaxed text-[#E2FFE4]/90">
              <p className="text-[14.5px] font-semibold text-[#FAFFFD]">
                Cookie &amp; DPDP Act 2023 Consent
              </p>
              <p>
                NPIA uses essential storage to keep navigation and consent
                records reliable. You may accept, reject non-essential cookies,
                or customize preferences under our{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-2 text-[#B2DCB3] hover:text-[#FAFFFD]"
                >
                  Privacy Policy
                </Link>
                ,{" "}
                <Link
                  href="/dpdp-policy"
                  className="underline underline-offset-2 text-[#B2DCB3] hover:text-[#FAFFFD]"
                >
                  DPDP Notice
                </Link>
                , and{" "}
                <Link
                  href="/terms-and-conditions"
                  className="underline underline-offset-2 text-[#B2DCB3] hover:text-[#FAFFFD]"
                >
                  Terms
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCustomizeOpen(true)}
                className="rounded-lg border border-[#E2FFE4]/30 px-3 py-2 text-xs font-medium text-[#E2FFE4] hover:bg-white/10 transition-colors cursor-pointer"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="rounded-lg border border-[#E2FFE4]/35 bg-white/5 px-3 py-2 text-xs font-medium text-[#FAFFFD] hover:bg-white/15 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-lg bg-[#E2FFE4] px-3.5 py-2 text-xs font-semibold text-[#102412] hover:bg-[#FAFFFD] transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {hasDecision && !customizeOpen && (
        <button
          type="button"
          onClick={() => setCustomizeOpen(true)}
          aria-label="Manage Cookie and DPDP Preferences"
          title="Cookie Preferences"
          className="fixed bottom-4 right-[76px] z-[95] w-12 h-12 rounded-full border-2 border-[#4AA552] bg-[#102412] text-[#E2FFE4] shadow-[0_10px_28px_rgba(11,28,14,0.38)] flex items-center justify-center hover:scale-105 hover:bg-[#245736] transition-all cursor-pointer"
        >
          <Cookie className="w-5 h-5 text-[#E2FFE4]" aria-hidden="true" />
        </button>
      )}

      {customizeOpen && (
        <div
          className="npia-consent-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="npia-cookie-modal-title"
        >
          <div className="npia-consent-modal">
            <div className="flex items-start justify-between gap-4 border-b border-[#102412]/15 pb-3.5">
              <div>
                <h2
                  id="npia-cookie-modal-title"
                  className="text-xl font-semibold tracking-tight text-[#102412]"
                >
                  Customize Cookie &amp; Data Preferences
                </h2>
                <p className="mt-1 text-xs text-[#4B714C]">
                  Aligned with India&rsquo;s Digital Personal Data Protection Act,
                  2023 (DPDP Act). Withdraw or adjust consent at any time.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close cookie settings"
                onClick={() => setCustomizeOpen(false)}
                className="rounded-lg px-2 py-1 text-lg leading-none text-[#102412]/70 hover:bg-[#E2FFE4] hover:text-[#102412] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-[#102412]/15 bg-[#EAF5EB]/70 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#102412]">
                      Strictly Essential
                    </p>
                    <p className="mt-0.5 text-xs text-[#102412]/75">
                      Required for core page routing, security integrity, and
                      saving your consent choice. Always active.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#102412] px-2.5 py-1 text-[11px] font-medium text-[#FAFFFD] shrink-0">
                    Always Active
                  </span>
                </div>
              </div>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-[#102412]/15 bg-white p-3.5 cursor-pointer hover:border-[#4B714C]">
                <div>
                  <span className="block text-sm font-semibold text-[#102412]">
                    Functional &amp; Language Memory
                  </span>
                  <span className="mt-0.5 block text-xs text-[#102412]/75">
                    Remembers your chosen Indian language script across visits
                    and keeps form preferences convenient.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#245736] shrink-0 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-[#102412]/15 bg-white p-3.5 cursor-pointer hover:border-[#4B714C]">
                <div>
                  <span className="block text-sm font-semibold text-[#102412]">
                    Privacy-Safe Impact Analytics
                  </span>
                  <span className="mt-0.5 block text-xs text-[#102412]/75">
                    Helps NPIA measure aggregate awareness of rescue, clinic,
                    and adoption programs without profiling individuals.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#245736] shrink-0 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-[#102412]/15 bg-white p-3.5 cursor-pointer hover:border-[#4B714C]">
                <div>
                  <span className="block text-sm font-semibold text-[#102412]">
                    Outreach &amp; Referral Context
                  </span>
                  <span className="mt-0.5 block text-xs text-[#102412]/75">
                    Preserves partner or campaign context when you choose to
                    open our Contact Us inquiry form.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={communications}
                  onChange={(e) => setCommunications(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#245736] shrink-0 cursor-pointer"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#102412]/15 pt-4">
              <div className="flex items-center gap-3 text-xs text-[#4B714C]">
                <Link
                  href="/privacy-policy"
                  onClick={() => setCustomizeOpen(false)}
                  className="underline hover:text-[#102412]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/dpdp-policy"
                  onClick={() => setCustomizeOpen(false)}
                  className="underline hover:text-[#102412]"
                >
                  DPDP Act 2023
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="rounded-lg border border-[#102412]/25 px-3 py-2 text-xs font-medium text-[#102412] hover:bg-[#EAF5EB] cursor-pointer"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="rounded-lg border border-[#102412] bg-[#EAF5EB] px-3.5 py-2 text-xs font-semibold text-[#102412] hover:bg-[#E2FFE4] cursor-pointer"
                >
                  Save Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="rounded-lg bg-[#102412] px-3.5 py-2 text-xs font-semibold text-[#FAFFFD] hover:bg-[#245736] cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
