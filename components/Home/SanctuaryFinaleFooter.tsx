"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { openCookiePreferences } from "@/lib/consent/cookieConsent";
import "./SanctuaryFinaleFooter.css";

const FOOTER_VIDEO_URL = "/Egrets_gliding_over_forest_lake_28175e1d.mp4";
const FOOTER_POSTER_URL = "/egret-footer-poster.png";

const COLUMNS = [
  {
    title: "Explore",
    ariaLabel: "Explore NPIA",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Partner Network", href: "/partner-network" },
      { label: "4-Stage Roadmap", href: "/roadmap" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Governance",
    ariaLabel: "Governance and Charter",
    links: [
      { label: "Our Charter", href: "/about#charter" },
      { label: "Governance & Ethics", href: "/about#governance" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "DPDP Act 2023", href: "/dpdp-policy" },
    ],
  },
] as const;

export default function SanctuaryFinaleFooter() {
  const pathname = usePathname();
  const isDarkTop = pathname === "/partner-network" || pathname === "/donate";

  return (
    <footer
      className="site-footer"
      aria-label="NPIA Site Footer"
      data-dark-top={isDarkTop ? "true" : undefined}
    >
      <div className="footer-media" aria-hidden="true">
        <video
          className="footer-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={FOOTER_POSTER_URL}
        >
          <source src={FOOTER_VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="brand" data-aos="fade-up">
            <Link href="/" className="brand-lockup" aria-label="NPIA Home">
              <span className="brand-wordmark" data-no-translate="true">
                NPIA<span className="brand-wordmark-dot">.</span>
              </span>
              <span className="brand-subtitle">
                Nirvana Paws Initiative &amp; Academy
              </span>
            </Link>

            <p className="brand-blurb">
              Building safe shelter, trauma rehabilitation, and compassionate
              training for India&rsquo;s street dogs.
            </p>

            <ul className="contact-list">
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5 8-5V7H4Zm16 10V9.7l-7.47 4.67a1 1 0 0 1-1.06 0L4 9.7V17h16Z" />
                </svg>
                <a href="mailto:hello@npia.org.in">hello@npia.org.in</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                <span>India</span>
              </li>
            </ul>
          </div>

          {COLUMNS.map((col, idx) => (
            <nav
              key={col.title}
              className="col"
              aria-label={col.ariaLabel}
              data-aos="fade-up"
              data-aos-delay={idx === 0 ? "100" : "150"}
            >
              <h3 className="col-title">{col.title}</h3>
              <ul className="link-list">
                {col.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer-connect" data-aos="fade-up" data-aos-delay="200">
            <h3 className="col-title">Connect With NPIA</h3>
            <p>
              Reach our team for organizational partnerships, veterinary
              collaboration, volunteering, fostering, or adoption.
            </p>
            <Link href="/contact-us" className="footer-cta-btn">
              <span>Contact &amp; Partner</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="footer-bottom" data-aos="fade-up" data-aos-delay="200">
          <div className="footer-copy-group">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Nirvana Paws Initiative &amp;
              Academy
            </p>
            <p className="footer-credit">
              Designed and developed by{" "}
              <a
                href="https://krpeteyellp.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-no-translate="true"
              >
                KR Pet Eye LLP
              </a>
            </p>
          </div>

          <nav className="legal" aria-label="Legal and data protection">
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/dpdp-policy">DPDP Act 2023</Link>
            <button
              type="button"
              className="legal-btn"
              onClick={openCookiePreferences}
            >
              Cookie Settings
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
