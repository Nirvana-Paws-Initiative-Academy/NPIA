export type PartnerWorldId = "organisations" | "individuals" | "partnerships";
export type SentenceChoiceId = PartnerWorldId | "join";

export interface PartnerWorldMeta {
  id: SentenceChoiceId;
  label: string;
  color: string;
  onColor: string;
  blurb: string;
  previewIndex?: number;
}

export interface PartnerRingCard {
  id: string;
  numeral: string;
  title: string;
  world: PartnerWorldId;
  imageSrc: string;
  videoSrc?: string;
  objectPosition?: string;
  ratio: number;
  href: string;
}

export interface PetalSpec {
  left: number;
  top: number;
  width: number;
  duration: number;
  delay: number;
  layer: "back" | "front";
  variant: "white" | "mint";
  mirrored: boolean;
}

export interface MoteSpec {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

export const PARTNER_BG_IMAGE = "/partner-network/pine-forest-bg.jpg";

export const PARTNER_STATS = [
  { value: "03", label: "Partner Tracks" },
  { value: "10+", label: "Allied Orgs Goal" },
  { value: "4", label: "Stages" },
] as const;

export const PARTNER_WORLDS: Record<SentenceChoiceId, PartnerWorldMeta> = {
  organisations: {
    id: "organisations",
    label: "ALLIED ORGANISATIONS",
    color: "#B2DCB3",
    onColor: "#0B1C0E",
    blurb:
      "Rescue NGOs, shelters, and institutions pooling beds and shared capacity.",
    previewIndex: 0,
  },
  individuals: {
    id: "individuals",
    label: "ALLIED INDIVIDUALS",
    color: "#FAFFFD",
    onColor: "#0B1C0E",
    blurb:
      "Veterinarians, handlers, foster carers, and street rescue responders.",
    previewIndex: 1,
  },
  partnerships: {
    id: "partnerships",
    label: "PARTNERSHIPS",
    color: "#E2FFE4",
    onColor: "#102111",
    blurb:
      "Zonal clinic tie-ups, civic initiatives, and long-term sanctuary support.",
    previewIndex: 2,
  },
  join: {
    id: "join",
    label: "PARTNER WITH US",
    color: "#B2DCB3",
    onColor: "#0B1C0E",
    blurb:
      "Collaborate with NPIA as an organisation, individual, or institutional partner.",
  },
};

export const PARTNER_RING_CARDS: PartnerRingCard[] = [
  {
    id: "allied-shelters-grid",
    numeral: "01",
    title: "Allied Shelters Grid",
    world: "organisations",
    imageSrc: "/about/pillar-network.jpg",
    objectPosition: "50% 25%",
    ratio: 1600 / 900,
    href: "/about#obj-6",
  },
  {
    id: "veterinary-responders",
    numeral: "02",
    title: "Veterinary Responders",
    world: "individuals",
    imageSrc: "/Veterinarian_tending_to_dog_51eefdfd.jpg",
    objectPosition: "50% 25%",
    ratio: 1440 / 810,
    href: "/about#obj-8",
  },
  {
    id: "sanctuary-alliance",
    numeral: "03",
    title: "Community Sanctuary Alliance",
    world: "partnerships",
    imageSrc: "/Puppies_resting_at_animal_shelter_296b8c41.jpg",
    objectPosition: "50% 45%",
    ratio: 1600 / 900,
    href: "/roadmap#stage-1",
  },
  {
    id: "shared-kennel-registry",
    numeral: "04",
    title: "Live Kennel & Bed Registry",
    world: "organisations",
    imageSrc: "/Workers_walking_past_animal_shelter_cc43adf0.jpg",
    objectPosition: "50% 30%",
    ratio: 1440 / 900,
    href: "/roadmap#stage-1",
  },
  {
    id: "clinic-hospital-tieups",
    numeral: "05",
    title: "Clinic & Hospital Tie-Ups",
    world: "partnerships",
    imageSrc: "/hero/street-dogs-poster.jpg",
    videoSrc: "/hero/caring-for-street-dogs-scrub.mp4",
    objectPosition: "50% 50%",
    ratio: 1440 / 810,
    href: "/roadmap#stage-2",
  },
  {
    id: "volunteer-dispatch",
    numeral: "06",
    title: "Volunteer Field Dispatch",
    world: "individuals",
    imageSrc: "/about/mission-rescue.jpg",
    objectPosition: "50% 25%",
    ratio: 1440 / 810,
    href: "/about#obj-8",
  },
  {
    id: "canine-handlers",
    numeral: "07",
    title: "Canine Handlers & Trainers",
    world: "individuals",
    imageSrc: "/programs/canine-academy.jpg",
    objectPosition: "50% 35%",
    ratio: 1500 / 1000,
    href: "/our-programs",
  },
  {
    id: "shared-quarantine-ngos",
    numeral: "08",
    title: "Shared Quarantine NGOs",
    world: "organisations",
    imageSrc: "/Puppies_resting_at_animal_shelter_60e4af22.jpg",
    objectPosition: "50% 45%",
    ratio: 1500 / 1000,
    href: "/roadmap#stage-1",
  },
  {
    id: "foster-caregivers",
    numeral: "09",
    title: "30-Day Foster Caregivers",
    world: "individuals",
    imageSrc: "/about/pillar-academy.jpg",
    videoSrc: "/partner-hub/caretaker-loop.mp4",
    objectPosition: "50% 30%",
    ratio: 1440 / 810,
    href: "/roadmap#stage-1",
  },
  {
    id: "civic-sponsors",
    numeral: "10",
    title: "Civic & Institutional Grants",
    world: "partnerships",
    imageSrc: "/Trainer_working_with_street_dog_0914a563.jpg",
    objectPosition: "50% 30%",
    ratio: 1440 / 810,
    href: "/about#obj-6",
  },
  {
    id: "school-chapters",
    numeral: "11",
    title: "School & Campus Chapters",
    world: "partnerships",
    imageSrc: "/programs/community-schools.jpg",
    objectPosition: "50% 35%",
    ratio: 1440 / 900,
    href: "/our-programs",
  },
  {
    id: "therapy-practitioners",
    numeral: "12",
    title: "Therapy Dog Practitioners",
    world: "individuals",
    imageSrc: "/Handler_training_dog_outdoors_a386a55b.jpg",
    objectPosition: "50% 30%",
    ratio: 1440 / 900,
    href: "/roadmap#stage-4",
  },
  {
    id: "disaster-collectives",
    numeral: "13",
    title: "Disaster Relief Collectives",
    world: "organisations",
    imageSrc: "/hero/street-storm.jpg",
    objectPosition: "50% 45%",
    ratio: 1440 / 900,
    href: "/about#obj-7",
  },
  {
    id: "wildlife-collaborators",
    numeral: "14",
    title: "Wildlife Aid Collaborators",
    world: "organisations",
    imageSrc: "/Caregiver_releasing_bird_outdoors_7c470ee1.jpg",
    objectPosition: "50% 35%",
    ratio: 1600 / 900,
    href: "/our-programs",
  },
  {
    id: "community-feeders",
    numeral: "15",
    title: "Community Feeders Network",
    world: "individuals",
    imageSrc: "/Volunteers_feeding_street_dogs_4baea6f6.jpg",
    objectPosition: "50% 25%",
    ratio: 1600 / 900,
    href: "/about#obj-6",
  },
  {
    id: "sanctuary-partners",
    numeral: "16",
    title: "Flagship Sanctuary Partners",
    world: "partnerships",
    imageSrc: "/about/vision-community.jpg",
    objectPosition: "50% 35%",
    ratio: 1600 / 900,
    href: "/roadmap#stage-3",
  },
];

// Exact 17 petals from specification (12 back, 5 front)
export const PARTNER_PETALS: PetalSpec[] = [
  { left: 4, top: 14, width: 9, duration: 29, delay: 0, layer: "back", variant: "white", mirrored: true },
  { left: 14, top: 4, width: 7, duration: 34, delay: -12, layer: "back", variant: "mint", mirrored: false },
  { left: 24, top: 26, width: 8, duration: 31, delay: -21, layer: "back", variant: "white", mirrored: false },
  { left: 36, top: 10, width: 6, duration: 37, delay: -5, layer: "back", variant: "mint", mirrored: true },
  { left: 46, top: 30, width: 9, duration: 27, delay: -16, layer: "back", variant: "white", mirrored: false },
  { left: 56, top: 6, width: 7, duration: 33, delay: -27, layer: "back", variant: "mint", mirrored: false },
  { left: 66, top: 20, width: 8, duration: 30, delay: -9, layer: "back", variant: "white", mirrored: true },
  { left: 76, top: 2, width: 6, duration: 36, delay: -24, layer: "back", variant: "mint", mirrored: false },
  { left: 86, top: 24, width: 9, duration: 28, delay: -3, layer: "back", variant: "white", mirrored: false },
  { left: 94, top: 12, width: 7, duration: 35, delay: -18, layer: "back", variant: "mint", mirrored: true },
  { left: 30, top: 44, width: 6, duration: 39, delay: -31, layer: "back", variant: "white", mirrored: false },
  { left: 60, top: 40, width: 7, duration: 32, delay: -13, layer: "back", variant: "mint", mirrored: false },
  { left: 10, top: 50, width: 14, duration: 23, delay: -6, layer: "front", variant: "mint", mirrored: true },
  { left: 40, top: 62, width: 12, duration: 26, delay: -19, layer: "front", variant: "white", mirrored: false },
  { left: 70, top: 56, width: 16, duration: 21, delay: -11, layer: "front", variant: "white", mirrored: false },
  { left: 88, top: 46, width: 13, duration: 24, delay: -2, layer: "front", variant: "mint", mirrored: true },
  { left: 52, top: 70, width: 11, duration: 28, delay: -23, layer: "front", variant: "mint", mirrored: false },
];

// Exact 14 light motes from specification
export const PARTNER_MOTES: MoteSpec[] = [
  { left: 8, top: 62, size: 10, duration: 14, delay: -2 },
  { left: 18, top: 40, size: 6, duration: 18, delay: -9 },
  { left: 27, top: 70, size: 14, duration: 16, delay: -5 },
  { left: 36, top: 52, size: 8, duration: 20, delay: -13 },
  { left: 44, top: 30, size: 5, duration: 17, delay: -3 },
  { left: 53, top: 66, size: 12, duration: 15, delay: -11 },
  { left: 61, top: 44, size: 7, duration: 19, delay: -7 },
  { left: 69, top: 74, size: 16, duration: 14, delay: -1 },
  { left: 77, top: 36, size: 6, duration: 21, delay: -15 },
  { left: 85, top: 58, size: 11, duration: 16, delay: -8 },
  { left: 92, top: 46, size: 7, duration: 18, delay: -4 },
  { left: 13, top: 82, size: 9, duration: 22, delay: -17 },
  { left: 48, top: 84, size: 13, duration: 17, delay: -6 },
  { left: 72, top: 22, size: 5, duration: 23, delay: -19 },
];

export const BRIEF_TRACKS = [
  "as an allied organisation",
  "as an allied individual",
  "through a partnership",
] as const;
