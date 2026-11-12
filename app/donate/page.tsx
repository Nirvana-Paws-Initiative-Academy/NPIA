import type { Metadata } from "next";
import DonateExperience from "@/components/Donate/DonateExperience";

export const metadata: Metadata = {
  title: "Donate | NPIA — Support Street Animal Rescue & Sanctuary",
  description:
    "Support Nirvana Paws Initiative & Academy (N.P.I.A) with transparent contributions toward shared shelter recovery beds, 24/7 veterinary triage, and our flagship sanctuary build.",
};

export default function DonatePage() {
  return <DonateExperience />;
}
