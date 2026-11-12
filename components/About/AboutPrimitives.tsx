"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface SpringConfig {
  tension: number;
  friction: number;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useSpringNumber(
  target: number,
  config: SpringConfig,
  disabled = false
): number {
  const [value, setValue] = useState(target);
  const stateRef = useRef({ x: target, v: 0, target });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current.target = target;
    if (disabled) {
      stateRef.current.x = target;
      stateRef.current.v = 0;
      setValue(target);
      return;
    }

    if (rafRef.current !== null) return;

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      const st = stateRef.current;
      const force = -config.tension * (st.x - st.target) - config.friction * st.v;
      st.v += force * dt;
      st.x += st.v * dt;

      if (Math.abs(st.v) < 0.001 && Math.abs(st.x - st.target) < 0.001) {
        st.x = st.target;
        st.v = 0;
        setValue(st.target);
        rafRef.current = null;
        return;
      }

      setValue(st.x);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [target, config.tension, config.friction, disabled]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return value;
}

export function useDesktopHover(): boolean {
  const [canHover, setCanHover] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const update = () => {
      setCanHover(
        !reduced &&
          window.innerWidth > 768 &&
          window.matchMedia("(hover: hover)").matches
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced]);

  return canHover;
}

export function useInViewOnce(threshold = 0.14) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown, threshold]);

  return { ref, shown };
}

export function ArrowSvg({
  className = "w-4 h-4",
  flip = false,
  offsetX = 0,
  scale = 1,
  opacity = 1,
}: {
  className?: string;
  flip?: boolean;
  offsetX?: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{
        opacity,
        transform: `${flip ? "scaleX(-1) " : ""}translate3d(${offsetX}px, 0, 0) scale(${scale})`,
      }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Eyebrow({
  label,
  tone = "dark",
}: {
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`about-eyebrow ${
        tone === "light" ? "text-white/75" : "text-[#4B6350]"
      }`}
    >
      <span
        className={`about-eyebrow-dot ${
          tone === "light" ? "bg-[#B2DCB3]" : "bg-[#245736]"
        }`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

export function StackedLines({
  lines,
  className = "",
  stagger = 120,
  baseDelay = 0,
  duration = 950,
  shown,
}: {
  lines: string[];
  className?: string;
  stagger?: number;
  baseDelay?: number;
  duration?: number;
  shown: boolean;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="about-clip-line">
          <span
            className={`about-clip-inner about-word-anim ${
              shown ? "is-shown" : ""
            } ${className}`}
            style={
              {
                "--reveal-dur": `${duration}ms`,
                "--reveal-delay": `${baseDelay + i * stagger}ms`,
              } as React.CSSProperties
            }
          >
            {line}
          </span>
        </span>
      ))}
    </>
  );
}

export function PillCta({
  href,
  label,
  variant = "solid",
}: {
  href: string;
  label: string;
  variant?: "light" | "solid" | "outline-light";
}) {
  const [hovered, setHovered] = useState(false);
  const canHover = useDesktopHover();
  const arrowX = useSpringNumber(
    hovered && canHover ? 5 : 0,
    { tension: 320, friction: 20 },
    !canHover
  );

  const toneClass =
    variant === "light"
      ? "bg-white text-[#152916] hover:bg-[#B2DCB3] hover:text-[#102111]"
      : variant === "outline-light"
      ? "border border-white/25 bg-transparent text-white hover:bg-white/10"
      : "bg-[#102111] text-white hover:bg-[#152916]";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`about-pill-btn ${toneClass}`}
    >
      <span>{label}</span>
      <ArrowSvg className="w-4 h-4 shrink-0" offsetX={arrowX} />
    </Link>
  );
}
