export interface HeroFocusSlide {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  href: string;
}

export interface PillarSlide {
  id: string;
  headline: [string, string, string, string];
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
}

export interface StoryChapter {
  index: string;
  title: string;
  description: string;
  href: string;
}

export interface VisionMissionCard {
  id: string;
  tone: "pine" | "teal";
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  title: string;
  description: string;
}

export interface RoadmapPreviewItem {
  number: string;
  label: string;
  href: string;
}

export interface CoreValueItem {
  title: string;
  description: string;
  pillar: string;
}

export interface FoundingSeatRole {
  name: string;
  initials: string;
  role: string;
  focus: string;
  imageSrc?: string;
}

export const HERO_FOCUS_SLIDES: HeroFocusSlide[] = [
  {
    imageSrc: "/about/pillar-network.jpg",
    imageAlt: "Rescue workers walking alongside recovery kennels and a white dispatch van",
    eyebrow: "Stage 01 · Active Grid",
    title: "Shared Shelter Beds",
    ctaLabel: "Explore Stage 01",
    href: "/roadmap#stage-1",
  },
  {
    imageSrc: "/about/mission-rescue.jpg",
    imageAlt: "Veterinarian gently examining an injured street dog on a triage table",
    eyebrow: "Stage 02 · Vet Network",
    title: "Emergency Triage & ABC",
    ctaLabel: "Explore Stage 02",
    href: "/roadmap#stage-2",
  },
  {
    imageSrc: "/Puppies_resting_at_animal_shelter_296b8c41.jpg",
    imageAlt: "Rescued puppies resting calmly inside a safe straw-lined sanctuary ward",
    eyebrow: "Stage 03 · Build Plan",
    title: "Flagship Sanctuary",
    ctaLabel: "Explore Stage 03",
    href: "/roadmap#stage-3",
  },
  {
    imageSrc: "/about/pillar-academy.jpg",
    imageAlt: "Handler working patiently outdoors with an attentive rescued Indian dog",
    eyebrow: "Stage 04 · Academy",
    title: "The Canine Academy",
    ctaLabel: "Explore Stage 04",
    href: "/roadmap#stage-4",
  },
];

export const PILLAR_SLIDES: PillarSlide[] = [
  {
    id: "compassion",
    headline: ["STREET", "FIRST", "COMPASSION", "ALWAYS"],
    imageSrc: "/Veterinarian_tending_to_dog_51eefdfd.jpg",
    imageAlt: "Caretaker treating a rescued street dog at the triage table",
    title: "Everyday Street Care",
    subtitle: "Urgent Triage & Safe Recovery",
  },
  {
    id: "network",
    headline: ["SHARED", "SHELTERS", "STRONGER", "TOGETHER"],
    imageSrc: "/about/pillar-network.jpg",
    imageAlt: "Rescue workers beside recovery kennels and a community dispatch van",
    title: "Connected Network",
    subtitle: "Pooled Beds, Vets & Volunteers",
  },
  {
    id: "academy",
    headline: ["TRAINING", "HOPE", "SECOND", "CHANCES"],
    imageSrc: "/about/pillar-academy.jpg",
    imageAlt: "NPIA handler working calmly outdoors with an attentive rescued Indian dog",
    title: "The Canine Academy",
    subtitle: "Confidence & Loving Placements",
  },
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    index: "01",
    title: "The Witness",
    description:
      "Seeing road-injured, hungry street dogs and monsoon-stranded animals wait without coordinated trauma triage made inaction impossible.",
    href: "#vision-mission",
  },
  {
    index: "02",
    title: "The Bottleneck",
    description:
      "Independent feeders and local shelters worked around the clock, yet full wards in one area and empty recovery kennels elsewhere stayed disconnected.",
    href: "/roadmap#stage-1",
  },
  {
    index: "03",
    title: "The Founding Idea",
    description:
      "Nirvana Paws Initiative & Academy (NPIA) took shape to unite rescue logistics, veterinary partnerships, shelter capacity, and humane education.",
    href: "#charter",
  },
  {
    index: "04",
    title: "Pooling Partner Beds",
    description:
      "Instead of waiting years to pour concrete, we launch by linking local NGOs, tracking open recovery beds, and sharing dispatch transport.",
    href: "/roadmap#stage-1",
  },
  {
    index: "05",
    title: "Vet Triage & ABC Grid",
    description:
      "Connecting zonal veterinary clinics for 24/7 emergency trauma care, mass Animal Birth Control (ABC), anti-rabies drives, and civic feeder defense.",
    href: "/roadmap#stage-2",
  },
  {
    index: "06",
    title: "Sanctuary & Second Chances",
    description:
      "Building NPIA’s first flagship sanctuary alongside the Canine Academy so recovered animals graduate into loving homes or service roles.",
    href: "/roadmap#stage-3",
  },
];

export const VISION_MISSION_CARDS: VisionMissionCard[] = [
  {
    id: "vision",
    tone: "pine",
    imageSrc: "/about/vision-community.jpg",
    imageAlt: "Community volunteers feeding calm street dogs beside a clay water bowl in warm morning light",
    imagePosition: "54% 50%",
    title: "Our Vision",
    description:
      "A compassionate city where every street dog and urban animal is protected, healed, and given the chance to thrive.",
  },
  {
    id: "mission",
    tone: "teal",
    imageSrc: "/about/mission-rescue.jpg",
    imageAlt: "Veterinarian gently examining an injured Indian street dog wrapped in a towel",
    imagePosition: "50% 35%",
    title: "Our Mission",
    description:
      "Connect rescuers, vets, and partner beds today while building our permanent sanctuary and canine academy for lifelong care.",
  },
];

export const ROADMAP_PREVIEW: RoadmapPreviewItem[] = [
  {
    number: "01",
    label: "Connected Shelter & Workforce Grid pooling partner beds today",
    href: "/roadmap#stage-1",
  },
  {
    number: "02",
    label: "Vet Triage, Dispatch & ABC Drives cutting street trauma times",
    href: "/roadmap#stage-2",
  },
  {
    number: "03",
    label: "Flagship Sanctuary Build with isolation, post-op & wildlife wards",
    href: "/roadmap#stage-3",
  },
  {
    number: "04",
    label: "The Canine Academy graduating therapy, guide & aid companions",
    href: "/roadmap#stage-4",
  },
];

export const CORE_VALUES: CoreValueItem[] = [
  {
    title: "Compassion & Dignity",
    description:
      "Every injured, abandoned, or fearful animal receives patient medical care and gentle handling without judgment.",
    pillar: "Dedication · Field Rescue",
  },
  {
    title: "Collaborative Action",
    description:
      "We pool beds, veterinary slots, and volunteer transport across allied shelters so critical cases never wait on bricks.",
    pillar: "Collaboration · Partner Grid",
  },
  {
    title: "Empowerment & Integrity",
    description:
      "From community education and peaceful cruelty advocacy to transparent use of every contribution, honesty guides our work.",
    pillar: "Integrity · Stewardship",
  },
];

export const FOUNDING_SEATS: FoundingSeatRole[] = [
  {
    name: "Palak",
    initials: "P",
    role: "President",
    focus: "Mission direction, partner shelter alliances & community outreach",
  },
  {
    name: "Varun",
    initials: "V",
    role: "Vice President",
    focus: "Program coordination, field readiness & cross-team execution",
  },
  {
    name: "Tanmay",
    initials: "T",
    role: "General Secretary",
    focus: "Operational coordination, rescue dispatch & animal welfare care standards",
  },
  {
    name: "Gagan Sai",
    initials: "GS",
    role: "Joint Secretary",
    focus: "Volunteer mobilization, veterinary clinic tie-ups & school workshops",
  },
  {
    name: "Akhil",
    initials: "A",
    role: "Treasurer",
    focus: "Stewardship planning, supply tracking & sanctuary build budgeting",
  },
  {
    name: "Gayatri",
    initials: "G",
    role: "Office Bearer",
    focus: "Community coordination, rescue follow-ups & shelter support operations",
  },
  {
    name: "Akshitha",
    initials: "AK",
    role: "Office Bearer",
    focus: "Field volunteer scheduling, adoption outreach & welfare drives",
  },
];
