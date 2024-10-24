import Image from "next/image";
import heroSectionImage from "@/public/NPIA_ Hero Section Icon.png";
import Button from "@/components/UI/Button";
import { CommonSection } from "@/components/UI/CommonSection";
import fact1 from "@/public/fact-1.webp";
import { Icon } from "@/components/UI/Icons";
import { CircleArrowOutUpRight } from "lucide-react";

const GOALS_DATA = [
  {
    id: 1,
    name: "Life Transformations",
    description:
      "We rescue animals from hardship and provide the care and training they need to thrive. This includes medical treatment, nutritious food, and a safe and loving environment where they can heal and grow.",
  },
  {
    id: 2,
    name: "Restored Well-being",
    description:
      "We prioritize the physical and emotional health of every animal in our care. Through rehabilitation and enrichment programs, we help them overcome past trauma and develop the confidence to embrace new opportunities.",
  },
  {
    id: 3,
    name: "Empowered Futures",
    description:
      "We equip animals with the skills and knowledge to succeed in their new lives, whether it's through obedience training, socialization, or specialized training for specific roles.  We empower them to reach their full potential.",
  },
  {
    id: 4,
    name: "Second Chances",
    description:
      "Every animal deserves a second chance at happiness. We are dedicated to finding loving forever homes or fulfilling working roles where they can experience joy, companionship, and purpose.",
  },
  {
    id: 5,
    name: "Safer Neighborhoods",
    description:
      "By reducing the number of stray animals, we contribute to safer neighborhoods for both people and animals.",
  },
  {
    id: 6,
    name: "Thriving Companions",
    description:
      "Our goal is to see every animal we care for flourish in a loving environment. We provide ongoing support to adopters and work to create a community where animals are cherished and protected.",
  },
  {
    id: 7,
    name: "Compassionate Communities",
    description:
      "We foster a culture of compassion and respect for all living beings through education, outreach, and community engagement.",
  },
  {
    id: 8,
    name: "A Kinder World",
    description:
      "We inspire people to take action and make a difference in the lives of animals, creating a kinder and more humane world for all.",
  },
  {
    id: 9,
    name: "Public Health Impact",
    description:
      "We promote responsible pet ownership and support spaying/neutering programs to help control the stray population and reduce the risk of disease transmission.",
  },
  {
    id: 10,
    name: "Building Better Future",
    description:
      "We are committed to creating a sustainable future where animals are valued and protected, and where every animal has the opportunity to thrive.",
  },
];

const LIFELINE_DATA = [
  {
    id: 1,
    name: "Donate",
    description:
      "Give today and help us provide loving care, shelter, and a second chance to Stray Puppies in need.",
  },
  {
    id: 2,
    name: "Volunteer",
    description:
      "Volunteer with NPIA and help us create a better world for Stray Puppies in need.",
  },
  {
    id: 3,
    name: "Foster",
    description: "Give a temporary home, make a lasting impact. Foster today!",
  },
];

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
            Rescuing & Empowering Stray Pupp ies
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
      <CommonSection
        title="Nirvana Paws Initiative & Academy: Making A Difference"
        description="We rescue puppies from perilous situations, provide them with essential medical care and nutrition, and shower them with love and attention. Our specialized training programs equip them with the skills and confidence for successful adoption, or fulfilling roles as working dogs."
      />

      <section className="flex flex-col items-center justify-center  min-h-screen sm:h-screen w-full relative">
        <div className="goals-title">
          <h2 className="text-4xl text-[#4B714C]">Our Goals</h2>
        </div>
        <div className="goals-cards-container">
          <div className="goals-cards flex items-stretch flex-wrap justify-center w-full">
            {GOALS_DATA.map((goal) => (
              <div
                key={goal.id}
                className="flip-card w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] m-2 sm:m-4"
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front flex flex-col items-center justify-around p-4">
                    <div>
                      <Icon name={goal.name} />
                    </div>
                    <p className="text-center font-medium text-2xl text-[#4B714C]">
                      {goal.name}
                    </p>
                  </div>
                  <div className="hidden sm:flex flip-card-back p-4  items-center justify-center">
                    <p className="text-lg text-[#4B714C] leading-tight text-center">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 min-h-screen w-full relative">
        <div className="goals-title flex items-center flex-col">
          <h2 className="text-4xl text-[#4B714C]">Be A Lifeline</h2>
          <p className="text-[#8DB68E] text-2xl">
            Support our mission by contributing your time, skills, or resources
            to help pets thrive!
          </p>
        </div>
        <div className="flex items-stretch flex-wrap justify-center gap-4 w-full">
          {LIFELINE_DATA.map((goal) => (
            <div
              key={goal.id}
              className="card bg-[#E2FFE4] w-[280px] h-[350px] flex flex-col items-start justify-center gap-2 p-2 relative transition-all duration-300  border-[#E2ffe4] border-2 hover:border-[#4b714c] rounded-lg hover:rounded-tr-[20%] hover:bg-[#fafffd] "
            >
              <div className="card_icon">
                <Icon name={goal.name} />
              </div>

              <div className="flex flex-col justify-start items-start mb-4 card-content">
                <h2 className="text-center font-medium text-3xl text-[#4B714C]">
                  {goal.name}
                </h2>
                <p className="text-[#8DB68E] font-medium text-xl tracking-tight leading-snug">
                  {goal.description}
                </p>
              </div>

              <div className="arrow-container ">
                <p className="arrow-icon transition-transform duration-300 clickable">
                  <Icon name="right-arrow" />
                </p>
                {/* <CircleArrowOutUpRight className="arrow-icon text-[#4B714C] " /> */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
