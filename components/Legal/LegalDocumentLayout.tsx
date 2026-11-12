"use client";

import React from "react";
import Link from "next/link";
import { openCookiePreferences } from "@/lib/consent/cookieConsent";

interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalDocumentLayoutProps {
  badge: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: LegalSection[];
  showCookieControls?: boolean;
}

export const LegalDocumentLayout: React.FC<LegalDocumentLayoutProps> = ({
  badge,
  title,
  subtitle,
  effectiveDate,
  sections,
  showCookieControls = true,
}) => {
  return (
    <div className="w-full bg-[#FAFFFD] text-[#102412] font-['Instrument_Sans',sans-serif]">
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-20">
        <div className="rounded-3xl border border-[#102412]/15 bg-[#EAF5EB]/70 p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-block rounded-full border border-[#4B714C]/35 bg-[#FAFFFD] px-3.5 py-1 text-xs font-medium tracking-wider uppercase text-[#245736]">
              {badge}
            </span>
            <span className="text-xs text-[#4B714C]">
              Last updated: {effectiveDate}
            </span>
          </div>

          <h1 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-[#102412]">
            {title}
          </h1>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#102412]/80 max-w-2xl">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5 text-xs">
            <Link
              href="/terms-and-conditions"
              className="rounded-full border border-[#102412]/20 bg-[#FAFFFD] px-3.5 py-1.5 font-medium text-[#102412] hover:bg-[#E2FFE4] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="rounded-full border border-[#102412]/20 bg-[#FAFFFD] px-3.5 py-1.5 font-medium text-[#102412] hover:bg-[#E2FFE4] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/dpdp-policy"
              className="rounded-full border border-[#102412]/20 bg-[#FAFFFD] px-3.5 py-1.5 font-medium text-[#102412] hover:bg-[#E2FFE4] transition-colors"
            >
              DPDP Act 2023 Notice
            </Link>
            {showCookieControls && (
              <button
                type="button"
                onClick={openCookiePreferences}
                className="rounded-full bg-[#102412] px-3.5 py-1.5 font-medium text-[#FAFFFD] hover:bg-[#245736] transition-colors cursor-pointer"
              >
                Manage Cookie Preferences
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-[#102412]/10 bg-white p-6 sm:p-8 shadow-xs"
            >
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#102412]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#102412]/80">
                {section.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 pl-5 list-disc text-[15px] leading-relaxed text-[#102412]/80 marker:text-[#4AA552]">
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#102412]/15 bg-[#EAF5EB]/60 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#102412]">
              Questions, Consent Withdrawal, or Data Requests?
            </h2>
            <p className="mt-1 text-sm text-[#102412]/75">
              Reach NPIA&rsquo;s governance &amp; data protection desk at{" "}
              <a
                href="mailto:hello@npia.org.in"
                className="font-medium underline underline-offset-2 text-[#102412] hover:text-[#245736]"
              >
                hello@npia.org.in
              </a>{" "}
              or through our contact portal.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-xl bg-[#102412] px-5 py-2.5 text-sm font-medium text-[#FAFFFD] hover:bg-[#245736] transition-colors shrink-0"
          >
            Contact Governance Desk
          </Link>
        </div>
      </section>
    </div>
  );
};
