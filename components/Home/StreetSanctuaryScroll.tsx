"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronUp, Info, X } from "lucide-react";
import { useVideoScrub } from "@/hooks/useVideoScrub";

const VIDEO_SRC = "/hero/caring-for-street-dogs-scrub.mp4";

const DARK = "#152916";
const LIGHT = "#FAFFFD";

interface StaggerProps {
  visible: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

function Stagger({ visible, delay = 0, className = "", children }: StaggerProps) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StageState {
  activeStep: 0 | 1 | 2;
  v1: boolean;
  v2: boolean;
  v3: boolean;
}

export default function StreetSanctuaryScroll() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<StageState>({
    activeStep: 0,
    v1: true,
    v2: false,
    v3: false,
  });

  const handleProgressFrame = useCallback((p: number) => {
    const s1 = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08);
    const s2 =
      p < 0.32
        ? 0
        : p < 0.4
          ? (p - 0.32) / 0.08
          : p < 0.55
            ? 1
            : Math.max(0, 1 - (p - 0.55) / 0.08);
    const s3 = p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1;

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.style.setProperty("--s1", s1.toFixed(4));
      overlay.style.setProperty("--s2", s2.toFixed(4));
      overlay.style.setProperty("--s3", s3.toFixed(4));
    }

    const nextStep: 0 | 1 | 2 = p < 0.3 ? 0 : p < 0.63 ? 1 : 2;
    const v1 = s1 > 0.3;
    const v2 = s2 > 0.3;
    const v3 = s3 > 0.3;

    setStage((prev) => {
      if (
        prev.activeStep === nextStep &&
        prev.v1 === v1 &&
        prev.v2 === v2 &&
        prev.v3 === v3
      ) {
        return prev;
      }
      return {
        activeStep: nextStep,
        v1,
        v2,
        v3,
      };
    });
  }, []);

  const {
    containerRef,
    videoRef,
    canvasRef,
    canvasLive,
    fallbackActive,
    scrollToProgress,
  } = useVideoScrub(VIDEO_SRC, handleProgressFrame);

  const [navReady, setNavReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setNavReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!charterOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCharterOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [charterOpen]);

  const navColor = LIGHT;

  const navItems = [
    { label: "01 STREET REALITY", target: 0.04, stepIdx: 0 },
    { label: "02 NETWORKED CARE", target: 0.44, stepIdx: 1 },
    { label: "03 THE SANCTUARY", target: 0.85, stepIdx: 2 },
  ];

  return (
    <section
      ref={containerRef}
      aria-label="Street Reality to Shelter Sanctuary Story"
      className="relative w-full h-[500vh]"
      style={{
        fontFamily:
          "'Helvetica Neue ME', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0b1c0e]">
        {/* Layer 0: Instant lightweight frame-0 poster so fresh load never flashes blank */}
        <Image
          src="/hero/street-dogs-poster.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover pointer-events-none select-none"
        />

        {/* Layer 1: Background video (loaded only when WebCodecs bank is unavailable) */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster="/hero/street-dogs-poster.jpg"
          muted
          playsInline
          preload={fallbackActive ? "auto" : "none"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Layer 2: Pre-decoded smooth WebCodecs frame canvas */}
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            canvasLive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Layer 3: Section Navigation & Sequential Beats (CSS vars avoid React re-render churn) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={
            {
              "--s1": "1",
              "--s2": "0",
              "--s3": "0",
            } as React.CSSProperties
          }
        >
          {/* Subtle top canopy gradient so section nav stays legible against foliage & sky gaps */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-36"
            style={{
              background:
                "linear-gradient(180deg, rgba(11, 24, 13, 0.72) 0%, rgba(11, 24, 13, 0.28) 60%, transparent 100%)",
            }}
          />

          {/* Top Bar inside sticky viewport */}
          <nav
            aria-label="Section Progress Navigation"
            className="absolute top-0 left-0 right-0 z-40 pointer-events-auto px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 flex items-center justify-between transition-colors duration-500"
            style={{ color: navColor }}
          >
            {/* Mobile Hamburger (<lg) */}
            <button
              type="button"
              className="lg:hidden flex flex-col gap-[5px] py-2 cursor-pointer"
              aria-label="Open section menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span
                className="block w-[24px] h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="block w-[24px] h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="block w-[16px] h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
            </button>

            {/* Desktop lg+ left story beat chapters */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map((item, i) => {
                const isActive = stage.activeStep === item.stepIdx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => scrollToProgress(item.target)}
                    className={`relative text-[11px] tracking-[0.14em] uppercase font-medium transition-opacity cursor-pointer ${
                      isActive
                        ? "opacity-100"
                        : "opacity-65 hover:opacity-100"
                    }`}
                    style={{
                      opacity: navReady ? (isActive ? 1 : 0.65) : 0,
                      transform: navReady ? "translateY(0)" : "translateY(-12px)",
                      transition:
                        "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      transitionDelay: `${i * 80 + 100}ms`,
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 -bottom-2.5 h-[2px] transition-colors duration-500"
                        style={{ backgroundColor: navColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right cluster (hidden below sm) */}
            <div
              className="hidden sm:flex items-center gap-6 relative"
              onMouseEnter={() => setCharterOpen(true)}
              onMouseLeave={() => setCharterOpen(false)}
              style={{
                opacity: navReady ? 1 : 0,
                transform: navReady ? "translateY(0)" : "translateY(-12px)",
                transition:
                  "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: "500ms",
              }}
            >
              <button
                type="button"
                onClick={() => setCharterOpen((prev) => !prev)}
                onFocus={() => setCharterOpen(true)}
                className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity cursor-pointer"
                aria-expanded={charterOpen}
              >
                <span>MISSION</span>
                <span
                  className="w-[20px] h-[20px] rounded-full flex items-center justify-center transition-colors duration-500"
                  style={{
                    backgroundColor: navColor,
                    color: DARK,
                  }}
                >
                  <Info size={10} />
                </span>
              </button>

              {charterOpen && (
                <div
                  role="dialog"
                  aria-label="Founding Mission Charter Summary"
                  className="absolute top-full right-0 pt-2 z-30"
                >
                  <div
                    className="w-72 rounded-xl p-4 text-left shadow-xl border"
                    style={{
                      backgroundColor: "#FAFFFD",
                      borderColor: "#B2DCB3",
                      color: DARK,
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#4B714C] font-semibold mb-1.5">
                      Founding Mission
                    </p>
                    <p className="text-xs leading-relaxed text-[#152916]/85">
                      Connecting allied shelters for shared recovery beds,
                      driving emergency vet triage &amp; ABC sterilisations,
                      and building NPIA&rsquo;s first permanent sanctuary.
                    </p>
                    <Link
                      href="/about#charter"
                      className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F4D37] underline underline-offset-4 hover:opacity-80"
                    >
                      Read Founding Charter &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Beat 1: Left aligned — Street Reality */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32 pb-12 sm:pb-16"
            style={{
              opacity: "var(--s1)",
              transition: "opacity 0.1s ease-out",
              pointerEvents: stage.v1 ? "auto" : "none",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(11, 24, 13, 0.78) 0%, rgba(11, 24, 13, 0.44) 48%, transparent 78%)",
              }}
            />

            <div className="relative z-10 max-w-3xl">
              <Stagger visible={stage.v1} delay={0}>
                <h2
                  className="font-light uppercase leading-[1.2]"
                  style={{
                    fontSize: "clamp(2rem, 4.8vw, 4.5rem)",
                    color: LIGHT,
                    textShadow: "0 2px 18px rgba(10, 22, 12, 0.55)",
                  }}
                >
                  Every street deserves a safe recovery space
                </h2>
              </Stagger>

              <Stagger visible={stage.v1} delay={150}>
                <p
                  className="mt-6 text-sm tracking-[0.3em] uppercase"
                  style={{
                    color: "#B2DCB3",
                    textShadow: "0 2px 14px rgba(10, 22, 12, 0.65)",
                  }}
                >
                  Road injuries · Hunger · Untreated illness
                </p>
              </Stagger>
            </div>

            <Stagger
              visible={stage.v1}
              delay={300}
              className="z-10 absolute bottom-12 right-6 sm:right-8 md:right-12"
            >
              <button
                type="button"
                onClick={() => scrollToProgress(0.44)}
                aria-label="Scroll to Networked Care"
                className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                style={{
                  border: "1px solid rgba(250, 255, 253, 0.5)",
                  color: LIGHT,
                  backgroundColor: "rgba(11, 24, 13, 0.25)",
                }}
              >
                <ArrowRight size={18} />
              </button>
            </Stagger>
          </div>

          {/* Beat 2: Upper-centered over foliage — Active On-Ground Response (keeps volunteers & feeding dogs clear) */}
          <div
            className="absolute inset-0 flex items-start justify-center pt-24 sm:pt-28 md:pt-32 px-6 sm:px-8"
            style={{
              opacity: "var(--s2)",
              transition: "opacity 0.1s ease-out",
              pointerEvents: stage.v2 ? "auto" : "none",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(11, 24, 13, 0.80) 0%, rgba(11, 24, 13, 0.44) 44%, transparent 70%)",
              }}
            />

            <div className="relative z-10 max-w-[900px] text-center">
              <Stagger visible={stage.v2} delay={0}>
                <h2
                  className="font-extralight tracking-wide leading-[1.3] text-center uppercase"
                  style={{
                    fontSize: "clamp(1.45rem, 3.6vw, 3.35rem)",
                    color: LIGHT,
                    textShadow: "0 2px 20px rgba(10, 22, 12, 0.65)",
                  }}
                >
                  We respond today by{" "}
                  <span style={{ color: "#E2FFE4" }}>
                    pooling partner shelter beds,
                  </span>{" "}
                  <span style={{ color: "#B2DCB3" }}>
                    vet triage &amp; ABC drives
                  </span>
                </h2>
              </Stagger>
            </div>

            <div className="z-10 absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
              <Stagger visible={stage.v2} delay={200}>
                <button
                  type="button"
                  onClick={() => scrollToProgress(0.84)}
                  aria-label="Scroll to The Sanctuary"
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                  style={{
                    border: "1px solid rgba(250, 255, 253, 0.45)",
                    color: LIGHT,
                    backgroundColor: "rgba(11, 24, 13, 0.25)",
                  }}
                >
                  <ArrowDown size={18} />
                </button>
              </Stagger>

              <Stagger visible={stage.v2} delay={350}>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    aria-label="Jump to Street Reality"
                    onClick={() => scrollToProgress(0.04)}
                    className="w-[6px] h-[6px] rounded-full cursor-pointer"
                    style={{ backgroundColor: "rgba(250, 255, 253, 0.45)" }}
                  />
                  <button
                    type="button"
                    aria-label="Jump to Networked Care"
                    onClick={() => scrollToProgress(0.44)}
                    className="w-[8px] h-[8px] rounded-full cursor-pointer"
                    style={{ backgroundColor: LIGHT }}
                  />
                  <button
                    type="button"
                    aria-label="Jump to The Sanctuary"
                    onClick={() => scrollToProgress(0.85)}
                    className="w-[6px] h-[6px] rounded-full cursor-pointer"
                    style={{ backgroundColor: "rgba(250, 255, 253, 0.45)" }}
                  />
                </div>
              </Stagger>

              <Stagger visible={stage.v2} delay={500} className="mt-2">
                <button
                  type="button"
                  onClick={() => scrollToProgress(0.04)}
                  aria-label="Scroll back up to Street Reality"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                  style={{
                    border: "1px solid rgba(250, 255, 253, 0.35)",
                    color: "rgba(250, 255, 253, 0.85)",
                    backgroundColor: "rgba(11, 24, 13, 0.25)",
                  }}
                >
                  <ChevronUp size={16} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* Beat 3: Right aligned — The Flagship Sanctuary (Evening Sanctuary Frames) */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32 pb-14 sm:pb-20"
            style={{
              opacity: "var(--s3)",
              transition: "opacity 0.1s ease-out",
              pointerEvents: stage.v3 ? "auto" : "none",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(270deg, rgba(11, 24, 13, 0.82) 0%, rgba(11, 24, 13, 0.46) 46%, transparent 76%)",
              }}
            />

            <div className="relative z-10 max-w-xl text-left">
              <Stagger visible={stage.v3} delay={0}>
                <p
                  className="text-[#B2DCB3] text-lg tracking-wide mb-4 uppercase"
                  style={{ textShadow: "0 2px 14px rgba(10, 22, 12, 0.65)" }}
                >
                  The Next Leap | NPIA Flagship Shelter
                </p>
              </Stagger>

              <Stagger visible={stage.v3} delay={150}>
                <h2
                  className="font-light text-[#FAFFFD] leading-[1.2] uppercase tracking-wide mb-8"
                  style={{
                    fontSize: "clamp(1.85rem, 3.8vw, 3.75rem)",
                    textShadow: "0 2px 20px rgba(10, 22, 12, 0.65)",
                  }}
                >
                  When partner beds fill up,
                  <br />
                  we need our own sanctuary.
                </h2>
              </Stagger>

              <Stagger visible={stage.v3} delay={300}>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-4 group"
                >
                  <span
                    className="text-sm tracking-[0.3em] text-[#E2FFE4] uppercase group-hover:text-white transition-colors"
                    style={{ textShadow: "0 2px 14px rgba(10, 22, 12, 0.65)" }}
                  >
                    Fund the Sanctuary &amp; Rescue Hub
                  </span>
                  <span
                    className="w-10 h-10 rounded-full bg-[#FAFFFD] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ color: DARK }}
                  >
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="NPIA Section Menu"
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: DARK }}
      >
        <div
          className={`h-full flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            menuOpen ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          <div className="flex justify-end px-6 sm:px-8 pt-8 sm:pt-12">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close section menu"
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col px-8 sm:px-12 my-auto">
            {navItems.map((item, i) => {
              const isActive = stage.activeStep === item.stepIdx;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToProgress(item.target);
                  }}
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                    transition:
                      "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                  className={`text-left py-3 text-2xl sm:text-3xl font-light tracking-wide uppercase transition-colors cursor-pointer ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 px-8 sm:px-12 pb-20 sm:pb-10 text-xs tracking-[0.2em] uppercase text-white/60">
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              ABOUT NPIA
            </Link>
            <Link
              href="/contact-us"
              onClick={() => setMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              CONTACT
            </Link>
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="text-[#B2DCB3] hover:text-white transition-colors"
            >
              DONATE
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
