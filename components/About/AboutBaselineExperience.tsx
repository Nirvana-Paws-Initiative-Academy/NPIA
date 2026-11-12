"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { Pause, Play } from "lucide-react";
import {
  CORE_VALUES,
  FOUNDING_SEATS,
  HERO_FOCUS_SLIDES,
  PILLAR_SLIDES,
  ROADMAP_PREVIEW,
  STORY_CHAPTERS,
  VISION_MISSION_CARDS,
} from "@/lib/aboutData";
import {
  ArrowSvg,
  Eyebrow,
  PillCta,
  StackedLines,
  useDesktopHover,
  useInViewOnce,
  usePrefersReducedMotion,
  useSpringNumber,
} from "./AboutPrimitives";
import "./AboutBaselineExperience.css";

function CarouselArrowButton({
  direction,
  variant,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  variant: "outline" | "solid";
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();
  const scale = useSpringNumber(
    hovered && canHover ? 1.15 : 1,
    { tension: 320, friction: 18 },
    !canHover
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`about-arrow-circle border cursor-pointer ${
        variant === "solid"
          ? "bg-[#102111] border-[#102111] text-white hover:bg-[#152916]"
          : "bg-transparent border-[#DCE5DE] text-[#102111] hover:border-[#102111]"
      }`}
    >
      <ArrowSvg
        className="w-5 h-5"
        flip={direction === "prev"}
        scale={scale}
      />
    </button>
  );
}

function CarouselDots({
  count,
  activeIndex,
  tone,
  labelPrefix,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  tone: "light" | "dark";
  labelPrefix: string;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`${labelPrefix} ${idx + 1} of ${count}`}
            aria-current={isActive ? "true" : undefined}
            className="p-1.5 cursor-pointer"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? `w-5 ${tone === "light" ? "bg-white" : "bg-[#102111]"}`
                  : `w-1.5 ${tone === "light" ? "bg-white/40" : "bg-[#D4DFD6]"}`
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function HeroFocusSlider({
  ready,
  reducedMotion,
}: {
  ready: boolean;
  reducedMotion: boolean;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const springProgress = useSpringNumber(
    1,
    { tension: 210, friction: 24 },
    reducedMotion
  );
  const [fadeKey, setFadeKey] = useState(0);
  const [swapIn, setSwapIn] = useState(1);
  const swapScaleAndY = useSpringNumber(
    swapIn,
    { tension: 210, friction: 24 },
    reducedMotion
  );

  const selectSlide = useCallback(
    (nextIdx: number) => {
      setSlideIdx(nextIdx);
      setFadeKey((k) => k + 1);
      if (!reducedMotion) {
        setSwapIn(0);
        requestAnimationFrame(() => setSwapIn(1));
      }
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (!ready || paused || reducedMotion) return;
    const id = setInterval(() => {
      selectSlide((slideIdx + 1) % HERO_FOCUS_SLIDES.length);
    }, 3800);
    return () => clearInterval(id);
  }, [ready, paused, reducedMotion, slideIdx, selectSlide]);

  const current = HERO_FOCUS_SLIDES[slideIdx];
  const opacityVal = reducedMotion ? 1 : swapScaleAndY;
  const translateYVal = reducedMotion ? 0 : (1 - swapScaleAndY) * 16;
  const scaleVal = reducedMotion ? 1 : 0.96 + swapScaleAndY * 0.04;

  return (
    <div
      className={`hidden md:flex flex-col gap-3 w-64 about-inview-rise ${
        ready ? "is-shown" : ""
      }`}
      style={{ "--rise-delay": "650ms" } as React.CSSProperties}
    >
      <div
        key={fadeKey}
        className="flex flex-row gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-3 shadow-lg shadow-[#0b1c0e]/30 backdrop-blur-md"
        style={{
          opacity: opacityVal * springProgress,
          transform: `translate3d(0, ${translateYVal}px, 0) scale(${scaleVal})`,
        }}
      >
        <div className="relative w-14 h-14 rounded-[0.75rem] overflow-hidden shrink-0 bg-[#152916]">
          <Image
            src={current.imageSrc}
            alt={current.imageAlt}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex flex-col justify-between text-white">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-wider text-[#B2DCB3] truncate">
              {current.eyebrow}
            </p>
            <p className="text-[0.75rem] font-medium uppercase text-white/90 truncate">
              {current.title}
            </p>
          </div>
          <Link
            href={current.href}
            className="text-[0.7rem] underline underline-offset-4 text-white/95 hover:text-[#E2FFE4] transition-colors w-fit"
          >
            {current.ctaLabel} &rarr;
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <CarouselDots
          count={HERO_FOCUS_SLIDES.length}
          activeIndex={slideIdx}
          tone="light"
          labelPrefix="Show sanctuary highlight"
          onSelect={(idx) => {
            setPaused(true);
            selectSlide(idx);
          }}
        />
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused ? "Play highlight rotation" : "Pause highlight rotation"
          }
          className="w-7 h-7 rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20 inline-flex items-center justify-center transition-colors cursor-pointer"
        >
          {paused ? (
            <Play size={11} aria-hidden="true" />
          ) : (
            <Pause size={11} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

function StoryChapterRow({
  chapter,
  index,
}: {
  chapter: (typeof STORY_CHAPTERS)[number];
  index: number;
}) {
  const { ref, shown } = useInViewOnce(0.12);
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();

  const arrowX = useSpringNumber(
    hovered && canHover ? 8 : 0,
    { tension: 300, friction: 20 },
    !canHover
  );
  const arrowOpacity = useSpringNumber(
    hovered && canHover ? 1 : 0.55,
    { tension: 300, friction: 20 },
    !canHover
  );

  return (
    <li className="border-t border-[#DCE5DE] last:border-b">
      <Link
        href={chapter.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="about-story-row block focus-visible:bg-white"
      >
        <div
          ref={ref}
          className={`about-inview-rise flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-7 px-2 sm:px-3 ${
            shown ? "is-shown" : ""
          }`}
          style={
            {
              "--rise-y": "26px",
              "--rise-delay": `${index * 90}ms`,
            } as React.CSSProperties
          }
        >
          <span className="w-10 text-sm font-medium text-[#4B6350] shrink-0">
            {chapter.index}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#102111]">
              {chapter.title}
            </h3>
            <p className="mt-1 text-sm sm:text-base text-[#4B6350] leading-relaxed max-w-2xl">
              {chapter.description}
            </p>
          </div>
          <span
            className="w-11 h-11 rounded-full border border-[#DCE5DE] inline-flex items-center justify-center text-[#102111] shrink-0 self-end sm:self-center"
            aria-hidden="true"
          >
            <ArrowSvg
              className="w-4 h-4"
              offsetX={arrowX}
              opacity={arrowOpacity}
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

function VisionCardTile({
  card,
  index,
}: {
  card: (typeof VISION_MISSION_CARDS)[number];
  index: number;
}) {
  const { ref, shown } = useInViewOnce(0.14);
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();

  const imgScale = useSpringNumber(
    hovered && canHover ? 1.03 : 1,
    { tension: 300, friction: 22 },
    !canHover
  );

  return (
    <div
      ref={ref}
      className={`flex-1 about-inview-rise ${
        index === 1 ? "sm:mb-8" : ""
      } ${shown ? "is-shown" : ""}`}
      style={
        {
          "--rise-y": "48px",
          "--rise-delay": `${index * 140}ms`,
        } as React.CSSProperties
      }
    >
      <figure
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[#EFF4F0]"
      >
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 768px) 48vw, 24vw"
          className="object-cover about-hover-scale"
          style={{
            objectPosition: card.imagePosition ?? "50% 50%",
            transform: `scale(${imgScale})`,
          }}
        />
        <figcaption
          className={`absolute inset-x-3 bottom-3 rounded-[0.75rem] backdrop-blur-md text-white px-4 py-3 ${
            card.tone === "teal" ? "bg-[#1F4D37]/75" : "bg-[#152916]/65"
          }`}
        >
          <p className="text-sm font-medium">{card.title}</p>
          <p className="mt-1 text-[0.72rem] leading-snug text-white/90">
            {card.description}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

function CoreValueCardTile({
  item,
  index,
}: {
  item: (typeof CORE_VALUES)[number];
  index: number;
}) {
  const { ref, shown } = useInViewOnce(0.14);
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();

  const liftY = useSpringNumber(
    hovered && canHover ? -8 : 0,
    { tension: 300, friction: 22 },
    !canHover
  );

  return (
    <li className="h-full">
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-full about-inview-rise ${shown ? "is-shown" : ""}`}
        style={
          {
            "--rise-y": "40px",
            "--rise-delay": `${index * 120}ms`,
          } as React.CSSProperties
        }
      >
        <figure
          className="about-hover-lift flex flex-col justify-between h-full rounded-[1.5rem] bg-[#EFF4F0] p-7 border border-[#DCE5DE]"
          style={{
            transform: `translate3d(0, ${liftY}px, 0)`,
          }}
        >
          <div>
            <span
              className="block text-4xl font-medium text-[#245736] leading-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <blockquote className="mt-4 text-lg leading-relaxed text-[#102111]">
              {item.description}
            </blockquote>
          </div>
          <figcaption className="border-t border-[#DCE5DE] pt-4 mt-6">
            <p className="font-medium text-[#102111]">{item.title}</p>
            <p className="text-sm text-[#4B6350]">{item.pillar}</p>
          </figcaption>
        </figure>
      </div>
    </li>
  );
}

export function AboutBaselineExperience() {
  const reducedMotion = usePrefersReducedMotion();
  const [heroReady, setHeroReady] = useState(false);

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroPlateRef = useRef<HTMLDivElement>(null);

  const pillarsSectionRef = useRef<HTMLElement>(null);
  const ghostRefs = useRef<Array<HTMLSpanElement | null>>([
    null,
    null,
    null,
    null,
  ]);

  const [pillarIdx, setPillarIdx] = useState(0);
  const [pillarRevealKey, setPillarRevealKey] = useState(0);
  const [pillarWordsShown, setPillarWordsShown] = useState(false);
  const [photoOpacityTarget, setPhotoOpacityTarget] = useState(1);

  const photoOpacity = useSpringNumber(
    photoOpacityTarget,
    { tension: 260, friction: 26 },
    reducedMotion
  );

  const { ref: pctBadgeRef, shown: pctBadgeShown } = useInViewOnce(0.15);
  const { ref: infoCardRef, shown: infoCardShown } = useInViewOnce(0.15);
  const { ref: coachCardRef, shown: coachCardShown } = useInViewOnce(0.15);
  const { ref: ghostAreaRef, shown: ghostAreaInView } = useInViewOnce(0.15);
  const { ref: storyTitleRef, shown: storyTitleShown } = useInViewOnce(0.15);
  const { ref: visionIntroRef, shown: visionIntroShown } = useInViewOnce(0.15);
  const { ref: roadmapHeadRef, shown: roadmapHeadShown } = useInViewOnce(0.15);
  const { ref: valuesHeadRef, shown: valuesHeadShown } = useInViewOnce(0.15);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (ghostAreaInView) {
      setPillarWordsShown(true);
    }
  }, [ghostAreaInView]);

  const handlePillarChange = useCallback(
    (nextIdx: number) => {
      setPillarIdx(nextIdx);
      setPillarRevealKey((k) => k + 1);
      if (!reducedMotion) {
        setPillarWordsShown(false);
        setPhotoOpacityTarget(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPillarWordsShown(true);
            setPhotoOpacityTarget(1);
          });
        });
      }
    },
    [reducedMotion]
  );

  // Lenis smooth scroll + scroll-progress parallax for Hero plate and Ghost words
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      smoothWheel: true,
    });

    const updateParallax = () => {
      const vh = window.innerHeight || 1;
      const hero = heroSectionRef.current;
      const plate = heroPlateRef.current;
      if (hero && plate) {
        const rect = hero.getBoundingClientRect();
        const total = vh + rect.height;
        const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));
        const shift = progress * 12;
        plate.style.transform = `translate3d(0, ${shift.toFixed(3)}%, 0)`;
      }

      const sec = pillarsSectionRef.current;
      if (sec) {
        const rect = sec.getBoundingClientRect();
        const total = vh + rect.height;
        const p = Math.min(1, Math.max(0, (vh - rect.top) / total));
        const ranges: Array<[number, number]> = [
          [-3, 3],
          [3, -3],
          [-2, 4],
          [4, -3],
        ];
        ranges.forEach(([fromX, toX], idx) => {
          const el = ghostRefs.current[idx];
          if (el) {
            const x = fromX + (toX - fromX) * p;
            el.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0)`;
          }
        });
      }
    };

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      updateParallax();
      rafId = requestAnimationFrame(raf);
    };

    updateParallax();
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  const activePillar = PILLAR_SLIDES[pillarIdx];
  const heroTitleWords = ["ABOUT", "NPIA."];
  const visionParagraphWords =
    "Every street animal deserves urgent medical care, safe recovery space, and the chance to thrive in a loving home or purposeful role.".split(
      " "
    );

  return (
    <div className="about-baseline-root px-2 sm:px-3 pt-2 sm:pt-3">
      {/* 1) Editorial Parallax Hero */}
      <section
        ref={heroSectionRef}
        aria-labelledby="about-hero-title"
        className="relative isolate overflow-hidden rounded-[2rem] bg-[#152916] text-white min-h-[34rem] h-[calc(100svh-5.5rem)] flex flex-col justify-between px-6 sm:px-10 py-6 sm:py-10"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            ref={heroPlateRef}
            className="absolute inset-x-0 -top-[16%] h-[132%] w-full will-change-transform"
          >
            <Image
              src="/Puppies_resting_at_animal_shelter_60e4af22.jpg"
              alt="Rescued puppies and street dogs resting peacefully together at sanctuary twilight"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(16, 36, 18, 0.72), rgba(16, 36, 18, 0.36), rgba(16, 36, 18, 0.84))",
            }}
          />
        </div>

        {/* Top Breadcrumb + Oversized Clip-Mask Hero Title */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow label="Nirvana Paws Initiative & Academy" tone="light" />
            <a
              href="#charter"
              className="text-xs uppercase tracking-[0.18em] text-[#E2FFE4]/85 hover:text-white underline underline-offset-4 transition-colors"
            >
              Read Founding Charter &darr;
            </a>
          </div>

          <h1 id="about-hero-title" className="about-hero-title mt-5 sm:mt-7">
            {heroTitleWords.map((word, idx) => (
              <React.Fragment key={word}>
                <span className="about-clip-box">
                  <span
                    className={`about-clip-inner about-word-anim ${
                      heroReady ? "is-shown" : ""
                    }`}
                    style={
                      {
                        "--reveal-dur": "1100ms",
                        "--reveal-delay": `${idx * 140}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {word}
                  </span>
                </span>
                {idx < heroTitleWords.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </h1>
        </div>

        {/* Bottom Tagline + Highlight Slider + Aims Summary */}
        <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <p className="about-tagline">
            <StackedLines
              lines={["Rescue Today,", "Sanctuary Next"]}
              baseDelay={350}
              stagger={110}
              duration={900}
              shown={heroReady}
            />
          </p>

          <div className="flex items-end gap-4">
            <HeroFocusSlider
              ready={heroReady}
              reducedMotion={reducedMotion}
            />

            <a
              href="#charter"
              className={`about-inview-rise w-full max-w-[20rem] sm:w-60 rounded-[1.5rem] border border-white/15 bg-white/10 p-3 shadow-lg shadow-[#0b1c0e]/30 backdrop-blur-md flex gap-3 items-stretch hover:bg-white/15 transition-colors ${
                heroReady ? "is-shown" : ""
              }`}
              style={{ "--rise-delay": "780ms" } as React.CSSProperties}
            >
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <p className="text-3xl font-medium leading-none text-white">
                  7
                </p>
                <div className="flex -space-x-2 my-2" aria-hidden="true">
                  <span className="w-5 h-5 rounded-full border border-[#152916]/40 bg-[#B2DCB3]" />
                  <span className="w-5 h-5 rounded-full border border-[#152916]/40 bg-[#4B714C]" />
                  <span className="w-5 h-5 rounded-full border border-[#152916]/40 bg-[#1F4D37]" />
                  <span className="w-5 h-5 rounded-full border border-[#152916]/40 bg-white" />
                </div>
                <p className="text-[0.7rem] text-white/85 leading-tight">
                  Core Founding Aims &darr;
                </p>
              </div>
              <div className="relative w-16 aspect-[3/4] rounded-[0.75rem] overflow-hidden shrink-0 bg-[#1F4D37]">
                <Image
                  src="/Veterinarian_tending_to_dog_51eefdfd.jpg"
                  alt="Caretaker gently tending to a rescued street dog"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 2) Guiding Pillars Carousel with Ghost Typography & Scroll Parallax */}
      <section
        ref={pillarsSectionRef}
        aria-labelledby="about-pillars-title"
        className="relative isolate overflow-hidden bg-[#FAFFFD] py-16 sm:py-20 px-4 sm:px-10"
      >
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div
            ref={pctBadgeRef}
            className={`about-inview-rise w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#EFF4F0] border border-[#DCE5DE] flex flex-col items-center justify-center text-center p-3 shrink-0 ${
              pctBadgeShown ? "is-shown" : ""
            }`}
            style={{ "--rise-scale": "0.9" } as React.CSSProperties}
          >
            <span className="text-2xl font-medium text-[#102111]">100%</span>
            <span className="mt-0.5 text-[0.62rem] leading-tight text-[#4B6350] max-w-[8em]">
              Street-first rescue &amp; honest care
            </span>
          </div>

          <article
            ref={infoCardRef}
            className={`about-inview-rise max-w-[28rem] rounded-[1.5rem] bg-[#EFF4F0] border border-[#DCE5DE] p-5 sm:p-6 flex items-start gap-4 sm:gap-5 ${
              infoCardShown ? "is-shown" : ""
            }`}
            style={
              {
                "--rise-y": "24px",
                "--rise-delay": "120ms",
              } as React.CSSProperties
            }
          >
            <span className="rounded-[0.75rem] bg-[#FAFFFD] border border-[#DCE5DE] px-4 py-2 text-xl font-medium text-[#102111] shrink-0">
              #01
            </span>
            <div>
              <h2 className="text-lg font-medium text-[#102111]">
                Built for street animals
              </h2>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#4B6350]">
                From roadside trauma triage to pooled shelter recovery beds and
                canine training, NPIA connects care before a single brick is laid.
              </p>
            </div>
          </article>
        </div>

        {/* Centerpiece Ghost Typography + Rotated Feature Card */}
        <div ref={ghostAreaRef} className="relative mt-10 sm:mt-14 py-6 sm:py-12">
          <h2
            id="about-pillars-title"
            className="about-ghost-heading relative z-0 max-w-[88rem] mx-auto"
          >
            {[0, 2].map((rowStart) => (
              <span
                key={rowStart}
                className={`flex justify-between gap-4 ${
                  rowStart === 2 ? "mt-2 sm:mt-3" : ""
                }`}
              >
                {[rowStart, rowStart + 1].map((idx) => {
                  const word = activePillar.headline[idx];
                  const isInk = idx === 2;
                  return (
                    <span
                      key={`${pillarRevealKey}-${idx}`}
                      ref={(el) => {
                        ghostRefs.current[idx] = el;
                      }}
                      className={`inline-block will-change-transform ${
                        isInk ? "text-[#102111]" : "text-[#D4DFD6]"
                      }`}
                    >
                      <span className="about-clip-box">
                        <span
                          className={`about-clip-inner about-word-anim ${
                            pillarWordsShown ? "is-shown" : ""
                          }`}
                          style={
                            {
                              "--reveal-dur": "700ms",
                              "--reveal-delay": `${idx * 70}ms`,
                            } as React.CSSProperties
                          }
                        >
                          {word}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          {/* Tilted Center Card */}
          <div
            ref={coachCardRef}
            className={`relative sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-10 mx-auto mt-8 sm:mt-0 w-52 sm:w-64 about-inview-rise ${
              coachCardShown ? "is-shown" : ""
            }`}
            style={
              {
                "--rise-y": "60px",
                "--rise-scale": "0.92",
              } as React.CSSProperties
            }
          >
            <figure className="about-coach-card relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[#245736] shadow-xl">
              <Image
                src={activePillar.imageSrc}
                alt={activePillar.imageAlt}
                fill
                sizes="(max-width: 640px) 208px, 256px"
                className="object-cover"
                style={{ opacity: photoOpacity }}
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-[0.75rem] bg-[#152916]/60 backdrop-blur-md text-white px-3 py-2">
                <p className="text-sm font-medium">{activePillar.title}</p>
                <p className="text-[0.68rem] text-white/80">
                  {activePillar.subtitle}
                </p>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="relative z-20 mt-10 sm:mt-20 flex items-center justify-between max-w-5xl mx-auto">
          <CarouselArrowButton
            direction="prev"
            variant="outline"
            label="Previous core pillar"
            onClick={() =>
              handlePillarChange(
                (pillarIdx - 1 + PILLAR_SLIDES.length) % PILLAR_SLIDES.length
              )
            }
          />
          <CarouselDots
            count={PILLAR_SLIDES.length}
            activeIndex={pillarIdx}
            tone="dark"
            labelPrefix="Show core pillar"
            onSelect={handlePillarChange}
          />
          <CarouselArrowButton
            direction="next"
            variant="solid"
            label="Next core pillar"
            onClick={() =>
              handlePillarChange((pillarIdx + 1) % PILLAR_SLIDES.length)
            }
          />
        </div>
      </section>

      {/* 3) Six Chapters of Our Story (Numbered Editorial List) */}
      <section
        id="story"
        aria-labelledby="about-story-title"
        className="rounded-[2rem] bg-[#EFF4F0] py-20 sm:py-24 px-5 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div ref={storyTitleRef}>
            <Eyebrow label="Timeline of compassion" tone="dark" />
            <h2
              id="about-story-title"
              className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.96] text-[#102111]"
            >
              <StackedLines
                lines={["Six chapters", "shaping NPIA"]}
                shown={storyTitleShown}
              />
            </h2>
          </div>

          <ul className="mt-12 sm:mt-14">
            {STORY_CHAPTERS.map((chapter, idx) => (
              <StoryChapterRow
                key={chapter.index}
                chapter={chapter}
                index={idx}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* 4) Overlapping Vision & Mission Showcase */}
      <section
        id="vision-mission"
        aria-labelledby="about-vision-title"
        className="relative -mt-10 rounded-[2rem] bg-[#FAFFFD] pt-16 pb-20 px-5 sm:px-10 border-t border-[#DCE5DE]/70"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-end gap-10">
          <div ref={visionIntroRef} className="max-w-sm">
            <div
              className={`about-inview-rise relative w-16 h-16 rounded-[1.5rem] overflow-hidden bg-[#EFF4F0] border border-[#DCE5DE] ${
                visionIntroShown ? "is-shown" : ""
              }`}
              style={{ "--rise-scale": "0.85" } as React.CSSProperties}
            >
              <Image
                src="/hero/street-dogs-poster.jpg"
                alt="Street dog resting under evening sanctuary shelter"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <h2
              id="about-vision-title"
              className="mt-6 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.95] text-[#102111]"
            >
              <StackedLines
                lines={["Guided by", "Compassion", "& Dignity"]}
                stagger={120}
                shown={visionIntroShown}
              />
            </h2>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#4B6350] max-w-xs">
              {visionParagraphWords.map((word, idx) => (
                <React.Fragment key={`${word}-${idx}`}>
                  <span className="about-clip-box">
                    <span
                      className={`about-clip-inner about-fadeword-anim ${
                        visionIntroShown ? "is-shown" : ""
                      }`}
                      style={
                        {
                          "--reveal-delay": `${250 + idx * 28}ms`,
                        } as React.CSSProperties
                      }
                    >
                      {word}
                    </span>
                  </span>
                  {idx < visionParagraphWords.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-5">
            {VISION_MISSION_CARDS.map((card, idx) => (
              <VisionCardTile key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 5) 4-Up Sanctuary Roadmap Band on Deep Pine */}
      <section
        id="roadmap-overview"
        aria-labelledby="about-roadmap-title"
        className="mt-3 rounded-[2rem] bg-[#152916] text-white py-20 px-5 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div
            ref={roadmapHeadRef}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <Eyebrow label="The Sanctuary Roadmap" tone="light" />
              <h2
                id="about-roadmap-title"
                className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.95] text-white"
              >
                <StackedLines
                  lines={["Four stages", "to lasting shelter"]}
                  shown={roadmapHeadShown}
                />
              </h2>
            </div>

            <PillCta
              href="/roadmap"
              label="Explore Full Roadmap"
              variant="light"
            />
          </div>

          <dl className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {ROADMAP_PREVIEW.map((item, idx) => (
              <div
                key={item.number}
                className="border-t border-white/20 pt-5 group"
              >
                <dt className="sr-only">Stage {item.number}</dt>
                <dd>
                  <Link href={item.href} className="block focus-visible:outline-offset-4">
                    <span className="block text-6xl sm:text-7xl font-medium tracking-tight text-white group-hover:text-[#B2DCB3] transition-colors">
                      {item.number}
                    </span>
                    <span
                      className="mt-3 block text-sm leading-relaxed text-white/75"
                      style={{
                        transitionDelay: `${idx * 80}ms`,
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6) Core Values 3-Up Grid + Founding Seats */}
      <section
        id="team"
        aria-labelledby="about-values-title"
        className="bg-[#FAFFFD] pt-20 pb-28 sm:pt-24 sm:pb-36 px-5 sm:px-10"
      >
        <div className="max-w-6xl mx-auto">
          <div ref={valuesHeadRef}>
            <Eyebrow label="What guides every decision" tone="dark" />
            <h2
              id="about-values-title"
              className="mt-4 text-4xl sm:text-5xl font-medium tracking-tight leading-[0.95] text-[#102111]"
            >
              <StackedLines
                lines={["Built on core", "animal-first values"]}
                shown={valuesHeadShown}
              />
            </h2>
          </div>

          <ul className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {CORE_VALUES.map((item, idx) => (
              <CoreValueCardTile key={item.title} item={item} index={idx} />
            ))}
          </ul>

          {/* Founding Team */}
          <div className="mt-16 pt-12 border-t border-[#DCE5DE]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <Eyebrow label="Founding Team" tone="dark" />
                <h3 className="mt-3 text-2xl sm:text-3xl font-medium tracking-tight text-[#102111]">
                  People leading the initiative
                </h3>
              </div>
              <Link
                href="/contact-us?type=partner"
                className="text-sm font-medium text-[#1F4D37] underline underline-offset-4 hover:opacity-75"
              >
                Join our volunteer &amp; partner community &rarr;
              </Link>
            </div>

            <div
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
              data-aos="fade-up"
            >
              {FOUNDING_SEATS.map((seat, idx) => (
                <div
                  key={seat.name}
                  className={`rounded-[1.5rem] bg-[#EFF4F0] border border-[#DCE5DE] p-5 sm:p-6 flex flex-col justify-between gap-5 ${
                    idx < 2
                      ? "lg:col-span-3"
                      : idx < 5
                      ? "lg:col-span-2"
                      : idx === 6
                      ? "sm:col-span-2 lg:col-span-3"
                      : "lg:col-span-3"
                  }`}
                >
                  {/* Editorial Portrait Slot / Placeholder */}
                  <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] rounded-[1rem] overflow-hidden bg-gradient-to-br from-[#DCE5DE] via-[#E8EFE9] to-[#CFE0D2] border border-[#DCE5DE]">
                    {seat.imageSrc ? (
                      <Image
                        src={seat.imageSrc}
                        alt={`${seat.name} — ${seat.role}`}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex flex-col items-center justify-center p-4"
                      >
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#152916] text-[#E2FFE4] shadow-sm border border-white/25">
                          <span className="text-xl font-medium tracking-tight">
                            {seat.initials}
                          </span>
                        </div>
                        <span className="mt-3 rounded-full bg-[#FAFFFD]/85 border border-[#DCE5DE] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[#4B6350]">
                          Portrait placeholder
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#245736]">
                        {seat.role}
                      </span>
                      <h4 className="mt-1.5 text-2xl font-medium tracking-tight text-[#102111]">
                        {seat.name}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4B6350] leading-relaxed">
                      {seat.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
