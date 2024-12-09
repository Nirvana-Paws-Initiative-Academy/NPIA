"use client";

import Image from "next/image";
import heroSectionImage from "@/public/NPIA_ Hero Section Icon.png";
import Button from "@/components/UI/Button";
import { CommonSection } from "@/components/UI/CommonSection";
import fact1 from "@/public/Fourdogs.png";
import { Icon } from "@/components/UI/Icons";
import secondSectionSmalImg from "@/public/small.png";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/UI/Input";

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
    action: "modal", // Action type for Donate
  },
  {
    id: 2,
    name: "Volunteer",
    description:
      "Volunteer with NPIA and help us create a better world for Stray Puppies in need.",
    action: "navigate", // Action type for Volunteer
  },
  {
    id: 3,
    name: "Foster",
    description: "Give a temporary home, make a lasting impact. Foster today!",
    action: "navigate", // Action type for Foster
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const handleAction = (action: string) => {
    if (action === "modal") {
      setShowModal(true);
    } else if (action === "navigate") {
      location.href = "/contact-us";
    }
  };

  return (
    <>
      {/* <SmoothScrollSections> */}
      <section className="min-h-screen flex flex-col items-center justify-center gap-8 ">
        <div className="hero-section_img">
          <Image
            src={heroSectionImage}
            alt="Hero section image for NPIA"
            className="w-full sm:w-[30vw] h-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-[#4B714C] text-4xl font-[400] text-center 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl">
            Rescuing & Empowering Stray Puppies
          </h1>
          <p className="text-[#4B714C] text-2xl font-[400] capitalize text-center 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">
            Help us get started
          </p>
          <Button variant="primary" size="large">
            Donate Now
          </Button>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center">
        <div className="common-section-info flex flex-col items-center justify-center sm:justify-around gap-[1vw] min-h-screen">
          <div className="flex items-center flex-col gap-7 sm:gap-[1vw] p-4">
            <h1 className="text-[#4B714C] text-5xl tracking-tight font-bold text-center sm:text-[clamp(1rem,4vw,12rem)]">
              Only 1 in 5 Stray Puppies Make It
            </h1>

            {/* Full description for small screens when smallScreenDescription is false */}
            <p
              className={`w-full sm:w-4/5 text-[#4B714C] text-center text-lg sm:text-[clamp(1.3rem,1.6vw,9rem)] leading-snug font-[500] hidden sm:block `}
            >
              In the bustling streets of India, millions of stray puppies face a
              daily struggle for survival. Sadly, only a fraction of these
              vulnerable creatures reach adulthood. Disease, hunger, accidents,
              and cruelty claim far too many young lives. Nirvana Paws
              Initiative & Academy is dedicated to changing this reality.
            </p>

            <p className="flex sm:hidden w-full sm:w-4/5 text-[#4B714C] text-center text-xl sm:text-2xl font-[500] flex-col gap-4">
              <>
                In the bustling streets of India, millions of stray puppies face
                a daily struggle for survival. Sadly, only a fraction of these
                vulnerable creatures reach adulthood. <br />
                <span>
                  Disease, hunger, accidents, and cruelty claim far too many
                  young lives. Nirvana Paws Initiative & Academy is dedicated to
                  changing this reality.
                </span>
              </>
            </p>
          </div>
          <div className="common-section-img w-full">
            <>
              <Image
                src={secondSectionSmalImg}
                alt={"title"}
                className="w-[80%] sm:hidden m-auto h-auto object-contain "
              />
              <Image
                src={fact1}
                alt={"title"}
                className="hidden sm:block w-[60%] 4xl:w-[60vw] m-auto h-auto object-cover"
              />
            </>
          </div>
        </div>
      </section>

      <CommonSection
        title="Nirvana Paws Initiative & Academy: Making A Difference"
        description="We rescue puppies from perilous situations, provide them with essential medical care and nutrition, and shower them with love and attention. Our specialized training programs equip them with the skills and confidence for successful adoption, or fulfilling roles as working dogs."
        smallDescription={false}
      />

      <section className="flex flex-col items-center justify-center w-full relative min-h-screen">
        <div className="goals-title mb-[2vh]">
          <h2 className="text-4xl text-[#4B714C] sm:text-[clamp(.5rem,2vw,10rem)]">
            Our Goals
          </h2>
        </div>
        <div className="goals-cards-container">
          <div className="goals-cards flex items-stretch flex-wrap justify-center w-full 4xl:w-[90vw] m-auto 4xl:gap-4">
            {GOALS_DATA.map((goal) => (
              <div
                key={goal.id}
                className="flip-card w-[150px]  h-[150px] sm:w-[15vw] sm:h-[30vh] m-2 sm:m-4"
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front flex flex-col items-center justify-around p-4">
                    <div>
                      <Icon name={goal.name} />
                    </div>
                    <p className="text-center font-medium text-lg sm:text-2xl text-[#4B714C] text-[clamp(1rem,1vw,2.5rem)] 4xl:text-[clamp(1.5rem,1.2vw,3.2rem)]">
                      {goal.name}
                    </p>
                  </div>
                  <div className="hidden sm:flex flip-card-back p-4  items-center justify-center">
                    <p className=" text-[#4B714C] leading-tight text-center text-[clamp(1rem,1vw,2.5rem)] 4xl:text-[clamp(1.5rem,1vw,3rem)]">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 w-full relative min-h-screen">
        <div className="goals-title flex items-center flex-col p-3">
          <h2 className="text-[#4B714C] sm:text-[clamp(1rem,2.5vw,10rem)] ">
            Be A Lifeline
          </h2>
          <p className="text-[#8DB68E] text-center text-xl sm:text-[clamp(.5rem,2vw,8rem)] leading-tight">
            Support our mission by contributing your time, skills, or resources
            to help pets thrive!
          </p>
        </div>
        <div className="flex items-stretch flex-wrap justify-center gap-[1.2vw] w-full">
          {LIFELINE_DATA.map((goal) => (
            <div
              key={goal.id}
              className="card bg-[#E2FFE4] w-[90%] h-[320px] sm:w-[20vw] sm:h-[50vh]  flex flex-col items-center sm:items-start justify-center gap-[2vw] p-[1.2vw] relative transition-all duration-300  border-[#E2ffe4] border-2 hover:border-[#4b714c] rounded-lg sm:hover:rounded-tr-[20%] hover:bg-[#fafffd]"
            >
              <div className="flex items-start justify-start self-start">
                <Icon name={goal.name} />
              </div>

              <div className="flex flex-col justify-start items-center sm:items-start gap-[1.2vw] mb-4 card-content">
                <h2 className="text-center font-medium text-3xl sm:text-[clamp(.5rem,2vw,10rem)] text-[#4B714C]">
                  {goal.name}
                </h2>
                <p className="text-[#8DB68E] font-medium tracking-tight text-center sm:text-left w-9/12 sm:w-full text-xl sm:text-[clamp(.5rem,1.5vw,7rem)] leading-tight">
                  {goal.description}
                </p>
              </div>

              <div
                className="arrow-container"
                onClick={() => handleAction(goal.action)}
              >
                <p className="arrow-icon transition-transform duration-300 clickable">
                  <Icon name="right-arrow" />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Donate */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#E2FFE4] w-[90%] sm:w-[50%]  p-6 rounded-lg shadow-lg relative">
              <div className="flex items-center  justify-between mb-4">
                <h2 className="text-3xl font-bold text-[#4B714C]">
                  Donate Now
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className=" text-gray-500 hover:text-gray-700"
                  aria-label="Close Modal"
                >
                  <X />
                </button>
              </div>
              <div>
                <form className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        icon="input_user"
                        key="firstName"
                        label="First name"
                      />

                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        icon="input_user"
                        key="lastName"
                        label="Last name"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        id="emailId"
                        name="emailId"
                        required
                        icon="input_user"
                        key="emailId"
                        label="Email Id"
                      />

                      <Input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        icon="input_user"
                        key="phoneNumber"
                        label="Phone number"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        id="occupation"
                        name="occupation"
                        required
                        icon="input_occupation"
                        key="occupation"
                        label="Occupation"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-4">
                <Button
                  size="medium"
                  variant="primary"
                  onClick={() => setShowModal(false)}
                >
                  Make Donation
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* </SmoothScrollSections> */}
    </>
  );
}
