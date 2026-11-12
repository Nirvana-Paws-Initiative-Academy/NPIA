"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, HeartHandshake, Wand2 } from "lucide-react";
import "./DonateExperience.css";

type CauseId = "shelter" | "care" | "rescue";
type Frequency = "monthly" | "one-off";

interface CauseConfig {
  id: CauseId;
  label: string;
  stageRef: string;
  subtitle: string;
  amounts: [number, number, number];
  impactByAmount: Record<number, string>;
}

const CAUSES: Record<CauseId, CauseConfig> = {
  shelter: {
    id: "shelter",
    label: "For Shelter",
    stageRef: "Stage 01 & Stage 03 · Shared Kennels & Sanctuary Build",
    subtitle: "Pool shared recovery beds today while funding our permanent sanctuary.",
    amounts: [500, 1500, 5000],
    impactByAmount: {
      500: "₹500 could sponsor a safe partner kennel bed and clean bedding for a rescued dog.",
      1500: "₹1,500 could fund three recovery beds and quarantine intake across allied NGOs.",
      5000: "₹5,000 contributes toward permanent kennel architecture at NPIA's flagship sanctuary.",
    },
  },
  care: {
    id: "care",
    label: "For Care",
    stageRef: "Stage 02 & Stage 04 · Nursing, ABC & Transition Care",
    subtitle: "Sustain vaccinations, medication, post-op nursing, and foster transition.",
    amounts: [500, 1200, 3500],
    impactByAmount: {
      500: "₹500 could provide essential pain relief and deworming during shelter intake.",
      1200: "₹1,200 could cover vital medication and sterile dressings through recovery.",
      3500: "₹3,500 could support full vaccination, nutrition, and 30-day transition support.",
    },
  },
  rescue: {
    id: "rescue",
    label: "For Rescue",
    stageRef: "Stage 02 · Zonal Emergency Dispatch & Trauma Triage",
    subtitle: "Power rapid street response vans, accident stabilization, and ABC drives.",
    amounts: [750, 2000, 5000],
    impactByAmount: {
      750: "₹750 could equip a first-responder field kit for urgent street rescues.",
      2000: "₹2,000 could fuel an emergency ambulance relay and critical vet triage.",
      5000: "₹5,000 could subsidize trauma surgery and humane sterilization outreach.",
    },
  },
};

export default function DonateExperience() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [cause, setCause] = useState<CauseId>("shelter");
  const [selectedPreset, setSelectedPreset] = useState<number>(1500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Support optional ?stage=stage-1..4 deep links from /roadmap
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const stageParam = params.get("stage");
    if (stageParam === "stage-2") {
      setCause("rescue");
      setSelectedPreset(CAUSES.rescue.amounts[1]);
    } else if (stageParam === "stage-4") {
      setCause("care");
      setSelectedPreset(CAUSES.care.amounts[1]);
    } else if (stageParam === "stage-1" || stageParam === "stage-3") {
      setCause("shelter");
      setSelectedPreset(CAUSES.shelter.amounts[1]);
    }
  }, []);

  // Respect prefers-reduced-motion on looping background video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) {
        vid.pause();
      } else {
        vid.play().catch(() => {});
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const currentCause = CAUSES[cause];

  const handleCauseSelect = (nextCause: CauseId) => {
    setCause(nextCause);
    setSelectedPreset(CAUSES[nextCause].amounts[1]);
    setCustomAmount("");
  };

  const handlePresetClick = (amt: number) => {
    setSelectedPreset(amt);
    setCustomAmount("");
  };

  const activeAmount = useMemo(() => {
    const numericCustom = Number(customAmount.replace(/[^\d]/g, ""));
    if (customAmount.trim() !== "" && numericCustom > 0) {
      return numericCustom;
    }
    return selectedPreset;
  }, [customAmount, selectedPreset]);

  const activeImpactLine = useMemo(() => {
    const presetLine = currentCause.impactByAmount[selectedPreset];
    if (customAmount.trim() !== "" && activeAmount > 0) {
      return `₹${activeAmount.toLocaleString(
        "en-IN"
      )} (${frequency}) will go directly toward ${currentCause.label.toLowerCase()} — ${currentCause.subtitle.toLowerCase()}`;
    }
    return presetLine;
  }, [activeAmount, currentCause, customAmount, frequency, selectedPreset]);

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    let pledgeRef = "";
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frequency,
          cause,
          causeLabel: currentCause.label,
          stageRef: currentCause.stageRef,
          amountInr: activeAmount,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { pledgeRef?: string };
        if (data.pledgeRef) pledgeRef = data.pledgeRef;
      }
    } catch {
      // Proceed cleanly even if database logging is temporarily unreachable
    } finally {
      setSubmitting(false);
    }

    const formattedAmt = activeAmount.toLocaleString("en-IN");
    const refNote = pledgeRef ? ` [Ref: ${pledgeRef}]` : "";
    const brief = `Hi NPIA, I would like to contribute ₹${formattedAmt} (${frequency}) ${currentCause.label} (${currentCause.stageRef}).${refNote} Please share verified donation instructions and receipt details.`;
    router.push(`/contact-us?type=donate&brief=${encodeURIComponent(brief)}`);
  };

  return (
    <section
      className="donate-shell relative w-full lg:h-[calc(100svh-76px)] lg:max-h-[calc(100svh-76px)] lg:overflow-hidden flex overflow-x-clip"
      aria-label="NPIA Donations"
    >
      {/* Full-Screen Autoplaying, Looping, Muted Local Video Background in Natural Color */}
      <video
        ref={videoRef}
        src="/partner-hub/caretaker-loop.mp4"
        poster="/about/pillar-network.jpg"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      {/* Deep NPIA Sanctuary Green Scrim for high legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(115deg,rgba(11,28,14,0.72)_0%,rgba(16,33,17,0.56)_52%,rgba(11,28,14,0.74)_100%)]"
      />
      {/* Seamless bottom melt into dark-top footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 z-[1] bg-gradient-to-b from-transparent to-[#0B1C0E]"
      />

      {/* TWO-PANEL SPLIT FOREGROUND */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row">
        {/* LEFT PANEL (52% desktop): Donation Card matching reference template */}
        <div className="w-full lg:w-[52%] p-3 sm:p-4 lg:p-5 flex flex-col min-h-0">
          <div className="liquid-glass-strong relative flex-1 rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-0">
            {/* Compact Top Row: Logo */}
            <div className="relative flex items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 hover:scale-105 transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/NPIA.png"
                  alt="NPIA logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain rounded-full bg-[#FAFFFD]/95 p-0.5"
                />
                <span className="font-semibold text-xl tracking-tight text-[#FAFFFD]">
                  NPIA<span className="text-[#4AA552]">.</span>
                </span>
              </Link>
            </div>

            {/* Donation Form Core matching template layout cleanly in NPIA palette */}
            <form
              onSubmit={handleDonateSubmit}
              className="w-full max-w-[490px] mx-auto my-auto py-2 flex flex-col gap-3"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.06] tracking-[-0.03em] text-[#FAFFFD]">
                  Donate <em className="text-[#B2DCB3] font-normal">today</em>
                </h1>
                <p className="text-xs sm:text-sm text-[#E2FFE4]/85 mt-1.5 leading-snug">
                  Your gift makes an immediate difference for street animals needing
                  safe shelter, veterinary care, and urgent rescue.
                </p>
              </div>

              {/* 1. Monthly / One-off Switcher */}
              <div
                role="radiogroup"
                aria-label="Donation frequency"
                className="liquid-glass rounded-xl p-1 grid grid-cols-2 gap-1"
              >
                {(["monthly", "one-off"] as const).map((mode) => {
                  const active = frequency === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFrequency(mode)}
                      className={`py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all cursor-pointer ${
                        active
                          ? "bg-[#E2FFE4] text-[#0B1C0E] shadow-sm"
                          : "text-[#E2FFE4]/85 hover:text-[#FAFFFD]"
                      }`}
                    >
                      {mode === "monthly" ? "Monthly" : "One-off"}
                    </button>
                  );
                })}
              </div>

              {/* 2. Three Fund Options: For Shelter / For Care / For Rescue */}
              <div
                role="radiogroup"
                aria-label="Select cause"
                className="grid grid-cols-3 gap-2"
              >
                {(Object.values(CAUSES) as CauseConfig[]).map((item) => {
                  const active = cause === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => handleCauseSelect(item.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#B2DCB3] text-[#0B1C0E] font-semibold"
                          : "liquid-glass text-[#FAFFFD]/90 hover:scale-[1.02]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* 3. Three Amount Presets with active downward notch */}
              <div
                role="radiogroup"
                aria-label="Select amount in INR"
                className="grid grid-cols-3 gap-2"
              >
                {currentCause.amounts.map((amt) => {
                  const active =
                    customAmount.trim() === "" && selectedPreset === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => handlePresetClick(amt)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? "bg-[#E2FFE4] text-[#0B1C0E] donate-notch"
                          : "liquid-glass text-[#FAFFFD] hover:scale-[1.02]"
                      }`}
                    >
                      &#8377;{amt.toLocaleString("en-IN")}
                    </button>
                  );
                })}
              </div>

              {/* Impact readout */}
              <p className="text-xs text-[#E2FFE4]/90 leading-relaxed min-h-[2.25rem] pt-0.5">
                {activeImpactLine}
              </p>

              {/* 4. Other amount input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="npia-other-amount"
                  className="text-xs font-medium text-[#B2DCB3]"
                >
                  Other amount
                </label>
                <div className="rounded-xl bg-[#FAFFFD] text-[#0B1C0E] px-3.5 py-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#245736]">
                    &#8377;
                  </span>
                  <input
                    id="npia-other-amount"
                    type="text"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-transparent text-sm font-medium text-[#0B1C0E] placeholder:text-[#4B714C]/60 outline-none"
                  />
                </div>
              </div>

              {/* 5. High-contrast Donate CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#B2DCB3] hover:bg-[#E2FFE4] text-[#0B1C0E] text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting
                  ? "Recording pledge..."
                  : `Donate ₹${activeAmount.toLocaleString("en-IN")} now`}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL (48% desktop): Kept editorial lines + 3 goal/donation cards */}
        <div className="w-full lg:w-[48%] p-3 sm:p-4 lg:p-5 lg:pl-1 flex flex-col justify-between gap-3 min-h-0">
          {/* Preserved Editorial Lines & Charter Quote */}
          <div className="liquid-glass rounded-3xl px-6 py-5 flex flex-col justify-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-[2.15rem] leading-[1.08] tracking-[-0.03em] text-[#FAFFFD]">
              Sustaining the spirit of{" "}
              <em className="text-[#B2DCB3] font-normal">rescue</em> aid
            </h2>

            <div className="flex flex-col gap-1 pt-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#B2DCB3]/85">
                VISIONARY SHELTER
              </p>
              <p className="text-sm sm:text-base text-[#FAFFFD]/95">
                We imagined a realm{" "}
                <em className="font-serif-accent italic text-[#E2FFE4]">
                  with no ending
                </em>{" "}
                of care.
              </p>
              <div className="mt-1 flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase text-[#B2DCB3]/80">
                <span className="h-px w-8 bg-[#B2DCB3]/40" aria-hidden="true" />
                <span>NPIA CHARTER</span>
                <span className="h-px w-8 bg-[#B2DCB3]/40" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Right Bottom Feature Container: Rescue Donations, Care Donations, Shelter Supporters Goal */}
          <div className="mt-auto liquid-glass rounded-[2rem] p-3.5 sm:p-4 flex flex-col gap-3">
            {/* Two side-by-side cards: Rescue Donations + Care Donations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCauseSelect("rescue")}
                className={`liquid-glass rounded-2xl p-3.5 text-left hover:scale-[1.02] transition-transform cursor-pointer ${
                  cause === "rescue" ? "bg-[#245736]/60" : ""
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-[#E2FFE4]/15 flex items-center justify-center text-[#E2FFE4]">
                  <Wand2 className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="text-sm text-[#FAFFFD] mt-2.5">
                  Rescue Donations
                </h3>
                <p className="text-xs text-[#E2FFE4]/75 mt-1 leading-relaxed">
                  24/7 trauma dispatch, road-accident triage, and humane ABC field vans.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleCauseSelect("care")}
                className={`liquid-glass rounded-2xl p-3.5 text-left hover:scale-[1.02] transition-transform cursor-pointer ${
                  cause === "care" ? "bg-[#245736]/60" : ""
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-[#E2FFE4]/15 flex items-center justify-center text-[#E2FFE4]">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="text-sm text-[#FAFFFD] mt-2.5">
                  Care Donations
                </h3>
                <p className="text-xs text-[#E2FFE4]/75 mt-1 leading-relaxed">
                  Post-op nursing, nutrition, vaccinations, and 30-day foster transitions.
                </p>
              </button>
            </div>

            {/* Bottom Wide Card: Shelter Supporters Goal */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleCauseSelect("shelter")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCauseSelect("shelter");
                }
              }}
              className={`liquid-glass rounded-2xl p-3 flex items-center justify-between gap-3.5 hover:scale-[1.01] transition-transform cursor-pointer ${
                cause === "shelter" ? "bg-[#245736]/60" : ""
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Puppies_resting_at_animal_shelter_296b8c41.jpg"
                  alt="Puppies resting in shelter recovery"
                  width={96}
                  height={64}
                  className="w-20 sm:w-24 h-14 sm:h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <HeartHandshake
                      className="w-3.5 h-3.5 text-[#B2DCB3] shrink-0"
                      aria-hidden="true"
                    />
                    <h3 className="text-sm text-[#FAFFFD] truncate">
                      Shelter Supporters Goal
                    </h3>
                  </div>
                  <p className="text-xs text-[#E2FFE4]/75 mt-0.5 line-clamp-2">
                    Supporting 10+ allied shelters today while building NPIA&apos;s
                    flagship sanctuary campus.
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-[#E2FFE4]/15 flex items-center justify-center text-[#FAFFFD] text-base shrink-0"
              >
                +
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
