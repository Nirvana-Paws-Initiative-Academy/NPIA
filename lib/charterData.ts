export interface CharterAim {
  number: number;
  title: string;
  description: string;
}

export interface CharterSubItem {
  code: string;
  text: string;
}

export interface CharterObjective {
  id: string;
  number: number;
  title: string;
  summary: string;
  items: CharterSubItem[];
}

export interface EthicalCommitment {
  number: string;
  title: string;
  statement: string;
}

export const INITIATIVE_IDENTITY = {
  fullName: "Nirvana Paws Initiative & Academy (NPIA)",
  eyebrow: "Our Founding Charter",
};

export const CHARTER_AIMS: CharterAim[] = [
  { number: 1, title: "Rescue", description: "Save stray animals from harm." },
  {
    number: 2,
    title: "Care",
    description: "Provide for their needs — food, shelter, and medical care.",
  },
  { number: 3, title: "Train", description: "Teach them skills for a better life." },
  {
    number: 4,
    title: "Place",
    description: "Find them loving homes or jobs helping people.",
  },
  {
    number: 5,
    title: "Educate",
    description: "Teach people how to care for animals responsibly.",
  },
  {
    number: 6,
    title: "Advocate",
    description: "Speak up for animals and promote good laws for them.",
  },
  {
    number: 7,
    title: "Collaborate",
    description:
      "Build a logistics network to connect, support, and share resources with allied animal welfare groups and rescues.",
  },
];

export const CHARTER_OBJECTIVES: CharterObjective[] = [
  {
    id: "obj-1",
    number: 1,
    title: "Rescue and Rehabilitation",
    summary:
      "Emergency street rescue, veterinary treatment, safe sanctuary shelter, nutrition, and gentle confidence building.",
    items: [
      { code: "1.1", text: "We rescue animals from danger." },
      { code: "1.2", text: "We give them health checks and treatment." },
      { code: "1.3", text: "We provide safe shelter and nutritious food." },
      { code: "1.4", text: "We help them become friendly and confident." },
    ],
  },
  {
    id: "obj-2",
    number: 2,
    title: "Training and Placement",
    summary:
      "Positive obedience, disability & comfort assistance training, careful home matching, and post-adoption family transition support.",
    items: [
      { code: "2.1", text: "We teach animals good manners and basic skills." },
      {
        code: "2.2",
        text: "We train suitable animals to help people with disabilities.",
      },
      {
        code: "2.3",
        text: "We train suitable animals to provide comfort and support.",
      },
      {
        code: "2.4",
        text: "We carefully match animals with loving homes or important jobs.",
      },
      {
        code: "2.5",
        text: "We help families and their new pets adjust to their new lives together.",
      },
    ],
  },
  {
    id: "obj-3",
    number: 3,
    title: "Community Engagement and Education",
    summary:
      "School empathy workshops, responsible pet care guidance, adoption advocacy, and community volunteering.",
    items: [
      {
        code: "3.1",
        text: "We teach people how to care for their pets responsibly.",
      },
      {
        code: "3.2",
        text: "We encourage people to adopt animals instead of buying them.",
      },
      {
        code: "3.3",
        text: "We work with schools and communities to teach kindness to animals.",
      },
      {
        code: "3.4",
        text: "We create opportunities for people to volunteer and help animals.",
      },
    ],
  },
  {
    id: "obj-4",
    number: 4,
    title: "Sustainable Growth and Impact",
    summary:
      "Transparent fundraising, strategic welfare partnerships, and continual improvement of rescue and rehabilitation programs.",
    items: [
      {
        code: "4.1",
        text: "Raise funds to support our work and build partnerships.",
      },
      {
        code: "4.2",
        text: "Continuously improve our programs and services.",
      },
    ],
  },
  {
    id: "obj-5",
    number: 5,
    title: "Ethical Stewardship and Accountability",
    summary:
      "Strict adherence to animal protection laws, accountable stewardship of donated resources, and community feedback.",
    items: [
      { code: "5.1", text: "Act with honesty and integrity." },
      { code: "5.2", text: "Follow all laws and rules that protect animals." },
      { code: "5.3", text: "We are responsible for how we use our resources." },
      {
        code: "5.4",
        text: "We listen to feedback and make our organization better.",
      },
    ],
  },
  {
    id: "obj-6",
    number: 6,
    title: "Collaborative Logistics & Networking",
    summary:
      "Shared overflow kennels, coordinated veterinary care & rescue transport, allied partner onboarding, and capacity building.",
    items: [
      {
        code: "6.1",
        text: "Act as a central logistics hub to connect local animal welfare groups, shelters, and rescuers.",
      },
      {
        code: "6.2",
        text: "Facilitate resource sharing among partner organizations, including shelter space, medical care, and transportation.",
      },
      {
        code: "6.3",
        text: "Connect and integrate allied organizations under our network to streamline cross-organization adoptions and maximize placement opportunities.",
      },
      {
        code: "6.4",
        text: "Provide operational support and capacity-building assistance to partner entities to improve overall animal welfare infrastructure.",
      },
    ],
  },
  {
    id: "obj-7",
    number: 7,
    title: "Animal Health & Population Management",
    summary:
      "Humane ward-level Animal Birth Control (ABC) sterilisation and anti-rabies vaccination drives.",
    items: [
      {
        code: "7.1",
        text: "Organize and execute large-scale Animal Birth Control (ABC) and anti-rabies vaccination drives.",
      },
    ],
  },
  {
    id: "obj-8",
    number: 8,
    title: "Emergency & Disaster Response",
    summary:
      "Rapid coordination center for trauma rescue, emergency transport, and medical triaging during floods or disasters.",
    items: [
      {
        code: "8.1",
        text: "Serve as a coordinating center for the rapid rescue, transport, and medical triaging of animals displaced by natural disasters or emergencies.",
      },
    ],
  },
  {
    id: "obj-9",
    number: 9,
    title: "Technology & Welfare Coordination",
    summary:
      "Centralized digital log tracking available shelter beds, vaccinations, adoptions, and shared partner capacity.",
    items: [
      {
        code: "9.1",
        text: "Develop and maintain shared digital records for shelter space tracking, adoptions, and animal welfare coordination.",
      },
    ],
  },
  {
    id: "obj-10",
    number: 10,
    title: "Wildlife Rescue & Rehabilitation",
    summary:
      "Coordination with forest and wildlife authorities for safe capture, veterinary treatment, and natural release of urban wildlife.",
    items: [
      {
        code: "10.1",
        text: "Coordinate with relevant authorities to assist in the safe capture, treatment, and release of urban wildlife and non-domesticated species.",
      },
    ],
  },
  {
    id: "obj-11",
    number: 11,
    title: "Legal Advocacy & Animal Rights",
    summary:
      "Dedicated legal support network to guide citizens, pursue lawful remedies, and counter systemic cruelty against animals.",
    items: [
      {
        code: "11.1",
        text: "Maintain a legal support network to provide guidance, pursue lawful remedies, and fight systemic animal cruelty.",
      },
    ],
  },
];

export const ETHICAL_COMMITMENTS: EthicalCommitment[] = [
  {
    number: "01",
    title: "Honesty & Integrity First",
    statement:
      "We act with honesty and transparency in every rescue, medical update, and community appeal.",
  },
  {
    number: "02",
    title: "Animal Welfare & Protection Laws",
    statement:
      "All field work, ABC drives, wildlife releases, and cruelty advocacy strictly follow animal protection laws.",
  },
  {
    number: "03",
    title: "Responsible Resource Stewardship",
    statement:
      "Every rupee and donated supply is directed toward field rescue care, veterinary treatment, and permanent sanctuary construction.",
  },
  {
    number: "04",
    title: "Openness & Continuous Improvement",
    statement:
      "We welcome feedback from rescuers, adopters, and donors so our programs continually serve street animals better.",
  },
];
