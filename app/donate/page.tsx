import DonateExperience from "@/components/Donate/DonateExperience";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getDonateSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title: "Donate | NPIA — Support Street Animal Rescue & Sanctuary",
  description:
    "Support Nirvana Paws Initiative & Academy (N.P.I.A) with transparent INR contributions toward shared shelter recovery beds, 24/7 veterinary triage, ABC drives, and our flagship sanctuary build.",
  path: "/donate",
  image: "/about/mission-rescue.jpg",
  imageAlt: "Veterinarian examining a rescued dog supported by NPIA donations",
  keywords: [
    "donate to street dogs India",
    "sponsor shelter recovery bed",
    "fund animal sanctuary India",
  ],
});

export default function DonatePage() {
  return (
    <>
      <JsonLd data={getDonateSchemaGraph()} />
      <DonateExperience />
    </>
  );
}
