import type { Metadata } from "next";
import { AboutBaselineExperience } from "@/components/About/AboutBaselineExperience";
import { SocietyCharterSection } from "@/components/About/SocietyCharterSection";

export const metadata: Metadata = {
  title: "About NPIA | Our Story, Vision & Founding Charter",
  description:
    "Discover Nirvana Paws Initiative & Academy (NPIA)—how we connect shelters and vets today, our 4-stage roadmap toward our flagship sanctuary, and our Founding Charter.",
};

export default function AboutPage() {
  return (
    <>
      <AboutBaselineExperience />
      <SocietyCharterSection />
    </>
  );
}
