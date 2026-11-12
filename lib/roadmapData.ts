export interface RoadmapMilestone {
  title: string;
  description: string;
}

export interface RoadmapStage {
  id: string;
  stageNumber: string;
  shortLabel: string;
  statusBadge: string;
  title: string;
  tagline: string;
  description: string;
  milestones: RoadmapMilestone[];
  ctaLabel: string;
  ctaHref: string;
  charterHref: string;
  charterLabel: string;
  accentTheme: "active" | "medical" | "capital" | "academy";
}

export const ROADMAP_HEADER = {
  eyebrow: "THE SANCTUARY ROADMAP · 4 STAGES OF IMPACT",
  headline: "Saving street animals today while building tomorrow’s sanctuary",
  subline:
    "We don’t wait for bricks and mortar to start saving lives. NPIA operates on a 4-stage rollout—starting by uniting existing shelters and veterinary clinics across the city, scaling into our own flagship sanctuary, and graduating life-changing service dogs.",
};

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    stageNumber: "01",
    shortLabel: "01 Shelter Grid",
    statusBadge: "STAGE 01 · ACTIVE FOUNDATION",
    title: "The Connected Shelter & Workforce Grid",
    tagline:
      "Unlocking empty recovery beds, shared workforce, and city-wide adoptions.",
    description:
      "Across the city, some rescue shelters overflow while others have open quarantine or recovery space. NPIA acts as a central logistics hub—connecting allied NGOs, pooling volunteer workforce, and routing rescued street animals into safe, available partner beds immediately.",
    milestones: [
      {
        title: "Allied Shelter Network",
        description:
          "Onboard 10+ local shelters and rescue groups into a unified space-sharing grid.",
      },
      {
        title: "Live Bed & Health Registry",
        description:
          "Deploy a centralized digital registry tracking open kennel capacity, medical logs, and vaccinations across partner shelters.",
      },
      {
        title: "Shared Rescue Workforce",
        description:
          "Pool volunteers, handlers, and transport vans to support understaffed shelters and speed up street rescues.",
      },
      {
        title: "Unified Adoption Hub",
        description:
          "Combine adoptable pets from all partner NGOs into one city-wide adoption network with 30-day family transition support.",
      },
    ],
    ctaLabel: "Sponsor a Partner Recovery Bed (₹500/mo)",
    ctaHref: "/donate?stage=stage-1",
    charterHref: "/about#obj-6",
    charterLabel: "Explore Collaborative Logistics & Digital Registry",
    accentTheme: "active",
  },
  {
    id: "stage-2",
    stageNumber: "02",
    shortLabel: "02 Vet & ABC Care",
    statusBadge: "STAGE 02 · MEDICAL & FIELD EXPANSION",
    title: "Vet Triage, Emergency Dispatch & ABC Drives",
    tagline:
      "24/7 trauma triage, partnered vet clinics, and mass sterilization camps.",
    description:
      "With our shelter network connected, Stage 2 plugs veterinary hospitals and mobile surgical units directly into our dispatch grid. We cut down critical response times for road-accident victims and run large-scale sterilization and anti-rabies drives to humanely stabilize street populations.",
    milestones: [
      {
        title: "Zonal Vet Clinic Grid",
        description:
          "Partner with veterinary clinics across key city zones for priority emergency triage and subsidized surgeries.",
      },
      {
        title: "Rapid Emergency Dispatch",
        description:
          "Launch a coordinated ambulance and rescue-van relay for road trauma, severe illness, and monsoon flood evacuations.",
      },
      {
        title: "Mass ABC & Anti-Rabies Camps",
        description:
          "Execute ward-by-ward Animal Birth Control (ABC) sterilizations and anti-rabies vaccination drives.",
      },
      {
        title: "Civic & Legal Defense Desk",
        description:
          "Back community feeders and citizens with lawful guidance against animal cruelty and unlawful harassment.",
      },
    ],
    ctaLabel: "Fund Emergency Vet Triage & ABC (₹1,500)",
    ctaHref: "/donate?stage=stage-2",
    charterHref: "/about#obj-7",
    charterLabel: "Explore ABC, Emergency & Legal Aid Objectives",
    accentTheme: "medical",
  },
  {
    id: "stage-3",
    stageNumber: "03",
    shortLabel: "03 Flagship Sanctuary",
    statusBadge: "STAGE 03 · CAPITAL BUILD (SANCTUARY FUND)",
    title: "NPIA’s Flagship Sanctuary & Rehab Center",
    tagline:
      "When partner beds fill up, we build our own permanent sanctuary.",
    description:
      "Partner beds can only handle so much overflow. Stage 3 establishes NPIA’s first dedicated, permanent animal sanctuary—purpose-built for critical trauma recovery, long-term sanctuary care, post-op ABC wards, and safe urban wildlife rehabilitation.",
    milestones: [
      {
        title: "Land & Statutory Clearances",
        description:
          "Secure a dedicated sanctuary plot with full statutory and environmental compliance.",
      },
      {
        title: "Quarantine & Triage Wing",
        description:
          "Construct an on-site veterinary treatment room, infectious-disease isolation ward, and 50-bed post-op recovery block.",
      },
      {
        title: "Sanctuary Kennels & Wildlife Zone",
        description:
          "Build open-run rehabilitation yards for permanent special-needs residents alongside a temporary holding zone for authority-coordinated urban wildlife release.",
      },
      {
        title: "Regional Hub Operations",
        description:
          "Open the sanctuary doors as the central nerve center supporting all allied NGOs in our network.",
      },
    ],
    ctaLabel: "Contribute to the Sanctuary Build Fund",
    ctaHref: "/donate?stage=stage-3",
    charterHref: "/about#obj-1",
    charterLabel: "Explore Rescue, Rehabilitation & Wildlife Objectives",
    accentTheme: "capital",
  },
  {
    id: "stage-4",
    stageNumber: "04",
    shortLabel: "04 Canine Academy",
    statusBadge: "STAGE 04 · THE ACADEMY VISION",
    title: "The Canine Academy — Therapy, Guide & Service Dogs",
    tagline:
      "Rescued street dogs trained to heal, guide, and assist humans.",
    description:
      "Once our sanctuary is operational, NPIA unlocks its most transformative vision: The Canine Academy. We temperament-test and train suitable rescued dogs to move beyond survival—graduating them as certified emotional support companions, medical-alert aids, and guide dogs for people with disabilities.",
    milestones: [
      {
        title: "Academy Training Grounds",
        description:
          "Build a specialized sensory-desensitization and obedience training paddock inside the NPIA Sanctuary.",
      },
      {
        title: "3-Track Curriculum",
        description:
          "Launch certified training tracks for (1) Basic Manners & Confidence, (2) Hospital/School Therapy & Emotional Support, and (3) Disability & Guide Assistance.",
      },
      {
        title: "Pilot Cohort Graduation",
        description:
          "Screen and graduate our first cohort of rescued street dogs into working and therapy roles.",
      },
      {
        title: "1:1 Handler Matching",
        description:
          "Partner with healthcare centers and disability organizations to pair graduated dogs with recipients, complete with lifelong adjustment support.",
      },
    ],
    ctaLabel: "Pledge Toward the Canine Academy",
    ctaHref: "/donate?stage=stage-4",
    charterHref: "/about#obj-2",
    charterLabel: "Explore Training & Placement Objectives",
    accentTheme: "academy",
  },
];
