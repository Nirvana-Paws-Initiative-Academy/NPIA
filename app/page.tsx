import Image from "next/image";
import heroSectionImage from "@/public/NPIA_ Hero Section Icon.png";
import Button from "@/components/UI/Button";
import { CommonSection } from "@/components/UI/CommonSection";
import fact1 from "@/public/fact-1.webp";
export default function Home() {
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center gap-8 ">
        <div className="hero-section_img">
          <Image
            src={heroSectionImage}
            alt="Hero section image for NPIA"
            className="w-full sm:w-[30vw] h-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-[#4B714C] text-4xl font-[400] text-center">
            Rescuing & Empowering Stray Puppies
          </h1>
          <p className="text-[#4B714C] text-2xl font-[400] capitalize">
            Help us get started
          </p>
          <Button variant="primary" size="large">
            Donate Now
          </Button>
        </div>
      </section>
      <CommonSection
        title="Only 1 in 5 Stray Puppies Make It"
        description="In the bustling streets of India, millions of stray puppies face a daily struggle for survival. Sadly, only a fraction of these vulnerable creatures reach adulthood. Disease, hunger, accidents, and cruelty claim far too many young lives. Nirvana Paws Initiative & Academy is dedicated to changing this reality. Just for checking"
        withImage
        src={fact1}
      />
    </>
  );
}
