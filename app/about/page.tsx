"use client";
import { CommonSection } from "@/components/UI/CommonSection";
import React, { useState } from "react";
import AboutUsImage from "@/public/AboutUsDog.png";
import { Icon } from "@/components/UI/Icons";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "@/public/group-of-five-people.webp";
import img2 from "@/public/a-man-with-a-beard.webp";
import { ImageWithTextSection } from "@/components/UI/ImageWithTextSection";
import { MeetTheTeam } from "./_components/MeetTheTeam";

const DATA = [
  { id: 1, name: "Compassion" },
  {
    id: 2,
    name: "Dedication",
  },
  {
    id: 3,
    name: "Empowerment",
  },
  {
    id: 4,
    name: "Collaboration",
  },
  {
    id: 5,
    name: "Integrity",
  },
];

const Page = () => {
  // Define the options data with exact key types
  const optionsData = {
    "The Spark": {
      title: "The Spark",
      description:
        "Witnessing the plight of stray animals in India ignited a passion for animal welfare within a group of compassionate individuals.",
    },
    "The Vision": {
      title: "The Vision",
      description:
        "Driven by a Shared dream of a Better future for Puppies, the founders envisioned a place where rescue, rehabilitation, and empowerment.",
    },
    "The Birth": {
      title: "The Birth",
      description:
        "Nirvana Paws Initiative & Academy (INSPIRE) is founded, dedicated to providing comprehensive care and support to animals in need.",
    },
    "The Hope": {
      title: "The Hope",
      description:
        "Begin rescue and rehabilitation operations, providing essential care and shelter to stray puppies.",
    },
    "The Incubation": {
      title: "The Incubation",
      description:
        "Launch specialized training programs, focusing on preparing animals for loving homes or fulfilling roles in the community.",
    },
    "The Rebirth": {
      title: "The Rebirth",
      description:
        "Implement community outreach and education initiatives to raise awareness about animal welfare and responsible pet ownership.",
    },
  };

  // Define a type that represents the keys of optionsData
  type OptionKey = keyof typeof optionsData;

  // Use OptionKey type for selectedOption state
  const [selectedOption, setSelectedOption] = useState<OptionKey>("The Spark");

  return (
    // <SmoothScrollSections>
    <>
      <CommonSection
        title="At Nirvana Paws Initiative & Academy"
        description="Our philosophy is rooted in a deep-seated belief that every animal deserves a chance to live a full and happy life."
        smallDescription={false}
        withImage
        largeSrc={AboutUsImage}
      />

      <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto gap-[2vw]">
        <div className="flex flex-col sm:flex-row items-center justify-between w-9/12">
          <div className="flex flex-col items-start justify-start gap-[1vw]">
            <p className="text-xl text-[#4B714C] sm:text-[clamp(.5rem,2vw,10rem)]">
              A Timeline of Compassion
            </p>
            <h3 className="text-4xl font-[400] text-[#4B714C] tracking-tight sm:text-[clamp(1.3rem,1.8vw,8rem)]text-center sm:text-left">
              Our Story
            </h3>
          </div>
          <div className="w-full sm:w-4/6">
            <p className="text-[#4B714C] text-lg text-justify font-medium sm:text-[clamp(.5rem,1.2vw,7rem)] leading-snug">
              The streets of India are home to countless stray animals, many of
              whom face a daily struggle for survival. These animals, often
              overlooked and undervalued, deserve a chance at a better life.
              Nirvana Paws Initiative & Academy (INSPIRE) was founded on the
              belief that every animal deserves compassion, care, and the
              opportunity to thrive.
            </p>
          </div>
        </div>

        <div className="flex mt-4 sm:mt-8 w-9/12 flex-col sm:flex-row">
          {/* Display the content based on selected option */}
          <div className="w-full sm:w-7/12 h-[180px] sm:h-auto bg-[#E2FFE4] flex flex-col justify-center p-3 sm:p-[1.5vw] rounded-[1vw] gap-[1.2vw] ">
            <span>
              <Icon
                name={optionsData[selectedOption].title}
                width="80"
                height="80"
              />
            </span>
            <h2 className="text-[#4B714C] text-3xl sm:text-[clamp(.5rem,2.5vw,12rem)]">
              {optionsData[selectedOption].title}
            </h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={selectedOption}
                className="text-[#4B714C] text-md  text-justify sm:text-[clamp(.8rem,1.2vw,10rem)] leading-none font-medium"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: "easeOut" },
                }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
              >
                {optionsData[selectedOption].description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Options List with Staggered Animations */}
          <div className="flex flex-col w-full sm:w-2/5 h-auto overflow-y-auto rounded-xl">
            {Object.keys(optionsData).map((option, index) => (
              <motion.div
                key={option}
                className={`border-b-2 border-b-slate-100 text-[#4B714C] flex items-center justify-center p-[.8vw] cursor-pointer last:border-none clickable `}
                onClick={() => setSelectedOption(option as OptionKey)}
                initial={{
                  opacity: 0,
                  x: -30,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1, // Staggered animation
                    ease: "easeOut",
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -30,
                  scale: 0.9,
                  transition: { duration: 0.5 },
                }}
              >
                <h2 className="truncate text-xl sm:text-[clamp(.5rem,1.4vw,8rem)] flex items-center gap-[1vw] active:scale-90 w-[30vw] sm:w-[10vw]">
                  <span className="text-sm">
                    <Icon name={option} width="35" height="35" />
                  </span>
                  {option}
                </h2>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-evenly min-h-screen w-full m-auto ">
        <ImageWithTextSection
          title="Our Vision"
          description="To create a compassionate community where all puppies are
            cherished, protected, and given the opportunity to thrive in
            loving homes or fulfilling roles."
          src={img1}
          alt="Group of 5 people with a dog"
          className="flex-col-reverse sm:flex-row"
          textClassName="text-center sm:text-left"
        />

        <ImageWithTextSection
          title="Our Mission"
          description="To rescue and empower stray puppies in through expert care and specialized training, preparing them for successful adoption, or working dogs."
          src={img2}
          alt="Group of 5 people with a dog"
          className="flex-col-reverse sm:flex-row-reverse"
          textClassName="text-center sm:text-right"
        />
      </section>

      <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto gap-[2vh] sm:gap-[4vh]">
        <div className="flex items-center justify-center flex-col gap-[1vh] sm:gap-[2vh] ">
          <h2 className="text-[#4B714C]  font-bold text-2xl sm:text-[clamp(1rem,2.5vw,10rem)] sm:leading-none">
            Our Core Values
          </h2>
          <p className="text-[#8DB68E] text-xl sm:text-[clamp(.5rem,2vw,8rem)] font-medium capitalize text-center">
            The core Principles that guide NPIA' s work
          </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-8 w-full">
          {DATA.map((data) => (
            <div key={data.id} className="flex flex-col items-center gap-4">
              <div className="icon bg-[#E2FFE4] p-4 rounded-3xl w-[20vw] h-[10vh]  sm:w-[10vw] sm:h-[15vh] flex items-center justify-center">
                <Icon name={data.name} />
              </div>
              <div>
                <h3 className="text-[#4B714C] font-bold text-xl sm:text-[clamp(1rem,1.2vw,10rem)]">
                  {data.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <MeetTheTeam />
    </>
    // </SmoothScrollSections>
  );
};

export default Page;
