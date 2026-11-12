import type { Metadata } from "next";
import { CHARTER_AIMS } from "@/lib/charterData";
import { CORE_VALUES, FOUNDING_SEATS } from "@/lib/aboutData";
import { ROADMAP_STAGES } from "@/lib/roadmapData";

export const SITE_URL = "https://npia.org.in";
export const SITE_NAME = "Nirvana Paws Initiative & Academy";
export const SITE_SHORT_NAME = "NPIA.";
export const CONTACT_EMAIL = "hello@npia.org.in";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = "/Puppies_resting_at_animal_shelter_296b8c41.jpg";

export const GLOBAL_KEYWORDS = [
  "Nirvana Paws Initiative & Academy",
  "NPIA",
  "street dog rescue India",
  "animal sanctuary India",
  "allied animal shelter network",
  "ABC Animal Birth Control India",
  "anti-rabies vaccination drive",
  "street dog rehabilitation",
  "Canine Academy India",
  "therapy and service dog training",
  "INSPIRE canine program",
  "adopt street puppies India",
  "emergency veterinary triage",
  "donate for street dogs India",
];

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  imageAlt = "Rescued puppies resting safely in an NPIA partner sanctuary ward",
  type = "website",
}: PageMetadataInput): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const ogImageUrl = absoluteUrl(image);
  const mergedKeywords = Array.from(new Set([...keywords, ...GLOBAL_KEYWORDS]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        en: canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      type,
      locale: "en_IN",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 675,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getGlobalGraphJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "Organization"],
        "@id": ORG_ID,
        name: SITE_NAME,
        legalName: SITE_NAME,
        alternateName: ["NPIA", "NPIA.", "N.P.I.A", "Nirvana Paws"],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/npia-md.png`,
        },
        image: [
          `${SITE_URL}/Puppies_resting_at_animal_shelter_296b8c41.jpg`,
          `${SITE_URL}/about/pillar-network.jpg`,
          `${SITE_URL}/about/mission-rescue.jpg`,
          `${SITE_URL}/about/pillar-academy.jpg`,
        ],
        description:
          "Nirvana Paws Initiative & Academy (NPIA) unites allied animal shelters, veterinary clinics, rescuers, and community volunteers across India to save street animals today while building a permanent flagship sanctuary and Canine Academy.",
        email: CONTACT_EMAIL,
        foundingDate: "2026",
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        knowsAbout: [
          "Street Dog Rescue & Trauma Rehabilitation",
          "Collaborative Shelter Bed & Logistics Network",
          "Animal Birth Control (ABC) & Anti-Rabies Vaccination",
          "Emergency Veterinary Triage & Dispatch",
          "Urban Wildlife Rescue & Authority Coordination",
          "Service, Guide & Therapy Dog Training (INSPIRE)",
          "Humane Education & Community Advocacy",
        ],
        member: FOUNDING_SEATS.map((seat) => ({
          "@type": "Person",
          name: seat.name,
          jobTitle: seat.role,
          description: seat.focus,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: CONTACT_EMAIL,
            url: `${SITE_URL}/contact-us`,
            areaServed: "IN",
            availableLanguage: [
              "English",
              "Hindi",
              "Telugu",
              "Tamil",
              "Kannada",
              "Malayalam",
              "Bengali",
              "Marathi",
            ],
          },
          {
            "@type": "ContactPoint",
            contactType: "partner outreach",
            email: CONTACT_EMAIL,
            url: `${SITE_URL}/contact-us?type=partner`,
            areaServed: "IN",
          },
        ],
        publishingPrinciples: `${SITE_URL}/about#charter`,
        ethicsPolicy: `${SITE_URL}/about#ethics`,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: "NPIA",
        url: SITE_URL,
        inLanguage: "en-IN",
        publisher: {
          "@id": ORG_ID,
        },
        potentialAction: [
          {
            "@type": "DonateAction",
            name: "Fund NPIA Rescue & Sanctuary Programs",
            target: `${SITE_URL}/donate`,
            recipient: { "@id": ORG_ID },
          },
          {
            "@type": "CommunicateAction",
            name: "Contact or Partner with NPIA",
            target: `${SITE_URL}/contact-us`,
          },
        ],
      },
    ],
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebPageJsonLd(params: {
  path: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  primaryImage?: string;
  speakableSelectors?: string[];
}): Record<string, unknown> {
  const url = absoluteUrl(params.path);
  return {
    "@context": "https://schema.org",
    "@type": params.pageType ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: params.name,
    description: params.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(params.primaryImage ?? DEFAULT_OG_IMAGE),
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: params.speakableSelectors ?? ["h1", "h2", "main p"],
    },
  };
}

export function getHomeSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/",
        name: "NPIA — Connected Rescue Network & Sanctuary | Nirvana Paws Initiative & Academy",
        description:
          "Uniting shelters, veterinary clinics, and volunteers in India to save street animals today while building NPIA's flagship sanctuary and Canine Academy.",
        primaryImage: "/hero/street-clear.jpg",
        speakableSelectors: [".hero h1", ".hero-tagline", ".sec3-heading", ".sec4-headline"],
      }),
      buildBreadcrumbJsonLd([{ name: "Home", path: "/" }]),
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#roadmap-summary`,
        name: "NPIA 4-Stage Rescue & Sanctuary Rollout",
        numberOfItems: ROADMAP_STAGES.length,
        itemListElement: ROADMAP_STAGES.map((stage, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `Stage ${stage.stageNumber}: ${stage.title}`,
          description: stage.description,
          url: `${SITE_URL}${stage.ctaHref}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Nirvana Paws Initiative & Academy (NPIA)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nirvana Paws Initiative & Academy (NPIA) is an Indian animal welfare organization uniting existing animal shelters, veterinary clinics, rescuers, and community volunteers to save street animals today while building a dedicated flagship sanctuary and Canine Academy.",
            },
          },
          {
            "@type": "Question",
            name: "How does NPIA help street dogs before its own sanctuary building opens?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Through Stage 1 (The Connected Shelter & Workforce Grid) and Stage 2 (Vet Triage & ABC Drives), NPIA partners with 10+ local shelters and clinics to unlock open recovery beds, coordinate volunteer rescue vans, run Animal Birth Control (ABC) and anti-rabies drives, and support city-wide adoptions immediately.",
            },
          },
          {
            "@type": "Question",
            name: "What are NPIA's four stages of impact?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Stage 01 connects allied shelters and rescue workforce; Stage 02 expands 24/7 veterinary triage, emergency dispatch, and ABC camps; Stage 03 builds NPIA's permanent Flagship Sanctuary & Rehab Center; and Stage 04 launches The Canine Academy to train suitable rescued street dogs as therapy, emotional-support, guide, and service dogs.",
            },
          },
          {
            "@type": "Question",
            name: "What does the NPIA INSPIRE Canine Academy program do?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "NPIA's INSPIRE program (Initiative Nurturing Stray Puppies Into Responsible Environments) assesses temperament and trains rescued street dogs across obedience, social confidence, hospital/school therapy support, and disability-assistance roles before careful family or handler placement.",
            },
          },
          {
            "@type": "Question",
            name: "How can shelters, veterinarians, volunteers, or donors support NPIA?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Organizations and individuals can join the Allied Partner Network at npia.org.in/partner-network, pledge monthly or one-off support from ₹500 to ₹5,000+ at npia.org.in/donate, or write directly via npia.org.in/contact-us or hello@npia.org.in.",
            },
          },
        ],
      },
    ],
  };
}

export function getAboutSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/about",
        pageType: "AboutPage",
        name: "About NPIA | Our Story, Vision & Founding Charter",
        description:
          "Discover Nirvana Paws Initiative & Academy (NPIA): our story, core values, founding leadership, 4-stage rollout, and complete 7-aim Founding Charter.",
        primaryImage: "/about/pillar-network.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
      ]),
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/about#charter-aims`,
        name: "NPIA Seven Core Founding Aims",
        description: "The seven founding aims guiding NPIA's Founding Charter.",
        numberOfItems: CHARTER_AIMS.length,
        itemListElement: CHARTER_AIMS.map((aim) => ({
          "@type": "ListItem",
          position: aim.number,
          name: aim.title,
          description: aim.description,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/about#values`,
        name: "NPIA Core Animal-First Values",
        numberOfItems: CORE_VALUES.length,
        itemListElement: CORE_VALUES.map((val, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: val.title,
          description: val.description,
        })),
      },
    ],
  };
}

export function getProgramsSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/our-programs",
        name: "Our Programs — INSPIRE Rescue, Rehab & Canine Academy | NPIA",
        description:
          "Explore NPIA's INSPIRE framework: street puppy rescue, veterinary nutrition and sanctuary care, positive behavioral rehabilitation, therapy & service training, and lifelong placement.",
        primaryImage: "/Handler_training_dog_outdoors_a386a55b.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Our Programs", path: "/our-programs" },
      ]),
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${SITE_URL}/our-programs#inspire`,
        name: "INSPIRE — Initiative Nurturing Stray Puppies Into Responsible Environments",
        description:
          "Comprehensive street animal rescue, recovery, obedience, therapy, guide, and responsible adoption placement framework operated by Nirvana Paws Initiative & Academy.",
        provider: { "@id": ORG_ID },
        programType: "Animal Rescue, Rehabilitation & Canine Training",
        offers: [
          {
            "@type": "Offer",
            name: "Street Rescue & Emergency Medical Triage",
            category: "Animal Welfare Service",
            url: `${SITE_URL}/contact-us`,
          },
          {
            "@type": "Offer",
            name: "Sanctuary Care & Socialization",
            category: "Animal Rehabilitation",
            url: `${SITE_URL}/our-programs`,
          },
          {
            "@type": "Offer",
            name: "Obedience, Therapy & Disability Service Dog Training",
            category: "Canine Academy",
            url: `${SITE_URL}/roadmap#stage-4`,
          },
          {
            "@type": "Offer",
            name: "Responsible Home Placement & 30-Day Support",
            category: "Pet Adoption",
            url: `${SITE_URL}/contact-us`,
          },
        ],
      },
    ],
  };
}

export function getPartnerNetworkSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/partner-network",
        pageType: "CollectionPage",
        name: "Partner Network | NPIA — Connected Shelters, Clinics & Rescuers",
        description:
          "Uniting allied shelters, veterinary hospitals, foster homes, and institutional sponsors across India on NPIA's shared rescue & recovery grid.",
        primaryImage: "/about/pillar-network.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Partner Network", path: "/partner-network" },
      ]),
      {
        "@type": "Service",
        "@id": `${SITE_URL}/partner-network#service`,
        name: "NPIA Allied Partner Shelter & Veterinary Logistics Grid",
        provider: { "@id": ORG_ID },
        serviceType: "Animal Rescue Logistics & Veterinary Coordination",
        areaServed: { "@type": "Country", name: "India" },
        description:
          "Shared recovery bed registry, emergency trauma triage dispatch, ABC surgical support, and joint adoption network for allied animal welfare groups and veterinarians.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Partner Collaboration Tracks",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Allied Animal Shelters & NGOs",
                description:
                  "Shared quarantine beds, pooled volunteer teams, and digital health registry integration.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Veterinary Clinics & Mobile Surgical Units",
                description:
                  "24/7 emergency road-trauma stabilization, post-op recovery coordination, and ABC drives.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Allied Individuals, Fosters & Institutional Sponsors",
                description:
                  "Volunteer rescue transport, 30-day foster transitions, and CSR / sanctuary capital backing.",
              },
            },
          ],
        },
      },
    ],
  };
}

export function getRoadmapSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/roadmap",
        name: "The Sanctuary Roadmap | 4 Stages of Impact — NPIA",
        description:
          "Explore NPIA's 4-stage rollout from allied shelter space-sharing and 24/7 vet triage to our permanent Flagship Sanctuary and The Canine Academy.",
        primaryImage: "/Puppies_resting_at_animal_shelter_60e4af22.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "4-Stage Roadmap", path: "/roadmap" },
      ]),
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/roadmap#stages`,
        name: "NPIA Four-Stage Sanctuary Rollout",
        numberOfItems: ROADMAP_STAGES.length,
        itemListElement: ROADMAP_STAGES.map((stage, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${stage.statusBadge} — ${stage.title}`,
          description: `${stage.tagline} ${stage.description}`,
          url: `${SITE_URL}/roadmap#${stage.id}`,
        })),
      },
    ],
  };
}

export function getDonateSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/donate",
        name: "Donate | NPIA — Support Street Animal Rescue & Sanctuary",
        description:
          "Fund shared recovery shelter beds (₹500+), emergency vet triage and ABC sterilization drives (₹1,500+), or NPIA's flagship sanctuary campus (₹5,000+).",
        primaryImage: "/about/pillar-network.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Donate", path: "/donate" },
      ]),
      {
        "@type": "DonateAction",
        "@id": `${SITE_URL}/donate#action`,
        name: "Donate to Nirvana Paws Initiative & Academy (NPIA)",
        description:
          "Monthly or one-off contributions in INR toward NPIA Shelter Recovery Beds (Stage 1), Emergency Vet Care & Post-Op Nursing (Stage 2), and Flagship Sanctuary Capital Build (Stages 3 & 4).",
        recipient: { "@id": ORG_ID },
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/donate`,
          inLanguage: "en-IN",
        },
        priceSpecification: [
          {
            "@type": "PriceSpecification",
            name: "Recovery Bed & Partner Shelter Grant",
            price: 500,
            priceCurrency: "INR",
          },
          {
            "@type": "PriceSpecification",
            name: "Emergency Vet Triage & ABC Drive Sponsorship",
            price: 1500,
            priceCurrency: "INR",
          },
          {
            "@type": "PriceSpecification",
            name: "Sanctuary Build & Trauma Ward Backing",
            price: 5000,
            priceCurrency: "INR",
          },
        ],
      },
    ],
  };
}

export function getContactSchemaGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: "/contact-us",
        pageType: "ContactPage",
        name: "Contact & Partner Desk | NPIA",
        description:
          "Reach Nirvana Paws Initiative & Academy (NPIA) for shelter partnerships, veterinary clinic alliances, volunteering, street dog adoption, fostering, or sanctuary donations.",
        primaryImage: "/about/pillar-network.jpg",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact Us", path: "/contact-us" },
      ]),
    ],
  };
}

export function getLegalSchemaGraph(params: {
  path: string;
  title: string;
  description: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: params.path,
        name: params.title,
        description: params.description,
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: params.title, path: params.path },
      ]),
    ],
  };
}
