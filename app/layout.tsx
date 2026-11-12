import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteShell } from "@/components/Layout/SiteShell";
import { JsonLd } from "@/components/SEO/JsonLd";
import {
  DEFAULT_OG_IMAGE,
  GLOBAL_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  getGlobalGraphJsonLd,
} from "@/lib/seo/schema";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#0b1c0e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "NPIA — Connected Rescue Network & Sanctuary | Nirvana Paws Initiative & Academy",
    template: "%s",
  },
  description:
    "Support Nirvana Paws Initiative & Academy (NPIA)—uniting shelters, vets, and rescuers to save street animals today while building our first flagship sanctuary and training academy.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Animal Welfare & Rescue NGO",
  keywords: GLOBAL_KEYWORDS,
  icons: {
    icon: [
      { url: "/icon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/npia-md.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "NPIA — Connected Rescue Network & Sanctuary | Nirvana Paws Initiative & Academy",
    description:
      "Uniting animal shelters, veterinary clinics, and volunteers in India to save street animals today while building NPIA's flagship sanctuary and Canine Academy.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 675,
        alt: "Rescued puppies resting safely inside an NPIA partner shelter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "NPIA — Connected Rescue Network & Sanctuary | Nirvana Paws Initiative & Academy",
    description:
      "Uniting shelters, vets, and volunteers in India to rescue street dogs today and build a permanent sanctuary & Canine Academy.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/icon.ico" type="image/x-icon" />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="NPIA LLM & AI Engine Context"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Lexend:wght@300;500;600&family=Newsreader:opsz,wght@6..72,300..500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..500;1,8..60,400..500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME"
          rel="stylesheet"
        />
        <JsonLd data={getGlobalGraphJsonLd()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
