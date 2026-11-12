"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  Database,
  HeartHandshake,
  Info,
  ShieldCheck,
  Stethoscope,
  Truck,
} from "lucide-react";
import "./PartnerHubSection.css";

interface HubCapability {
  id: string;
  name: string;
  scope: string;
  detail: string;
  charterHref: string;
  tileBg: string;
  icon: React.ReactNode;
}

interface HubSpotlight {
  quote: string;
  title: string;
  subtitle: string;
}

const CAPABILITIES: HubCapability[] = [
  {
    id: "shared-beds",
    name: "Shared Beds",
    scope: "Overflow kennels",
    detail:
      "Allied shelters share open recovery beds and shelter capacity when wards fill up.",
    charterHref: "/about#obj-6",
    tileBg: "#20513A",
    icon: <BedDouble size={20} strokeWidth={2} />,
  },
  {
    id: "rescue-dispatch",
    name: "Rapid Dispatch",
    scope: "Emergency rescue vans",
    detail:
      "Coordinated street rescue, transport, and urgent medical triage during accidents or floods.",
    charterHref: "/about#obj-8",
    tileBg: "#152916",
    icon: <Truck size={20} strokeWidth={2} />,
  },
  {
    id: "vet-abc",
    name: "Vet & ABC Care",
    scope: "ABC & vet drives",
    detail:
      "Joint sterilisation (ABC) and anti-rabies vaccination drives across partner veterinary hubs.",
    charterHref: "/about#obj-7",
    tileBg: "#3A6B4C",
    icon: <Stethoscope size={20} strokeWidth={2} />,
  },
  {
    id: "cross-adoption",
    name: "Cross Adoptions",
    scope: "Home placements",
    detail:
      "Integrated listings across allied NGOs and rescues to help animals reach safe forever homes faster.",
    charterHref: "/about#obj-6",
    tileBg: "#6E5436",
    icon: <HeartHandshake size={20} strokeWidth={2} />,
  },
  {
    id: "digital-registry",
    name: "Digital Registry",
    scope: "Live bed & health log",
    detail:
      "Centralized digital records tracking open kennel space, vaccinations, treatments, and placements.",
    charterHref: "/about#obj-9",
    tileBg: "#173B2B",
    icon: <Database size={20} strokeWidth={2} />,
  },
  {
    id: "infra-support",
    name: "Partner Support",
    scope: "Shared infrastructure",
    detail:
      "Operational guidance and capacity-building support for smaller community rescue shelters.",
    charterHref: "/about#obj-6",
    tileBg: "#2D5D4F",
    icon: <ShieldCheck size={20} strokeWidth={2} />,
  },
];

const SPOTLIGHTS: HubSpotlight[] = [
  {
    quote:
      "One shared hub routes post-op recovery beds, vet slots, and rescue vans across partners before critical cases lose time.",
    title: "Shared Recovery & Transport",
    subtitle: "Allied Shelters & Clinics · Joint Operations",
  },
  {
    quote:
      "When road trauma or floods strike a ward, central dispatch links field rescuers to open veterinary beds right away.",
    title: "Emergency Triage Network",
    subtitle: "Coordinated Rescue Grid · 24/7 Dispatch",
  },
  {
    quote:
      "Connecting local rescues on one welfare network turns isolated fosters into city-wide adoptions and coordinated care.",
    title: "Unified Adoption Grid",
    subtitle: "Shared Welfare Network · City-Wide Care",
  },
];

const FROSTED_TILES = [
  { col: 2, row: 0 },
  { col: 3, row: 1 },
  { col: 0, row: 2 },
  { col: 2, row: 2 },
  { col: 1, row: 3 },
  { col: 3, row: 3 },
];

export default function PartnerHubSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [inView, setInView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([
    "shared-beds",
    "vet-abc",
    "digital-registry",
  ]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleCapability = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const stepSlide = (delta: number) => {
    setSlideIdx((prev) => (prev + delta + SPOTLIGHTS.length) % SPOTLIGHTS.length);
  };

  const partnerHref = useMemo(() => {
    if (selected.length === 0) return "/contact-us?type=partner";
    return `/contact-us?type=partner&roles=${encodeURIComponent(selected.join(","))}`;
  }, [selected]);

  const activeSpotlight = SPOTLIGHTS[slideIdx];

  return (
    <section
      ref={sectionRef}
      id="partner-hub"
      aria-label="NPIA Collaborative Logistics & Partner Network Hub"
      className={`sec3-shell ${inView ? "sec3-visible" : ""}`}
    >
      {/* Left Framed Botanical Sanctuary Card */}
      <div className="sec3-media-card" data-aos="fade-up">
        <Image
          src="/Veterinarian_tending_to_dog_51eefdfd.jpg"
          alt="NPIA caretaker tending to a street dog at the sanctuary veranda"
          fill
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="sec3-media-layer"
        />

        <video
          ref={videoRef}
          src="/partner-hub/caretaker-loop.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          className={`sec3-media-layer sec3-video-layer ${
            videoReady ? "is-ready" : ""
          }`}
        />

        {/* Top-left 4x4 frosted & cut-out corner pattern (61u grid) */}
        <div className="sec3-mosaic" aria-hidden="true">
          <svg
            viewBox="0 0 244 244"
            className="sec3-corner-cutout"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 0 L 76 0 A 15 15 0 0 0 61 15 L 61 46 A 15 15 0 0 1 46 61 L 15 61 A 15 15 0 0 0 0 76 Z"
              fill="#FDFEFD"
            />
          </svg>

          {FROSTED_TILES.map((tile) => (
            <div
              key={`${tile.col}-${tile.row}`}
              className="sec3-glass-tile"
              style={{
                left: `calc(${tile.col * 61} * var(--u))`,
                top: `calc(${tile.row * 61} * var(--u))`,
              }}
            />
          ))}
        </div>

        {/* Bottom blurred forest glass band */}
        <div className="sec3-bottom-glass" aria-hidden="true" />

        {/* Spotlight quote & carousel controls */}
        <div className="sec3-testimonial">
          <div key={slideIdx} className="sec3-quote-swap">
            <div className="sec3-quote-clip">
              <p className="sec3-quote-text">&ldquo;{activeSpotlight.quote}&rdquo;</p>
            </div>
          </div>

          <div className="sec3-testimonial-footer">
            <div key={`meta-${slideIdx}`} className="sec3-quote-swap">
              <p className="sec3-author-name">{activeSpotlight.title}</p>
              <p className="sec3-author-role">{activeSpotlight.subtitle}</p>
            </div>

            <div className="sec3-carousel-controls">
              <button
                type="button"
                onClick={() => stepSlide(-1)}
                aria-label="Previous partner network spotlight"
                className="sec3-arrow-btn"
              >
                <ArrowLeft size={20} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => stepSlide(1)}
                aria-label="Next partner network spotlight"
                className="sec3-arrow-btn"
              >
                <ArrowRight size={20} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Network Onboarding */}
      <div className="sec3-form-column" data-aos="fade-up" data-aos-delay="120">
        <div className="sec3-form-inner">
          {/* Typographic NPIA. wordmark */}
          <div
            className="sec3-wordmark sec3-anim-rise"
            style={{ transitionDelay: "80ms" }}
          >
            <span className="sec3-wordmark-brand">
              NPIA<span className="sec3-wordmark-dot" aria-hidden="true">.</span>
            </span>
            <span className="sec3-wordmark-sub">Partner Hub</span>
          </div>

          <div className="sec3-heading-clip">
            <h2
              className="sec3-heading sec3-anim-wipe"
              style={{ transitionDelay: "180ms" }}
            >
              How will we team up?
            </h2>
          </div>

          <p
            className="sec3-subline sec3-anim-rise"
            style={{ transitionDelay: "280ms" }}
          >
            Connect your shelter, clinic, or rescue team with our shared
            logistics grid.
          </p>

          {/* 2x3 Selectable Capability Grid */}
          <div className="sec3-tool-grid" role="group" aria-label="Shared logistics capabilities">
            {CAPABILITIES.map((cap, idx) => {
              const isSelected = selected.includes(cap.id);
              const row = Math.floor(idx / 2);
              const col = idx % 2;
              const delayMs = 360 + row * 155 + col * 55;

              return (
                <div
                  key={cap.id}
                  className="sec3-tool-item sec3-anim-rise"
                  style={{ transitionDelay: `${delayMs}ms` }}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleCapability(cap.id)}
                    className={`sec3-tool-card ${isSelected ? "is-selected" : ""}`}
                  >
                    <div className="sec3-card-top">
                      <span
                        className="sec3-app-badge"
                        style={{ backgroundColor: cap.tileBg }}
                        aria-hidden="true"
                      >
                        {cap.icon}
                      </span>
                      <span className="sec3-checkbox" aria-hidden="true">
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </span>
                    </div>

                    <div className="sec3-card-copy">
                      <p className="sec3-card-name">{cap.name}</p>
                      <p className="sec3-card-meta">
                        <span>{cap.scope}</span>
                      </p>
                    </div>
                  </button>

                  <div className="sec3-info-wrap">
                    <Link
                      href={cap.charterHref}
                      className="sec3-info-trigger"
                      aria-label={`${cap.name}: ${cap.detail} View Founding Charter`}
                    >
                      <Info size={13} strokeWidth={2} aria-hidden="true" />
                    </Link>
                    <div className="sec3-info-popover" role="tooltip">
                      <p className="sec3-info-title">{cap.name}</p>
                      <p className="sec3-info-body">{cap.detail}</p>
                      <span className="sec3-info-cta">View Mission Scope &rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="sec3-anim-rise"
            style={{ transitionDelay: "790ms" }}
          >
            <Link href={partnerHref} className="sec3-submit-btn">
              <span>Join the Partner Network</span>
              {selected.length > 0 && (
                <span className="opacity-80 text-[0.88em]">
                  ({selected.length})
                </span>
              )}
            </Link>
          </div>

          <p
            className="sec3-footer-note sec3-anim-rise"
            style={{ transitionDelay: "890ms" }}
          >
            Representing an allied shelter or vet clinic?{" "}
            <Link href="/about#charter" className="sec3-footer-link">
              View Founding Charter
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
