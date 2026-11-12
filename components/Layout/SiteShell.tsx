"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Layout/Navbar/Navbar";
import SanctuaryFinaleFooter from "@/components/Home/SanctuaryFinaleFooter";
import { CookieConsentBanner } from "@/components/Layout/CookieConsentBanner";
import { LanguageProvider } from "@/components/I18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/I18n/LanguageSwitcher";

export const SiteShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isHeroRoute = pathname === "/";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
    if (targets.length === 0) return;

    const revealAll = () => {
      targets.forEach((el) => el.classList.add("aos-animate"));
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -28px 0px" }
    );

    const vh = window.innerHeight || 800;
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.94 && rect.bottom > 0) {
        el.classList.add("aos-animate");
      } else {
        observer.observe(el);
      }
    });

    const safetyTimer = window.setTimeout(revealAll, 4500);

    return () => {
      observer.disconnect();
      window.clearTimeout(safetyTimer);
    };
  }, [pathname]);

  return (
    <LanguageProvider>
      {isHeroRoute ? (
        children
      ) : (
        <>
          <header className="site-nav-header">
            <Navbar />
          </header>

          <main aria-label="Page Content" className="w-full overflow-x-clip">
            {children}
          </main>

          <SanctuaryFinaleFooter />
        </>
      )}

      <CookieConsentBanner />
      <LanguageSwitcher />
    </LanguageProvider>
  );
};
