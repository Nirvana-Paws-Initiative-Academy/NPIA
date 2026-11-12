import React from "react";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getProgramsSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "Our Programs — INSPIRE Rescue, Rehab & Canine Academy | NPIA",
  description:
    "Explore NPIA's INSPIRE program (Initiative Nurturing Stray Puppies Into Responsible Environments): rescue, veterinary care, obedience, therapy & guide training, and lifelong placement.",
  path: "/our-programs",
  image: "/Handler_training_dog_outdoors_a386a55b.jpg",
  imageAlt: "NPIA handler training an attentive rescued street dog outdoors",
  keywords: [
    "NPIA INSPIRE program",
    "Canine Academy India",
    "therapy and guide dog training India",
  ],
});

export default function OurProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getProgramsSchemaGraph()} />
      {children}
    </>
  );
}
