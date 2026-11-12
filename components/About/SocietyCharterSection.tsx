"use client";

import React, { useState } from "react";
import {
  CHARTER_AIMS,
  CHARTER_OBJECTIVES,
  ETHICAL_COMMITMENTS,
  INITIATIVE_IDENTITY,
} from "@/lib/charterData";
import {
  Eyebrow,
  PillCta,
  StackedLines,
  useDesktopHover,
  useInViewOnce,
  useSpringNumber,
} from "./AboutPrimitives";
import "./AboutBaselineExperience.css";

function AimCard({
  aim,
  index,
}: {
  aim: (typeof CHARTER_AIMS)[number];
  index: number;
}) {
  const { ref, shown } = useInViewOnce(0.12);
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();

  const liftY = useSpringNumber(
    hovered && canHover ? -6 : 0,
    { tension: 300, friction: 22 },
    !canHover
  );

  const isFeaturedWide = aim.number === 7;

  return (
    <li className={isFeaturedWide ? "sm:col-span-2" : ""}>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-full about-inview-rise ${shown ? "is-shown" : ""}`}
        style={
          {
            "--rise-y": "32px",
            "--rise-delay": `${(index % 4) * 75}ms`,
          } as React.CSSProperties
        }
      >
        <div
          className="about-hover-lift h-full rounded-[1.5rem] bg-[#FAFFFD] border border-[#DCE5DE] p-6 sm:p-7 flex flex-col justify-between gap-4"
          style={{
            transform: `translate3d(0, ${liftY}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl font-medium tracking-tight text-[#245736]">
              {String(aim.number).padStart(2, "0")}
            </span>
            {isFeaturedWide && (
              <span className="rounded-full bg-[#EFF4F0] border border-[#DCE5DE] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#245736]">
                Stage 01 · Partner Grid
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-medium tracking-tight text-[#102111]">
              {aim.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B6350]">
              {aim.description}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function ObjectiveCard({
  obj,
  index,
}: {
  obj: (typeof CHARTER_OBJECTIVES)[number];
  index: number;
}) {
  const { ref, shown } = useInViewOnce(0.1);
  const isClosingWide = obj.number === 11;

  return (
    <article
      id={obj.id}
      className={`scroll-mt-28 ${isClosingWide ? "lg:col-span-2" : ""}`}
    >
      <div
        ref={ref}
        className={`h-full about-inview-rise rounded-[1.5rem] p-6 sm:p-8 bg-[#EFF4F0] border border-[#DCE5DE] transition-colors target:border-[#245736] target:bg-[#E2FFE4]/35 target:ring-2 target:ring-[#245736]/30 ${
          shown ? "is-shown" : ""
        }`}
        style={
          {
            "--rise-y": "32px",
            "--rise-delay": `${(index % 2) * 90}ms`,
          } as React.CSSProperties
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#245736]">
              Objective {String(obj.number).padStart(2, "0")}
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-[#102111]">
              {obj.title}
            </h3>
          </div>
          <span
            className="text-3xl sm:text-4xl font-medium tracking-tight text-[#4B6350]/45 shrink-0"
            aria-hidden="true"
          >
            {String(obj.number).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B6350]">
          {obj.summary}
        </p>

        <ul
          className={`mt-6 pt-5 border-t border-[#DCE5DE] grid gap-3 ${
            isClosingWide ? "grid-cols-1" : "grid-cols-1"
          }`}
        >
          {obj.items.map((item) => (
            <li
              key={item.code}
              className="flex items-start gap-3 text-sm text-[#102111]/90 leading-relaxed"
            >
              <span className="mt-0.5 shrink-0 px-2.5 py-0.5 rounded-full bg-[#FAFFFD] border border-[#DCE5DE] text-[#245736] text-xs font-semibold">
                {item.code}
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function SocietyCharterSection() {
  const { ref: aimsHeadRef, shown: aimsHeadShown } = useInViewOnce(0.14);
  const { ref: objHeadRef, shown: objHeadShown } = useInViewOnce(0.14);
  const { ref: govHeadRef, shown: govHeadShown } = useInViewOnce(0.14);

  return (
    <div className="about-baseline-root px-2 sm:px-3 pb-2 sm:pb-3">
      {/* 1) Seven Core Aims on Soft Sage Surface */}
      <section
        id="charter"
        aria-labelledby="charter-aims-title"
        className="scroll-mt-24 rounded-[2rem] bg-[#EFF4F0] pt-20 sm:pt-24 pb-24 sm:pb-28 px-5 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div
            ref={aimsHeadRef}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div>
              <Eyebrow label={INITIATIVE_IDENTITY.eyebrow} tone="dark" />
              <h2
                id="charter-aims-title"
                className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.96] text-[#102111]"
              >
                <StackedLines
                  lines={["Seven aims shaping", "our shared mandate"]}
                  shown={aimsHeadShown}
                />
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#4B6350] max-w-md">
              {INITIATIVE_IDENTITY.fullName} publishes its core aims and
              operational program scope openly so allied shelters, vets, and
              supporters see what every initiative stands for.
            </p>
          </div>

          <ul className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CHARTER_AIMS.map((aim, idx) => (
              <AimCard key={aim.number} aim={aim} index={idx} />
            ))}
          </ul>
        </div>
      </section>

      {/* 2) Overlapping Eleven Objectives Section on Crisp Off-White */}
      <section
        id="objectives"
        aria-labelledby="charter-objectives-title"
        className="relative -mt-10 rounded-[2rem] bg-[#FAFFFD] pt-16 sm:pt-20 pb-20 sm:pb-24 px-5 sm:px-10 border-t border-[#DCE5DE]/70"
      >
        <div className="max-w-6xl mx-auto">
          <div
            ref={objHeadRef}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div>
              <Eyebrow label="Program Scope · 11 Objectives" tone="dark" />
              <h2
                id="charter-objectives-title"
                className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.96] text-[#102111]"
              >
                <StackedLines
                  lines={["Eleven practical", "program objectives"]}
                  shown={objHeadShown}
                />
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#4B6350] max-w-md">
              From emergency roadside triage and partner shelter networking to
              wildlife release and civic cruelty defense, every objective maps
              directly to field operations.
            </p>
          </div>

          <div className="mt-12 sm:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CHARTER_OBJECTIVES.map((obj, idx) => (
              <ObjectiveCard key={obj.id} obj={obj} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 3) Deep Pine Ethics & Stewardship Finale Band */}
      <section
        id="governance"
        aria-labelledby="charter-ethics-title"
        className="mt-3 scroll-mt-24 rounded-[2rem] bg-[#152916] text-white py-20 px-5 sm:px-10 target:ring-4 target:ring-[#B2DCB3]/60"
      >
        <div className="max-w-6xl mx-auto">
          <div
            ref={govHeadRef}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
          >
            <div>
              <Eyebrow label="Ethics & Stewardship" tone="light" />
              <h2
                id="charter-ethics-title"
                className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.95] text-white"
              >
                <StackedLines
                  lines={["Honest stewardship,", "compassionate action"]}
                  shown={govHeadShown}
                />
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PillCta
                href="/contact-us?type=partner"
                label="Partner With Us"
                variant="outline-light"
              />
              <PillCta
                href="/donate"
                label="Fund Rescue & Sanctuary"
                variant="light"
              />
            </div>
          </div>

          <dl className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {ETHICAL_COMMITMENTS.map((item) => (
              <div
                key={item.number}
                className="border-t border-white/20 pt-5 flex flex-col justify-between"
              >
                <div>
                  <span className="block text-5xl sm:text-6xl font-medium tracking-tight text-white">
                    {item.number}
                  </span>
                  <dt className="mt-4 text-lg font-medium text-[#E2FFE4]">
                    {item.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/75">
                    {item.statement}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
