import { AboutBaselineExperience } from "@/components/About/AboutBaselineExperience";
import { SocietyCharterSection } from "@/components/About/SocietyCharterSection";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getAboutSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "About NPIA | Our Story, Vision & Founding Charter",
  description:
    "Discover Nirvana Paws Initiative & Academy (NPIA)—how we connect shelters and vets today, our 4-stage roadmap toward our flagship sanctuary, our founding team, and our Founding Charter.",
  path: "/about",
  image: "/about/pillar-network.jpg",
  imageAlt: "NPIA rescue team beside allied shelter recovery kennels",
  keywords: [
    "NPIA Founding Charter",
    "about Nirvana Paws Initiative Academy",
    "animal rescue leadership India",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={getAboutSchemaGraph()} />
      <AboutBaselineExperience />
      <SocietyCharterSection />
    </>
  );
}
