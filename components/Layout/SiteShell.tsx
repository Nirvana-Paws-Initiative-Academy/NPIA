"use client";

import React from "react";
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
