import React from "react";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getContactSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "Contact & Partner Desk | NPIA",
  description:
    "Connect with Nirvana Paws Initiative & Academy (NPIA) for shelter partnerships, veterinary clinic tie-ups, volunteering, street puppy adoption, fostering, or sanctuary support.",
  path: "/contact-us",
  image: "/about/pillar-network.jpg",
  imageAlt: "NPIA contact desk for allied shelters, veterinarians, and volunteers",
  keywords: [
    "contact NPIA",
    "volunteer street dog rescue India",
    "adopt street puppy India",
  ],
});

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getContactSchemaGraph()} />
      {children}
    </>
  );
}
