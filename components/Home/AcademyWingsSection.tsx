"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import "./AcademyWingsSection.css";

interface WingStat {
  value: string;
  label: string;
}

interface AcademyWing {
  id: string;
  variantClass: string;
  title: string;
  outcome: string;
  charterHref: string;
  charterSummary: string;
  stats: [WingStat, WingStat];
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
  monogram: React.ReactNode;
}

const HEADLINE_LINES: Array<Array<{ text: string; brand?: boolean }>> = [
  [
    { text: "Beyond" },
    { text: "rescue:" },
    { text: "how" },
    { text: "NPIA", brand: true },
    { text: "trains," },
  ],
  [{ text: "educates," }, { text: "and" }, { text: "protects" }],
];

const WINGS: AcademyWing[] = [
  {
    id: "canine-academy",
    variantClass: "sec4-card--forest",
    title: "Canine Academy",
    outcome: "Rehabilitating rescues into therapy, guide & service companions",
    charterHref: "/about#obj-2",
    charterSummary:
      "Teaches manners, disability aid & comfort roles, followed by carefully matched home placements.",
    stats: [
      { value: "3 Tracks", label: "Manners, therapy & disability aid" },
      { value: "1 : 1 Match", label: "Family placement & transition care" },
    ],
    imageSrc: "/programs/canine-academy.jpg",
    imageAlt:
      "NPIA trainer guiding an attentive rescued Indian street dog during positive-reinforcement training",
    objectPosition: "50% 42%",
    monogram: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sec4-monogram"
        aria-hidden="true"
      >
        <path d="M12 13.5c-2.2 0-4 1.6-4 3.6 0 1.4 1.1 2.4 2.5 2.4.7 0 1-.2 1.5-.2s.8.2 1.5.2c1.4 0 2.5-1 2.5-2.4 0-2-1.8-3.6-4-3.6Z" />
        <circle cx="7.2" cy="10.2" r="1.4" />
        <circle cx="10.2" cy="7.2" r="1.4" />
        <circle cx="13.8" cy="7.2" r="1.4" />
        <circle cx="16.8" cy="10.2" r="1.4" />
      </svg>
    ),
  },
  {
    id: "community-schools",
    variantClass: "sec4-card--meadow",
    title: "Community & Schools",
    outcome: "Teaching kindness & adoption city-wide",
    charterHref: "/about#obj-3",
    charterSummary:
      "Runs open school workshops, responsible pet-care talks, adopt-over-buy advocacy, and local volunteering.",
    stats: [
      { value: "4 Pillars", label: "Schools, care, adopt & volunteer" },
      { value: "Free Drives", label: "School talks, care & adoption camps" },
    ],
    imageSrc: "/programs/community-schools.jpg",
    imageAlt:
      "School students and an NPIA volunteer feeding and petting calm community dogs in a sunlit courtyard",
    objectPosition: "50% 55%",
    monogram: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sec4-monogram"
        aria-hidden="true"
      >
        <path d="M2 5.5c2.8 0 5.4.8 7.5 2.2v11.8c-2.1-1.3-4.7-2-7.5-2V5.5Z" />
        <path d="M22 5.5c-2.8 0-5.4.8-7.5 2.2v11.8c2.1-1.3 4.7-2 7.5-2V5.5Z" />
        <path d="M12 7.7v11.8" />
      </svg>
    ),
  },
  {
    id: "wildlife-legal",
    variantClass: "sec4-card--moss",
    title: "Wildlife & Legal Aid",
    outcome: "Safe wild release & cruelty defense",
    charterHref: "/about#obj-10",
    charterSummary:
      "Coordinates urban wildlife care with authorities and backs citizens with lawful defense against cruelty.",
    stats: [
      { value: "Wild Care", label: "Authority-linked urban wildlife care" },
      { value: "Legal Aid", label: "Lawful citizen cruelty defense" },
    ],
    imageSrc: "/programs/wildlife-legal.jpg",
    imageAlt:
      "Wildlife caregiver opening a woven carrier to release a rehabilitated Indian parakeet into lush canopy",
    objectPosition: "50% 48%",
    monogram: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sec4-monogram"
        aria-hidden="true"
      >
        <path d="M12 3.5 5 6.5v5.3c0 4.4 2.9 8.2 7 9.7 4.1-1.5 7-5.3 7-9.7V6.5l-7-3Z" />
        <path d="M9.5 13c1.8 0 3.7-1.1 4.5-3.3-2.4-.3-4.3.7-4.8 2.8" />
        <path d="M9.2 14.5c1-.8 2.3-1.4 3.8-1.6" />
      </svg>
    ),
  },
];

export default function AcademyWingsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  let wordCounter = 0;

  return (
    <section
      ref={sectionRef}
      id="academy-wings"
      aria-label="NPIA Academy, Community Education, Urban Wildlife & Legal Advocacy"
      className={`sec4-shell ${visible ? "sec4-visible" : ""}`}
    >
      <div className="sec4-inner">
        <h2 className="sec4-headline">
          {HEADLINE_LINES.map((line, lineIdx) => (
            <span key={lineIdx} className="sec4-headline-line">
              {line.map((w) => {
                const idx = wordCounter++;
                return (
                  <span key={`${lineIdx}-${idx}`} className="sec4-word-clip">
                    <span
                      className={`sec4-word ${w.brand ? "is-brand" : ""}`}
                      style={{ transitionDelay: `${idx * 45}ms` }}
                    >
                      {w.text}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h2>

        <p className="sec4-lead">
          Nirvana Paws Initiative &amp; Academy goes further than emergency
          street triage—training rescued dogs for loving roles, guiding schools,
          and standing up for urban wildlife.
        </p>

        <div className="sec4-rule" aria-hidden="true" />

        <div className="sec4-cards-grid">
          {WINGS.map((wing, idx) => (
            <article
              key={wing.id}
              className={`sec4-card ${wing.variantClass}`}
              style={{ transitionDelay: `${420 + idx * 120}ms` }}
            >
              <div>
                <div className="sec4-card-head">
                  <div>
                    <h3 className="sec4-card-title">{wing.title}</h3>
                    <p className="sec4-card-outcome">{wing.outcome}</p>
                  </div>
                  <div className="sec4-head-actions">
                    <div className="sec4-info-wrap">
                      <Link
                        href={wing.charterHref}
                        className="sec4-info-btn"
                        aria-label={`${wing.title}: ${wing.charterSummary} View Founding Charter`}
                      >
                        <Info size={12} strokeWidth={2} aria-hidden="true" />
                      </Link>
                      <div className="sec4-info-popover" role="tooltip">
                        <p className="sec4-info-text">{wing.charterSummary}</p>
                        <span className="sec4-info-link">Read in Founding Charter &rarr;</span>
                      </div>
                    </div>
                    {wing.monogram}
                  </div>
                </div>

                <div className="sec4-stats">
                  <div>
                    <p className="sec4-stat-val">{wing.stats[0].value}</p>
                    <p className="sec4-stat-label">{wing.stats[0].label}</p>
                  </div>
                  <div className="sec4-stat-divider" aria-hidden="true" />
                  <div>
                    <p className="sec4-stat-val">{wing.stats[1].value}</p>
                    <p className="sec4-stat-label">{wing.stats[1].label}</p>
                  </div>
                </div>
              </div>

              <div className="sec4-photo-stack">
                <div className="sec4-paper sec4-paper--back" aria-hidden="true" />
                <div className="sec4-paper sec4-paper--mid" aria-hidden="true" />
                <div className="sec4-photo-frame">
                  <Image
                    src={wing.imageSrc}
                    alt={wing.imageAlt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1023px) 46vw, 420px"
                    className="sec4-photo"
                    style={{ objectPosition: wing.objectPosition }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="sec4-cta-wrap" data-aos="fade-up">
          <Link href="/our-programs" className="sec4-cta-btn">
            Explore Our Programs
          </Link>
          <Link href="/about#charter" className="sec4-charter-link">
            Read Founding Charter &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
