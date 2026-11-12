import ShelterHero from "@/components/Hero/ShelterHero";
import StreetSanctuaryScroll from "@/components/Home/StreetSanctuaryScroll";
import PartnerHubSection from "@/components/Home/PartnerHubSection";
import AcademyWingsSection from "@/components/Home/AcademyWingsSection";
import SanctuaryFinaleFooter from "@/components/Home/SanctuaryFinaleFooter";

export default function Home() {
  return (
    <>
      <ShelterHero />
      <StreetSanctuaryScroll />
      <PartnerHubSection />
      <AcademyWingsSection />
      <SanctuaryFinaleFooter />
    </>
  );
}
