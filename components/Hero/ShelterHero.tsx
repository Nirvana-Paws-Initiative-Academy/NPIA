/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import "./ShelterHero.css";

type TimeMode = 0 | 1; // 0 = Clear Day, 1 = Monsoon Storm

const SINK_MS = 240;
const RISE_MS = 820;
const DEPTH = 0;

const VERT_SHADER = `#version 300 es
precision highp float;
const vec2 P[3] = vec2[](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);
void main() {
  gl_Position = vec4(P[gl_VertexID], 0.0, 1.0);
}`;

const FRAG_SHADER = `#version 300 es
precision highp float;
uniform vec2 R;
uniform float T;
uniform float S;
uniform float K;
out vec4 O;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float a = 0.5;
  float v = 0.0;
  mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 rawUv = gl_FragCoord.xy / R;
  vec2 p = vec2(rawUv.x, 1.0 - rawUv.y);
  vec2 q = vec2(p.x * (R.x / max(R.y, 1.0)), p.y);

  float low = fbm(q * vec2(2.1, 3.4) + vec2(T * 0.024, -T * 0.011));
  float side = fbm(q * vec2(4.2, 5.8) + vec2(-T * 0.036, T * 0.014) + low * 1.15);
  float wisps = smoothstep(0.28, 0.82, low * 0.64 + side * 0.36);

  // At rest (S = 0), mist stays low near the grass; at peak surge (S = 1),
  // dense fog swells up over the sunken roof (above y = 0.45) to hide the swap.
  float front = 0.98 - S * 0.72;
  float rise = smoothstep(front - 0.16, front + 0.22, p.y);
  float haze = smoothstep(0.14, 0.92, p.y) * S * 0.55;

  // Ambient rain-mist near street curb at rest + sweeping veil across the frame when S -> 1
  float restMist = smoothstep(0.76, 1.0, p.y) * (0.10 + wisps * 0.20);
  float surgeMist = rise * mix(0.45 + wisps * 0.55, 1.0, smoothstep(0.45, 0.98, S));
  float alpha = clamp(mix(restMist, max(surgeMist, haze), S), 0.0, 1.0);

  // NPIA forest & monsoon mist palette (natural outdoor daylight & storm tones)
  vec3 dayA = vec3(0.95, 0.99, 0.96);
  vec3 dayB = vec3(0.74, 0.85, 0.77);
  vec3 nitA = vec3(0.24, 0.36, 0.30);
  vec3 nitB = vec3(0.06, 0.12, 0.10);

  vec3 dayCol = mix(dayB, dayA, clamp(wisps * 0.85 + 0.15, 0.0, 1.0));
  vec3 nitCol = mix(nitB, nitA, clamp(wisps * 0.82 + 0.08, 0.0, 1.0));
  vec3 col = mix(dayCol, nitCol, K);

  O = vec4(col * alpha, alpha);
}`;

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

export default function ShelterHero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<TimeMode>(1); // Starts on Monsoon Storm (1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const transitionTriggerRef = useRef<((to: TimeMode) => void) | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize WebGL2 fog shader
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });

    let prog: WebGLProgram | null = null;
    let uR: WebGLUniformLocation | null = null;
    let uT: WebGLUniformLocation | null = null;
    let uS: WebGLUniformLocation | null = null;
    let uK: WebGLUniformLocation | null = null;
    let vao: WebGLVertexArrayObject | null = null;

    if (gl) {
      const compile = (type: number, src: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compile(gl.VERTEX_SHADER, VERT_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG_SHADER);
      if (vs && fs) {
        prog = gl.createProgram();
        if (prog) {
          gl.attachShader(prog, vs);
          gl.attachShader(prog, fs);
          gl.linkProgram(prog);
          if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            uR = gl.getUniformLocation(prog, "R");
            uT = gl.getUniformLocation(prog, "T");
            uS = gl.getUniformLocation(prog, "S");
            uK = gl.getUniformLocation(prog, "K");
            vao = gl.createVertexArray();
          } else {
            gl.deleteProgram(prog);
            prog = null;
          }
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    const sizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const maxW = 960;
      const targetW = Math.min(maxW, Math.max(1, Math.round(rect.width * dpr)));
      const targetH = Math.max(
        1,
        Math.round(targetW * (rect.height / Math.max(1, rect.width)))
      );
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // Single-clock animation state
    let curK = 1;
    let curK2 = 1;
    let curSlide = 1;
    let curS = 0;
    let curSink = 0;
    let curDip = 0;
    let activeMode: TimeMode = 1;

    let animating = false;
    let animStart = 0;
    let fromMode: TimeMode = 1;
    let toMode: TimeMode = 1;
    let queuedMode: TimeMode | null = null;
    let swapped = false;

    const SLIDE_MS = 460;
    let slideAnimating = false;
    let slideStart = 0;
    let slideFrom = 1;
    let slideTo: TimeMode = 1;

    const applyVars = (
      k: number,
      k2: number,
      slide: number,
      dip: number,
      sink: number
    ) => {
      hero.style.setProperty("--k", k.toFixed(4));
      hero.style.setProperty("--k2", k2.toFixed(4));
      hero.style.setProperty("--slide", slide.toFixed(4));
      hero.style.setProperty("--dip", dip.toFixed(4));
      hero.style.setProperty("--sink", sink.toFixed(4));
    };

    applyVars(1, 1, 1, 0, 0);

    const startSlide = (target: TimeMode) => {
      slideFrom = curSlide;
      slideTo = target;
      slideStart = performance.now();
      slideAnimating = true;
    };

    const startTransition = (target: TimeMode) => {
      if (prefersReducedMotion) {
        activeMode = target;
        curK = target;
        curK2 = target;
        curSlide = target;
        curS = 0;
        curSink = 0;
        curDip = 0;
        animating = false;
        slideAnimating = false;
        queuedMode = null;
        setMode(target);
        applyVars(curK, curK2, curSlide, curDip, curSink);
        return;
      }

      if (animating) {
        if (target !== toMode) {
          queuedMode = target;
          startSlide(target);
          setMode(target);
        } else if (queuedMode !== null) {
          queuedMode = null;
          startSlide(target);
          setMode(target);
        }
        return;
      }

      if (target === activeMode) return;

      fromMode = activeMode;
      toMode = target;
      setMode(target);
      startSlide(target);
      animating = true;
      swapped = false;
      animStart = performance.now();
    };

    transitionTriggerRef.current = startTransition;

    let rafId = 0;
    let isVisible = true;

    const render = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }

      let dirtyVars = false;

      if (slideAnimating) {
        const sp = Math.min(1, (now - slideStart) / SLIDE_MS);
        const ease = 1 - Math.pow(1 - sp, 3.4);
        curSlide = slideFrom + (slideTo - slideFrom) * ease;
        dirtyVars = true;
        if (sp >= 1) {
          curSlide = slideTo;
          slideAnimating = false;
        }
      }

      if (animating) {
        const d = now - animStart;
        dirtyVars = true;

        if (d < SINK_MS) {
          const x = d / SINK_MS;
          curSink = easeInOut(x) * DEPTH;
          curS = Math.sin(x * Math.PI * 0.5);
          curDip = Math.sin(x * Math.PI * 0.5);
          const colorProgress = easeInOut(Math.min(1, d / (SINK_MS + RISE_MS * 0.55)));
          curK = fromMode + (toMode - fromMode) * colorProgress;
          curK2 = fromMode + (toMode - fromMode) * easeInOut(Math.min(1, d / (SINK_MS + RISE_MS * 0.35)));
        } else {
          if (!swapped) {
            swapped = true;
            activeMode = toMode;
          }

          const e = d - SINK_MS;
          if (e < RISE_MS) {
            const x = e / RISE_MS;
            curSink = Math.pow(1 - x, 3.4) * DEPTH;
            curS = Math.pow(1 - x, 1.5);
            curDip = Math.pow(1 - x, 1.8);
            const colorProgress = easeInOut(Math.min(1, d / (SINK_MS + RISE_MS * 0.55)));
            curK = fromMode + (toMode - fromMode) * colorProgress;
            curK2 = fromMode + (toMode - fromMode) * easeInOut(Math.min(1, d / (SINK_MS + RISE_MS * 0.35)));
          } else {
            curK = toMode;
            curK2 = toMode;
            curS = 0;
            curSink = 0;
            curDip = 0;
            animating = false;

            if (queuedMode !== null && queuedMode !== activeMode) {
              const nextTarget = queuedMode;
              queuedMode = null;
              startTransition(nextTarget);
            } else {
              queuedMode = null;
            }
          }
        }
      }

      if (dirtyVars) {
        applyVars(curK, curK2, curSlide, curDip, curSink);
      }

      if (gl && prog && vao) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.bindVertexArray(vao);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, now * 0.001);
        gl.uniform1f(uS, curS);
        gl.uniform1f(uK, curK);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      rafId = isVisible ? requestAnimationFrame(render) : 0;
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (!isVisible && rafId !== 0) {
                cancelAnimationFrame(rafId);
                rafId = 0;
              } else if (isVisible && rafId === 0) {
                rafId = requestAnimationFrame(render);
              }
            },
            { threshold: 0.01 }
          )
        : null;
    observer?.observe(hero);

    rafId = requestAnimationFrame(render);

    return () => {
      observer?.disconnect();
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", sizeCanvas);
      transitionTriggerRef.current = null;
      if (gl) {
        if (vao) gl.deleteVertexArray(vao);
        if (prog) gl.deleteProgram(prog);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleToggle = (target: TimeMode) => {
    transitionTriggerRef.current?.(target);
  };

  return (
    <section ref={heroRef} className="hero" aria-label="NPIA Connected Rescue Network and Sanctuary Hero">
      {/* Layer 1: Pixel-locked Street Reality Scenes (Clear Day <-> Monsoon Storm) */}
      <div className="layer street-scene" aria-hidden="true">
        <img
          className="m"
          src="/hero/street-clear.jpg"
          alt="An Indian street dog crouching quietly for shade underneath a weathered rusted tin sheet leaned against a concrete roadside wall"
        />
        <img
          className="n"
          src="/hero/street-storm.jpg"
          alt="The same Indian street dog sheltering beneath the rusted tin overhang during a heavy monsoon downpour with puddles on cracked concrete"
        />
        <div className="tilt" />
      </div>

      {/* Subtle daylight top wash so dark ink reads cleanly in Clear Day mode */}
      <div className="day-scrim" aria-hidden="true" />

      {/* Layer 2: Live WebGL2 Volumetric Rain Mist */}
      <canvas id="fog" ref={canvasRef} aria-hidden="true" />

      {/* UI Layer above fog */}
      <div className="ui">
        <header className="bar">
          <Link href="/" className="logo" aria-label="NPIA Home">
            NPIA<span className="logo-dot" aria-hidden="true">.</span>
          </Link>

          <nav aria-label="Primary Navigation">
            <ul className="links">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/partner-network">Partner Network</Link>
              </li>
              <li>
                <Link href="/donate">Donate</Link>
              </li>
            </ul>
          </nav>

          <div className="side">
            <Link href="/contact-us" className="cta cta-outline">
              Contact Us
            </Link>
            <button
              type="button"
              className="menu-btn"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="hero-mobile-drawer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </header>

        <h1>
          <span className="hero-lead">
            <Link
              href="/about#charter"
              className="hero-charter-link"
              title="Read NPIA's Founding Charter & Objectives"
            >
              Founding Mission
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link
              href="/roadmap"
              className="hero-charter-link"
              title="Explore NPIA's 4-Stage Sanctuary Roadmap"
            >
              The Sanctuary Roadmap
            </Link>
          </span>
          <span className="hero-main">
            <strong>A safe sanctuary</strong> for{" "}
            <span className="y">every street animal</span>
          </span>
        </h1>

        <div className="dock">
          <div className="dock-controls">
            <div className="toggle" role="group" aria-label="Street animal weather view">
              <span className="toggle-thumb" aria-hidden="true" />
              <button
                id="bm"
                type="button"
                className={mode === 0 ? "is-on" : undefined}
                aria-pressed={mode === 0}
                style={{ ["--on" as string]: "calc(1 - var(--slide, 1))" }}
                onClick={() => handleToggle(0)}
              >
                <b>Clear Day</b>
                <small>Street Reality</small>
              </button>
              <button
                id="bn"
                type="button"
                className={mode === 1 ? "is-on" : undefined}
                aria-pressed={mode === 1}
                style={{ ["--on" as string]: "var(--slide, 1)" }}
                onClick={() => handleToggle(1)}
              >
                <b>Monsoon Storm</b>
                <small>Why We Build</small>
              </button>
            </div>

            <Link href="/donate" className="dock-cta">
              <span className="dock-cta-text">
                <b>Donate Now</b>
                <small>Fund a Bed &amp; Build the Sanctuary</small>
              </span>
              <svg
                className="dock-cta-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <p className="cap">
            Unlocking partner shelter beds &amp; emergency vet care today&mdash;while building NPIA&rsquo;s flagship sanctuary.
          </p>
        </div>
      </div>

      {mobileMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="hero-mobile-drawer"
            className="hero-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <Link
              href="/"
              className="drawer-brand"
              aria-label="NPIA Home"
              onClick={() => setMobileMenuOpen(false)}
            >
              NPIA<span className="drawer-brand-dot" aria-hidden="true">.</span>
            </Link>
            <button
              type="button"
              className="close-btn"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              &times;
            </button>
            <div className="drawer-links">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/roadmap" onClick={() => setMobileMenuOpen(false)}>
                The Sanctuary Roadmap
              </Link>
              <Link href="/partner-network" onClick={() => setMobileMenuOpen(false)}>
                Partner Network
              </Link>
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                Donate
              </Link>
              <Link href="/contact-us" className="cta" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </Link>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
