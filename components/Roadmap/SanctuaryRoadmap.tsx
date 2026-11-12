"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  Network,
  Stethoscope,
} from "lucide-react";
import { ROADMAP_HEADER, ROADMAP_STAGES, type RoadmapStage } from "@/lib/roadmapData";
import "./SanctuaryRoadmap.css";

const STAGE_ICONS: Record<RoadmapStage["accentTheme"], React.ReactNode> = {
  active: <Network size={20} strokeWidth={1.85} aria-hidden="true" />,
  medical: <Stethoscope size={20} strokeWidth={1.85} aria-hidden="true" />,
  capital: <Building2 size={20} strokeWidth={1.85} aria-hidden="true" />,
  academy: <GraduationCap size={20} strokeWidth={1.85} aria-hidden="true" />,
};

export function SanctuaryRoadmap() {
  return (
    <div className="roadmap-page w-full">
      {/* Decorative scroll progress bar (progressive enhancement via animation-timeline) */}
      <div className="roadmap-progress-track" aria-hidden="true">
        <div className="roadmap-progress-bar" />
      </div>

      {/* Editorial Section Header */}
      <section className="w-full pt-12 sm:pt-16 pb-10 sm:pb-14 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECF2EC] border border-[#B2DCB3] text-[#1F4D37] text-xs font-semibold uppercase tracking-[0.16em]">
            <Compass size={14} aria-hidden="true" />
            <span>{ROADMAP_HEADER.eyebrow}</span>
          </div>

          <h1 className="roadmap-display mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#152916] font-normal max-w-4xl">
            {ROADMAP_HEADER.headline}
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#2E4C2F] max-w-3xl">
            {ROADMAP_HEADER.subline}
          </p>

          {/* Single-row anchor jump bar */}
          <nav
            aria-label="Jump to roadmap stage"
            className="mt-8 roadmap-jump-strip"
          >
            {ROADMAP_STAGES.map((stage, idx) => (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                className={`roadmap-jump-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border ${
                  idx === 0
                    ? "bg-[#152916] text-[#FAFFFD] border-[#152916] hover:bg-[#1F4D37]"
                    : "bg-white text-[#1F4D37] border-[#DCE0DD] hover:border-[#4B714C] hover:bg-[#ECF2EC]/60"
                }`}
              >
                {idx === 0 && (
                  <span
                    className="roadmap-active-dot w-2 h-2 rounded-full bg-[#B2DCB3]"
                    aria-hidden="true"
                  />
                )}
                <span>{stage.shortLabel}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Connected 4-Stage Rollout Timeline */}
      <section
        aria-label="Four Stages of NPIA Sanctuary Roadmap"
        className="w-full pb-16 sm:pb-24 px-2 sm:px-6"
      >
        <div className="max-w-5xl mx-auto relative">
          {/* Desktop vertical timeline spine */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-[#4B714C] via-[#8DB68E] to-[#152916]/35"
          />

          <div className="space-y-8 sm:space-y-10">
            {ROADMAP_STAGES.map((stage) => {
              const isAcademy = stage.accentTheme === "academy";
              const isActiveStage = stage.accentTheme === "active";

              return (
                <article
                  key={stage.id}
                  id={stage.id}
                  className="scroll-mt-24 relative md:pl-16"
                >
                  {/* Desktop timeline node marker */}
                  <div
                    aria-hidden="true"
                    className={`hidden md:flex absolute left-0 top-7 w-12 h-12 rounded-2xl items-center justify-center border shadow-sm ${
                      isAcademy
                        ? "bg-[#152916] text-[#E2FFE4] border-[#152916]"
                        : isActiveStage
                          ? "bg-[#1F4D37] text-[#FAFFFD] border-[#1F4D37]"
                          : "bg-[#ECF2EC] text-[#1F4D37] border-[#B2DCB3]"
                    }`}
                  >
                    {STAGE_ICONS[stage.accentTheme]}
                  </div>

                  {/* Stage Card */}
                  <div
                    className={`rounded-3xl p-6 sm:p-8 lg:p-10 border transition-colors ${
                      isAcademy
                        ? "bg-[#152916] text-[#FAFFFD] border-[#2E4C2F] shadow-xl"
                        : isActiveStage
                          ? "bg-white text-[#152916] border-[#B2DCB3] shadow-sm"
                          : "bg-white text-[#152916] border-[#DCE0DD] shadow-sm"
                    }`}
                  >
                    {/* Status Badge + Stage Identifier */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.14em] ${
                          isAcademy
                            ? "bg-white/10 text-[#B2DCB3] border border-white/15"
                            : isActiveStage
                              ? "bg-[#E2FFE4] text-[#1F4D37] border border-[#B2DCB3]"
                              : "bg-[#ECF2EC] text-[#1F4D37] border border-[#DCE0DD]"
                        }`}
                      >
                        {isActiveStage && (
                          <span
                            className="roadmap-active-dot w-2 h-2 rounded-full bg-[#1F4D37]"
                            aria-hidden="true"
                          />
                        )}
                        <span>{stage.statusBadge}</span>
                      </span>

                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                          isAcademy ? "text-[#B2DCB3]/80" : "text-[#4B714C]"
                        }`}
                      >
                        Stage {stage.stageNumber} of 04
                      </span>
                    </div>

                    {/* Title, Tagline, Description */}
                    <h2
                      className={`mt-4 text-2xl sm:text-3xl font-semibold tracking-tight ${
                        isAcademy ? "text-white" : "text-[#152916]"
                      }`}
                    >
                      {stage.title}
                    </h2>

                    <p
                      className={`mt-2 text-base sm:text-lg font-medium ${
                        isAcademy ? "text-[#B2DCB3]" : "text-[#1F4D37]"
                      }`}
                    >
                      {stage.tagline}
                    </p>

                    <p
                      className={`mt-3 text-sm sm:text-base leading-relaxed max-w-3xl ${
                        isAcademy ? "text-[#E2FFE4]/85" : "text-[#2E4C2F]"
                      }`}
                    >
                      {stage.description}
                    </p>

                    {/* Key Milestones 2x2 Checklist */}
                    <div
                      className={`mt-6 pt-6 border-t ${
                        isAcademy ? "border-white/15" : "border-[#EDF2ED]"
                      }`}
                    >
                      <h3
                        className={`text-xs font-semibold uppercase tracking-[0.16em] mb-4 ${
                          isAcademy ? "text-[#B2DCB3]" : "text-[#4B714C]"
                        }`}
                      >
                        Key Milestones
                      </h3>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stage.milestones.map((milestone) => (
                          <li
                            key={milestone.title}
                            className={`rounded-2xl p-4 border flex items-start gap-3 ${
                              isAcademy
                                ? "bg-white/5 border-white/10"
                                : "bg-[#FAFFFD] border-[#DCE0DD]"
                            }`}
                          >
                            <CheckCircle2
                              size={18}
                              className={`mt-0.5 shrink-0 ${
                                isAcademy ? "text-[#B2DCB3]" : "text-[#1F4D37]"
                              }`}
                              aria-hidden="true"
                            />
                            <div className="text-sm leading-relaxed">
                              <strong
                                className={`font-semibold ${
                                  isAcademy ? "text-white" : "text-[#152916]"
                                }`}
                              >
                                {milestone.title}:
                              </strong>{" "}
                              <span
                                className={
                                  isAcademy ? "text-[#E2FFE4]/85" : "text-[#2E4C2F]"
                                }
                              >
                                {milestone.description}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Donor CTA & Charter Link */}
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                      <Link
                        href={stage.ctaHref}
                        className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold transition-colors ${
                          isAcademy
                            ? "bg-[#E2FFE4] text-[#152916] hover:bg-white"
                            : "bg-[#152916] text-[#FAFFFD] hover:bg-[#1F4D37]"
                        }`}
                      >
                        <span>{stage.ctaLabel}</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>

                      <Link
                        href={stage.charterHref}
                        className={`text-xs sm:text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-75 ${
                          isAcademy ? "text-[#B2DCB3]" : "text-[#1F4D37]"
                        }`}
                      >
                        {stage.charterLabel} &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Partner & Charter Bridge */}
      <section className="w-full pt-6 pb-24 sm:pb-32 px-2 sm:px-6">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-[#ECF2EC] border border-[#B2DCB3] flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          data-aos="fade-up"
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1F4D37]">
              Partner With Stages 1 &amp; 2 Today
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#152916]">
              Representing a shelter, veterinary clinic, or rescue team?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#2E4C2F] leading-relaxed">
              Join NPIA&rsquo;s shared recovery bed grid and emergency triage
              dispatch right now while helping shape our flagship sanctuary.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact-us?type=partner"
              className="px-5 py-3 rounded-full bg-[#152916] text-[#FAFFFD] text-sm font-semibold hover:bg-[#1F4D37] transition-colors"
            >
              Partner With NPIA
            </Link>
            <Link
              href="/about#charter"
              className="px-5 py-3 rounded-full bg-white text-[#1F4D37] border border-[#B2DCB3] text-sm font-semibold hover:bg-[#FAFFFD] transition-colors"
            >
              View Founding Charter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
