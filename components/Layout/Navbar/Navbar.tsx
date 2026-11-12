"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

interface NavItem {
  label: string;
  href: string;
}

const CENTER_LINKS: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Partner Network", href: "/partner-network" },
  { label: "Donate", href: "/donate" },
];

const MOBILE_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "The Sanctuary Roadmap", href: "/roadmap" },
  { label: "Partner Network", href: "/partner-network" },
  { label: "Donate", href: "/donate" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="site-nav-bar">
        <Link href="/" className="site-nav-logo" aria-label="NPIA Home">
          NPIA<span className="site-nav-logo-dot" aria-hidden="true">.</span>
        </Link>

        <nav aria-label="Primary Navigation">
          <ul className="site-nav-links">
            {CENTER_LINKS.map((item) => {
              const isActive =
                item.href === pathname ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="site-nav-side">
          <Link
            href="/contact-us"
            className="site-nav-cta-outline"
            aria-current={pathname === "/contact-us" ? "page" : undefined}
          >
            Contact Us
          </Link>
          <button
            type="button"
            className="site-nav-menu-btn"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="subpage-mobile-drawer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="subpage-mobile-drawer"
            className="site-nav-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <Link
              href="/"
              className="site-nav-drawer-brand"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="NPIA Home"
            >
              NPIA<span className="site-nav-logo-dot" aria-hidden="true">.</span>
            </Link>
            <button
              type="button"
              className="site-nav-close-btn"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
            <div className="site-nav-drawer-links">
              {MOBILE_LINKS.map((item) => {
                const isActive = item.href === pathname;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/contact-us"
                className="site-nav-drawer-cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
