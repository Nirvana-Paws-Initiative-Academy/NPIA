import ShelterHero from "@/components/Hero/ShelterHero";
import StreetSanctuaryScroll from "@/components/Home/StreetSanctuaryScroll";
import PartnerHubSection from "@/components/Home/PartnerHubSection";
import AcademyWingsSection from "@/components/Home/AcademyWingsSection";
import SanctuaryFinaleFooter from "@/components/Home/SanctuaryFinaleFooter";
import { JsonLd } from "@/components/SEO/JsonLd";
import { buildPageMetadata, getHomeSchemaGraph } from "@/lib/seo/schema";

export const metadata = buildPageMetadata({
  title:
    "NPIA — Connected Rescue Network & Sanctuary | Nirvana Paws Initiative & Academy",
  description:
    "Support Nirvana Paws Initiative & Academy (NPIA)—uniting allied shelters, veterinary clinics, and volunteers in India to save street animals today while building our flagship sanctuary and Canine Academy.",
  path: "/",
  image: "/hero/street-clear.jpg",
  imageAlt: "Rescued Indian street dogs resting under safe shelter cover",
});

export default function Home() {
  return (
    <>
      <JsonLd data={getHomeSchemaGraph()} />
      <ShelterHero />
      <StreetSanctuaryScroll />
      <PartnerHubSection />
      <AcademyWingsSection />
      <SanctuaryFinaleFooter />
    </>
  );
}
