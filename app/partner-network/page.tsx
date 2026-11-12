import type { Metadata } from "next";
import PartnerRingExperience from "@/components/PartnerNetwork/PartnerRingExperience";

export const metadata: Metadata = {
  title: "Partner Network | NPIA — Connected Shelters, Clinics & Rescuers",
  description:
    "Explore the NPIA Partner Network: uniting rescue shelters, veterinary clinics, foster caregivers, and community responders across a shared street-to-sanctuary grid.",
};

export default function PartnerNetworkPage() {
  return <PartnerRingExperience />;
}
