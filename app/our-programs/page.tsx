"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Abandoned from "@/public/abandoned.png";
import Injured from "@/public/injured.png";
import Unsafe from "@/public/unsafe.png";
import Care from "@/public/care.png";
import Inspire from "@/public/Inspire.png";
import Obedience from "@/public/Obidience.png";
import Service from "@/public/Character.png";
import Therapy from "@/public/Therapy Dog.png";

import { ImagesWithText } from "@/components/UI/ImagesWithText";
import { CommonSection } from "@/components/UI/CommonSection";

const INSPIRE = [
  { id: 1, str: "I", word: "INITIATIVE", cn: "top-[55%] -ml-[.7vw]" },
  { id: 2, str: "N", word: "Nurturing", cn: "top-[43%] ml-[5vw]" },
  { id: 3, str: "S", word: "Stray", cn: "top-[62%] ml-[2vw]" },
  { id: 4, str: "P", word: "PUPPIES", cn: "top-[23%]" },
  { id: 5, str: "I", word: "iNTO", cn: "top-[55%] ml-[.7vw]" },
  { id: 6, str: "R", word: "RESPONSIBLE", cn: "top-[25%]" },
  { id: 7, str: "E", word: "ENVIRONMENTS", cn: "top-[62%]" },
];

const DATA = [
  {
    id: 1,
    title: "Rescue",
    description:
      "Saving stray puppies from harm and providing immediate safety.",
  },
  {
    id: 2,
    title: "Rehabilitation",
    description: "Nurturing puppies back to physical and emotional well-being.",
  },
  {
    id: 3,
    title: "Specialized Training",
    description:
      "We actively engage our community through education and outreach programs.",
  },
  {
    id: 4,
    title: "Placement",
    description: "Finding loving forever homes where puppies can thrive.",
  },
];

const JOURNEY = [
  {
    id: 1,
    name: "Abandoned",
    src: Abandoned,
  },
  {
    id: 2,
    name: "Injured",
    src: Injured,
  },
  {
    id: 3,
    name: "Unsafe",
    src: Unsafe,
  },
];

const TRAINING = [
  {
    id: 1,
    name: "Basic Obedience",
    src: Obedience,
  },
  {
    id: 2,
    name: "Service Dogs",
    src: Service,
  },
  {
    id: 3,
    name: "Therapy Dogs",
    src: Therapy,
  },
];

const OurPrograms = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isLocked, setIsLocked] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (activeWordIndex >= INSPIRE.length - 1) {
      setIsLocked(false);
    }
  }, [activeWordIndex]);

  const handleScroll = (e: WheelEvent) => {
    if (!containerRef.current || !isLocked) return;

    e.preventDefault();

    // Determine scroll direction
    const isScrollingDown = e.deltaY > 0;

    // Update active word index based on scroll direction
    setActiveWordIndex((prev) => {
      if (isScrollingDown && prev < INSPIRE.length - 1) {
        return prev + 1;
      } else if (!isScrollingDown && prev > -1) {
        return prev - 1;
      }
      return prev;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        e.preventDefault();
        handleScroll(e);
      }
    };

    // Add event listener with passive: false to allow preventDefault
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isLocked]);

  return (
    <section
      ref={containerRef}
      className="flex flex-col items-center min-h-screen w-full overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-4xl text-[#4B714C] mb-8">Our Programs</h2>

        <div className="flex sm:flex-row flex-col justify-between gap-4 sm:gap-[5vw] border-b-2 border-[#4B714C]">
          {INSPIRE.map((s, index) => (
            <div key={s.id} className="relative">
              {/* The main INSPIRE letters - visible immediately */}
              <p className="text-[#4B714C] uppercase font-extrabold text-9xl sm:text-[clamp(20rem,22vw,50rem)] relative tracking-tight leading-none">
                {s.str}
              </p>

              {/* The words that appear on scroll */}
              <motion.p
                className={`absolute ${s.cn} text-center px-[1.5vw] py-[.5vw] bg-[#FAFFFD] text-[#4B714C] font-bold text-[clamp(1rem,1.2vw,3.5rem)] border-2 border-[#8DB68E] uppercase rounded-2xl`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: activeWordIndex >= index ? 1 : 0,
                  scale: activeWordIndex >= index ? 1 : 0,
                }}
                transition={{
                  duration: 0.9,
                }}
              >
                {s.word}
              </motion.p>
            </div>
          ))}
        </div>

        {/* DATA section */}
        <motion.div
          className="flex items-stretch justify-between w-full mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: activeWordIndex === INSPIRE.length - 1 ? 1 : 0,
            y: activeWordIndex === INSPIRE.length - 1 ? 0 : 50,
          }}
          transition={{ duration: 0.7 }}
        >
          {DATA.map((d) => (
            <div
              className="hidden sm:flex flex-col items-start w-[240px]"
              key={d.id}
            >
              <h3 className="text-[#4B714C] font-bold text-2xl">{d.title}</h3>
              <p className="text-[#8DB68E]">{d.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <ImagesWithText
        title="Our Journey Begins with Rescue"
        description="We actively seek out and rescue puppies from a variety of challenging situations."
        image={JOURNEY}
        label="Our motto"
      />
      <ImagesWithText
        title="Once In Our Care"
        description="We provide nutritious food, comfortable shelter, and a loving
            environment where they can begin to heal and recover."
        image={Care}
        label="Dog being rescued by NPIA"
      />
      <ImagesWithText
        title="INSPIRE in Action"
        description="We believe that every animal has the potential to thrive, and our specialized training programs are designed to unlock that potential."
        image={Inspire}
        label="We believe that every animal has the potential to thrive, and our specialized training programs are designed to unlock that potential."
      />
      <ImagesWithText
        title="Our Training Programs"
        description="Through individualized training, we equip animals with the skills and confidence they need to succeed in their new lives."
        image={TRAINING}
        label="Our motto."
      />

      <CommonSection
        title="Placement and Beyond"
        description="Our commitment to animals extends beyond rescue and rehabilitation. We
          carefully match each animal with a loving forever home or a fulfilling
          working role based on their individual needs and personality. We
          provide ongoing support to adopters to ensure a smooth transition and
          a lasting bond."
        smallScreenDescription={false}
      />
    </section>
  );
};

export default OurPrograms;
