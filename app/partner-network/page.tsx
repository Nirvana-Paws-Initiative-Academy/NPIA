import PartnerRingExperience from "@/components/PartnerNetwork/PartnerRingExperience";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getPartnerNetworkSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "Partner Network | NPIA — Connected Shelters, Clinics & Rescuers",
  description:
    "Explore the NPIA Partner Network: uniting rescue shelters, veterinary clinics, foster caregivers, and community responders across a shared street-to-sanctuary grid in India.",
  path: "/partner-network",
  image: "/about/pillar-network.jpg",
  imageAlt: "NPIA Partner Network uniting rescue shelters and veterinary clinics",
  keywords: [
    "animal shelter partnership India",
    "veterinary clinic rescue grid",
    "NPIA Partner Network",
  ],
});

export default function PartnerNetworkPage() {
  return (
    <>
      <JsonLd data={getPartnerNetworkSchemaGraph()} />
      <PartnerRingExperience />
    </>
  );
}
