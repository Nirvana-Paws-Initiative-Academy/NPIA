"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Asterisk, Share2 } from "lucide-react";
import {
  BRIEF_TRACKS,
  PARTNER_BG_IMAGE,
  PARTNER_MOTES,
  PARTNER_PETALS,
  PARTNER_RING_CARDS,
  PARTNER_STATS,
  PARTNER_WORLDS,
  type PartnerRingCard,
  type PartnerWorldId,
  type SentenceChoiceId,
} from "@/lib/partnerNetworkData";
import "./PartnerRingExperience.css";

type ActiveView = "directory" | "join";

interface Vec2 {
  x: number;
  y: number;
}

const TOTAL_SLOTS = 16;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function usePrefersReducedMotion(): boolean {
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

/** Static sunlit misty pine forest photo + mist, petals, motes, and subtle grain (no background video). */
function PineForestBackdrop({
  reducedMotion,
  objectPosition,
  petalLayer,
  includeMotes = false,
  sceneLayerRef,
  backPetalsRef,
  mistLayerRef,
  motesLayerRef,
  frontPetalsRef,
}: {
  reducedMotion: boolean;
  objectPosition: string;
  petalLayer: "both" | "allBack";
  includeMotes?: boolean;
  sceneLayerRef?: React.RefObject<HTMLDivElement>;
  backPetalsRef?: React.RefObject<HTMLDivElement>;
  mistLayerRef?: React.RefObject<HTMLDivElement>;
  motesLayerRef?: React.RefObject<HTMLDivElement>;
  frontPetalsRef?: React.RefObject<HTMLDivElement>;
}) {
  const backPetals = PARTNER_PETALS.filter(
    (p) => petalLayer === "allBack" || p.layer === "back"
  );
  const frontPetals =
    petalLayer === "both"
      ? PARTNER_PETALS.filter((p) => p.layer === "front")
      : [];

  return (
    <>
      <div ref={sceneLayerRef} className="pn-scene-layer" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PARTNER_BG_IMAGE}
          alt=""
          className="pn-scene-img"
          style={{ objectPosition }}
        />
        {!reducedMotion && <div className="pn-scene-grain" />}
      </div>

      <div
        ref={backPetalsRef}
        className="pn-petals-layer pn-petals-back"
        aria-hidden="true"
      >
        {backPetals.map((petal, idx) => (
          <span
            key={`back-${idx}`}
            className={`pn-petal ${
              petal.variant === "white" ? "is-white" : "is-mint"
            } ${petal.mirrored ? "is-b" : "is-a"}`}
            style={{
              left: `${petal.left}%`,
              top: `${petal.top}%`,
              width: `${petal.width}px`,
              height: `${Math.round(petal.width * 0.62)}px`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
            }}
          />
        ))}
      </div>

      {includeMotes && (
        <>
          <div
            ref={mistLayerRef}
            className="pn-mist-layer"
            aria-hidden="true"
          />

          <div
            ref={motesLayerRef}
            className="pn-motes-layer"
            aria-hidden="true"
          >
            {PARTNER_MOTES.map((mote, idx) => (
              <span
                key={`mote-${idx}`}
                className="pn-mote"
                style={{
                  left: `${mote.left}%`,
                  top: `${mote.top}%`,
                  width: `${mote.size}px`,
                  height: `${mote.size}px`,
                  animationDuration: `${mote.duration}s`,
                  animationDelay: `${mote.delay}s`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {frontPetals.length > 0 && (
        <div
          ref={frontPetalsRef}
          className="pn-petals-layer pn-petals-front"
          aria-hidden="true"
        >
          {frontPetals.map((petal, idx) => (
            <span
              key={`front-${idx}`}
              className={`pn-petal ${
                petal.variant === "white" ? "is-white" : "is-mint"
              } ${petal.mirrored ? "is-b" : "is-a"}`}
              style={{
                left: `${petal.left}%`,
                top: `${petal.top}%`,
                width: `${petal.width}px`,
                height: `${Math.round(petal.width * 0.62)}px`,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

function MaskedWord({
  text,
  index,
  className = "",
}: {
  text: string;
  index: number;
  className?: string;
}) {
  return (
    <span className={`pn-word-mask ${className}`}>
      <span
        className="pn-word-inner"
        style={{ "--word-delay": `${50 + index * 35}ms` } as React.CSSProperties}
      >
        {text}
      </span>
    </span>
  );
}

export default function PartnerRingExperience() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();

  const [activeView, setActiveView] = useState<ActiveView>("directory");
  const [entered, setEntered] = useState(false);

  const [hoveredChoice, setHoveredChoice] = useState<SentenceChoiceId | null>(null);
  const [pinnedWorld, setPinnedWorld] = useState<PartnerWorldId | null>(null);
  const [previewPos, setPreviewPos] = useState<Vec2>({ x: -9999, y: -9999 });
  const [previewOrigin, setPreviewOrigin] = useState<string>("left bottom");
  const previewFlipRef = useRef<{ flipX: boolean; flipY: boolean }>({
    flipX: false,
    flipY: false,
  });

  const [slotSites, setSlotSites] = useState<number[]>(() =>
    Array.from({ length: TOTAL_SLOTS }, (_, i) => (i + 3) % PARTNER_RING_CARDS.length)
  );
  const slotSitesRef = useRef<number[]>(slotSites);

  const wallRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const tiltRefs = useRef<Array<HTMLDivElement | null>>([]);
  const faceRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const dirSceneRef = useRef<HTMLDivElement>(null);
  const dirBackPetalsRef = useRef<HTMLDivElement>(null);
  const dirMistRef = useRef<HTMLDivElement>(null);
  const dirMotesRef = useRef<HTMLDivElement>(null);
  const dirFrontPetalsRef = useRef<HTMLDivElement>(null);

  const joinSceneRef = useRef<HTMLDivElement>(null);
  const joinBackPetalsRef = useRef<HTMLDivElement>(null);

  const animRef = useRef({
    targetRot: 0,
    currentRot: 0,
    rotVel: 0,
    speedFactor: 1,
    formation: reducedMotion ? 1 : 0,
    expansion: reducedMotion ? 1 : 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartRot: 0,
    wasDragged: false,
    lastDragEndMs: 0,
    hoveredCardIdx: -1,
    cardTilts: Array.from({ length: TOTAL_SLOTS }, () => ({
      rx: 0,
      ry: 0,
      tz: 0,
      vrx: 0,
      vry: 0,
      vtz: 0,
      trx: 0,
      try: 0,
      ttz: 0,
    })),
    pointerTarget: { x: 0, y: 0 },
    pointerSmooth: { x: 0, y: 0 },
    pointerVel: { x: 0, y: 0 },
    mouseClient: { x: -9999, y: -9999 },
    startTime: 0,
    frameCount: 0,
  });

  const [orgInput, setOrgInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>(BRIEF_TRACKS[0]);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [sendMagnet, setSendMagnet] = useState<Vec2>({ x: 0, y: 0 });
  const sendBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#join") {
      setActiveView("join");
    }

    const onHashChange = () => {
      if (window.location.hash === "#join") {
        setActiveView("join");
      } else if (window.location.hash === "#directory") {
        setActiveView("directory");
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const switchView = useCallback((nextView: ActiveView) => {
    setActiveView(nextView);
    setHoveredChoice(null);
    if (typeof window !== "undefined") {
      const targetHash = nextView === "join" ? "#join" : "#directory";
      window.history.replaceState(null, "", `/partner-network${targetHash}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const activeWorldFocus: SentenceChoiceId | null = hoveredChoice ?? pinnedWorld;

  const updatePreviewCardPosition = useCallback((clientX: number, clientY: number) => {
    if (typeof window === "undefined") return;
    const cardW = 260;
    const cardH = 236;
    const gapX = 18;
    const gapY = 22;
    const pad = 12;
    const hys = 24;

    const flip = previewFlipRef.current;
    if (!flip.flipX && clientX + gapX + cardW > window.innerWidth - pad) {
      flip.flipX = true;
    } else if (flip.flipX && clientX + gapX + cardW < window.innerWidth - pad - hys) {
      flip.flipX = false;
    }

    if (!flip.flipY && clientY - gapY - cardH < pad) {
      flip.flipY = true;
    } else if (flip.flipY && clientY - gapY - cardH > pad + hys) {
      flip.flipY = false;
    }

    const rawX = flip.flipX ? clientX - gapX - cardW : clientX + gapX;
    const rawY = flip.flipY ? clientY + gapY : clientY - gapY - cardH;

    setPreviewPos({
      x: clamp(rawX, pad, window.innerWidth - cardW - pad),
      y: clamp(rawY, pad, window.innerHeight - cardH - pad),
    });
    setPreviewOrigin(`${flip.flipX ? "right" : "left"} ${flip.flipY ? "top" : "bottom"}`);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const st = animRef.current;
      st.mouseClient.x = event.clientX;
      st.mouseClient.y = event.clientY;

      if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
        st.pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
        st.pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
      }

      if (hoveredChoice) {
        updatePreviewCardPosition(event.clientX, event.clientY);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [hoveredChoice, reducedMotion, updatePreviewCardPosition]);

  // Capture horizontal trackpad swipes & Shift+Wheel over the ring wall while preserving vertical scroll to NPIA Footer
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || activeView !== "directory") return;

    const onWheel = (event: WheelEvent) => {
      const modeMult =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
          ? window.innerHeight
          : 1;
      const dx = event.deltaX * modeMult;
      const dy = event.deltaY * modeMult;

      if (Math.abs(dx) > Math.abs(dy) || event.shiftKey) {
        event.preventDefault();
        const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
        animRef.current.targetRot += 0.5 * clamp(delta, -480, 480);
      }
    };

    wall.addEventListener("wheel", onWheel, { passive: false });
    return () => wall.removeEventListener("wheel", onWheel);
  }, [activeView]);

  // Exact rAF loop & Section 6c cylinder projection geometry
  useEffect(() => {
    const st = animRef.current;
    st.startTime = performance.now();
    let lastTime = st.startTime;
    let rafId = 0;

    const tick = (now: number) => {
      const dtMs = Math.max(4, Math.min(48, now - lastTime));
      const dt = dtMs / 1000;
      const k = Math.min(3, dtMs / 16.67);
      lastTime = now;
      st.frameCount += 1;

      const elapsed = (now - st.startTime) / 1000;
      if (reducedMotion) {
        st.formation = 1;
        st.expansion = 1;
      } else {
        st.formation = clamp(elapsed / 1.15, 0, 1);
        const expRaw = clamp(elapsed / 1.35, 0, 1);
        st.expansion = 1 - Math.pow(1 - expRaw, 3);
      }

      if (st.frameCount % 3 === 0 && activeView === "directory" && !st.dragging) {
        const { x, y } = st.mouseClient;
        if (x > 0 && y > 0) {
          const hit = document.elementFromPoint(x, y);
          const cardEl = hit?.closest("[data-slot-idx]") as HTMLElement | null;
          st.hoveredCardIdx = cardEl
            ? Number(cardEl.getAttribute("data-slot-idx"))
            : -1;
        } else {
          st.hoveredCardIdx = -1;
        }
      }

      const targetSpeed = st.hoveredCardIdx >= 0 ? 0.2 : 1;
      st.speedFactor += (targetSpeed - st.speedFactor) * Math.min(1, 0.08 * k);

      if (activeView === "directory" && !st.dragging && !reducedMotion) {
        st.targetRot += 0.3 * st.speedFactor * k;
      }

      if (reducedMotion) {
        st.currentRot = st.targetRot;
        st.rotVel = 0;
      } else {
        const f = -150 * (st.currentRot - st.targetRot) - 27 * st.rotVel;
        st.rotVel += f * dt;
        st.currentRot += st.rotVel * dt;
      }

      if (!reducedMotion) {
        const pxForce =
          -40 * (st.pointerSmooth.x - st.pointerTarget.x) - 18 * st.pointerVel.x;
        const pyForce =
          -40 * (st.pointerSmooth.y - st.pointerTarget.y) - 18 * st.pointerVel.y;
        st.pointerVel.x += pxForce * dt;
        st.pointerVel.y += pyForce * dt;
        st.pointerSmooth.x += st.pointerVel.x * dt;
        st.pointerSmooth.y += st.pointerVel.y * dt;

        const applyParallax = (el: HTMLDivElement | null, depth: number) => {
          if (!el) return;
          el.style.transform = `translate3d(${(-st.pointerSmooth.x * depth).toFixed(
            2
          )}px, ${(-st.pointerSmooth.y * depth * 0.5).toFixed(2)}px, 0)`;
        };

        if (activeView === "directory") {
          applyParallax(dirSceneRef.current, 10);
          applyParallax(dirBackPetalsRef.current, 22);
          applyParallax(dirMistRef.current, 34);
          applyParallax(dirMotesRef.current, 40);
          applyParallax(dirFrontPetalsRef.current, 48);
        } else {
          applyParallax(joinSceneRef.current, 10);
          applyParallax(joinBackPetalsRef.current, 22);
        }
      }

      // Exact Section 6c projection formulas
      if (activeView === "directory" && lensRef.current && centerRef.current) {
        const e = st.expansion;
        const fProgress = st.formation;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const wallScale = vw <= 820 ? 0.8 : vh <= 760 ? 0.9 : 1.1;
        const fit =
          Math.min(1.05, (vw - 32) / 1240, (0.66 * vh) / 800) / wallScale;
        const aScale = wallScale * (fit + (1 - fit) * e);

        const tiltDeg = -22 * (1 - e);
        const tiltRad = (tiltDeg * Math.PI) / 180;
        const radius = 460 + 1340 * e;
        const anchor =
          -radius * Math.sin(tiltRad) +
          460 * Math.sin((-22 * Math.PI) / 180) * (1 - e);
        const perspective = 1000 + (760 - 1000) * e;
        const rollDeg = -20 * (1 - e);
        const rollRad = (rollDeg * Math.PI) / 180;
        const cardScale = 0.52 + (2.3 - 0.52) * e * e;
        const introX = 160 * Math.sin(rollRad) * aScale;

        lensRef.current.style.perspective = `${(perspective * aScale).toFixed(1)}px`;
        lensRef.current.style.perspectiveOrigin = "50% 50%";
        centerRef.current.style.transform = `translate3d(${introX.toFixed(
          2
        )}px, ${(anchor * aScale).toFixed(2)}px, 0px) rotateZ(${rollDeg.toFixed(
          2
        )}deg) rotateX(${tiltDeg.toFixed(2)}deg) scale3d(${aScale.toFixed(
          4
        )}, ${aScale.toFixed(4)}, ${aScale.toFixed(4)})`;

        let sitesNeedUpdate = false;
        const nextSites = [...slotSitesRef.current];
        const cardCount = PARTNER_RING_CARDS.length;

        for (let slotIdx = 0; slotIdx < TOTAL_SLOTS; slotIdx++) {
          const cardEl = cardRefs.current[slotIdx];
          if (!cardEl) continue;

          const baseDeg = (360 * slotIdx) / TOTAL_SLOTS + st.currentRot + 180;
          const wrapCount = Math.floor(baseDeg / 360);
          const angle = (((baseDeg % 360) + 360) % 360) - 180;
          const mappedIdx =
            (((slotIdx - wrapCount * TOTAL_SLOTS + Math.min(3, cardCount - 1)) %
              cardCount) +
              cardCount) %
            cardCount;

          if (slotSitesRef.current[slotIdx] !== mappedIdx) {
            nextSites[slotIdx] = mappedIdx;
            sitesNeedUpdate = true;
          }

          const nNorm = ((angle + 180) % 360) / 360;
          const slotProgress = clamp((fProgress - 0.7 * nNorm) / 0.3, 0, 1);
          const easedSlot = 1 - Math.pow(1 - slotProgress, 3);
          const yawDeg = -180 + ((angle + 180) % 360) * easedSlot;
          const yawRad = (yawDeg * Math.PI) / 180;
          const effectiveRadius = radius - (1 - easedSlot) * nNorm * 24;
          const px = -Math.sin(yawRad) * effectiveRadius;
          const pz = -Math.cos(yawRad) * effectiveRadius;
          const appearOpacity = Math.min(1, 2.5 * slotProgress);
          const behindCamera = pz * Math.cos(tiltRad) >= perspective - 70;
          const outOfFrontArc = e > 0.92 && Math.abs(angle) > 96;

          cardEl.style.transform = `translate3d(${px.toFixed(2)}px, 0px, ${pz.toFixed(
            2
          )}px) rotateY(${yawDeg.toFixed(2)}deg) scale(${cardScale.toFixed(3)})`;
          cardEl.style.opacity =
            behindCamera || outOfFrontArc ? "0" : appearOpacity.toFixed(3);
          cardEl.style.pointerEvents =
            behindCamera || outOfFrontArc ? "none" : "auto";

          const faceEl = faceRefs.current[slotIdx];
          if (faceEl) {
            const flipped = pz > (radius * radius) / perspective;
            faceEl.classList.toggle("is-flipped", flipped);
          }

          const tiltState = st.cardTilts[slotIdx];
          if (tiltState) {
            if (reducedMotion) {
              tiltState.rx = 0;
              tiltState.ry = 0;
              tiltState.tz = 0;
            } else {
              const ax = -180 * (tiltState.rx - tiltState.trx) - 24 * tiltState.vrx;
              const ay = -180 * (tiltState.ry - tiltState.try) - 24 * tiltState.vry;
              const az = -180 * (tiltState.tz - tiltState.ttz) - 24 * tiltState.vtz;
              tiltState.vrx += ax * dt;
              tiltState.vry += ay * dt;
              tiltState.vtz += az * dt;
              tiltState.rx += tiltState.vrx * dt;
              tiltState.ry += tiltState.vry * dt;
              tiltState.tz += tiltState.vtz * dt;

              const tiltEl = tiltRefs.current[slotIdx];
              if (tiltEl) {
                tiltEl.style.transform = `translate3d(0, 0, ${tiltState.tz.toFixed(
                  2
                )}px) rotateX(${tiltState.rx.toFixed(2)}deg) rotateY(${tiltState.ry.toFixed(
                  2
                )}deg)`;
              }
            }
          }

          const vidEl = cardVideoRefs.current[slotIdx];
          if (vidEl) {
            const shouldPlay =
              !reducedMotion &&
              !document.hidden &&
              fProgress > 0.5 &&
              Math.abs(angle) <= 78;
            if (shouldPlay) {
              if (vidEl.paused) vidEl.play().catch(() => {});
            } else if (!vidEl.paused) {
              vidEl.pause();
            }
          }
        }

        if (sitesNeedUpdate) {
          slotSitesRef.current = nextSites;
          setSlotSites(nextSites);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeView, reducedMotion]);

  const handleWallPointerDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || activeView !== "directory") return;
    const st = animRef.current;
    st.dragging = true;
    st.wasDragged = false;
    st.dragStartX = event.clientX;
    st.dragStartY = event.clientY;
    st.dragStartRot = st.targetRot;
    wallRef.current?.classList.add("is-dragging");
  };

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const st = animRef.current;
      if (!st.dragging) return;
      const dx = event.clientX - st.dragStartX;
      const dy = event.clientY - st.dragStartY;
      if (Math.hypot(dx, dy) > 4) {
        st.wasDragged = true;
      }
      const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      st.targetRot = st.dragStartRot + 0.2 * delta;
    };

    const onUp = () => {
      const st = animRef.current;
      if (!st.dragging) return;
      st.dragging = false;
      wallRef.current?.classList.remove("is-dragging");
      if (st.wasDragged) {
        st.lastDragEndMs = performance.now();
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1 || activeView !== "directory") return;
    const t = event.touches[0];
    const st = animRef.current;
    st.dragging = true;
    st.wasDragged = false;
    st.dragStartX = t.clientX;
    st.dragStartY = t.clientY;
    st.dragStartRot = st.targetRot;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const st = animRef.current;
    if (!st.dragging || event.touches.length !== 1) return;
    const t = event.touches[0];
    const dx = t.clientX - st.dragStartX;
    if (Math.abs(dx) > 4) st.wasDragged = true;
    st.targetRot = st.dragStartRot + 0.2 * dx;
  };

  const handleTouchEnd = () => {
    const st = animRef.current;
    if (st.wasDragged) {
      st.lastDragEndMs = performance.now();
    }
    st.dragging = false;
  };

  const handleChoiceEnter = (
    choiceId: SentenceChoiceId,
    event: React.MouseEvent<HTMLElement>
  ) => {
    setHoveredChoice(choiceId);
    updatePreviewCardPosition(event.clientX, event.clientY);
  };

  const handleChoiceLeave = () => {
    setHoveredChoice(null);
  };

  const handleChoiceClick = (choiceId: SentenceChoiceId) => {
    if (choiceId === "join") {
      switchView("join");
      return;
    }
    setPinnedWorld((prev) => (prev === choiceId ? null : choiceId));
  };

  const composedBrief = useMemo(() => {
    const org = orgInput.trim() || "an organisation / individual";
    const loc = locationInput.trim() || "our local ward";
    return `Hi NPIA, I represent ${org} in ${loc}, joining ${selectedTrack} to support street animal rescue.`;
  }, [orgInput, locationInput, selectedTrack]);

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(composedBrief);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 1600);
    } catch {
      // Fallback ignored gracefully
    }
  };

  const handleShareBrief = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "NPIA Partner Network Brief",
          text: composedBrief,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyBrief();
  };

  const handleSendBrief = () => {
    router.push(
      `/contact-us?type=partner&brief=${encodeURIComponent(composedBrief)}`
    );
  };

  const previewMeta = hoveredChoice ? PARTNER_WORLDS[hoveredChoice] : null;
  const previewCard: PartnerRingCard | null =
    previewMeta?.previewIndex !== undefined
      ? PARTNER_RING_CARDS[previewMeta.previewIndex]
      : null;

  return (
    <div className="pn-root">
      {/* Compact minimal view switcher strip */}
      <div className="pn-subnav">
        <div className="pn-nav-links" role="tablist" aria-label="Partner Network view">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "directory"}
            aria-current={activeView === "directory" ? "page" : undefined}
            className="pn-nav-link"
            onClick={() => switchView("directory")}
          >
            Directory
          </button>
          <span className="pn-nav-sep" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "join"}
            aria-current={activeView === "join" ? "page" : undefined}
            className="pn-nav-link"
            onClick={() => switchView("join")}
          >
            Join Grid
          </button>
        </div>
      </div>

      {/* VIEW 1: EXACT DARK STAGE + PINE FOREST + 3D RING */}
      {activeView === "directory" && (
        <section
          id="view-directory"
          aria-label="NPIA Partner Network Directory"
          className="pn-stage"
        >
          <div className="pn-top-row">
            <h1
              className="pn-sentence"
              data-entered={entered ? "true" : "false"}
              data-hovering={hoveredChoice ? "true" : "false"}
            >
              <MaskedWord text="We" index={0} className="pn-plain-word" />{" "}
              <MaskedWord text="unite" index={1} className="pn-plain-word" />{" "}
              <button
                type="button"
                className="pn-choice"
                data-active={
                  activeWorldFocus === "organisations" ? "true" : "false"
                }
                style={
                  {
                    "--choice-on": PARTNER_WORLDS.organisations.onColor,
                    "--line-delay": `${50 + 2 * 35 + 350}ms`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => handleChoiceEnter("organisations", e)}
                onMouseLeave={handleChoiceLeave}
                onClick={() => handleChoiceClick("organisations")}
              >
                <span
                  className="pn-choice-marker"
                  style={{ background: PARTNER_WORLDS.organisations.color }}
                  aria-hidden="true"
                />
                <MaskedWord
                  text="allied"
                  index={2}
                  className="pn-choice-label"
                />{" "}
                <MaskedWord
                  text="organisations,"
                  index={3}
                  className="pn-choice-label"
                />
                <span className="pn-choice-underline" aria-hidden="true" />
                <span className="pn-choice-sup" aria-hidden="true">
                  01
                </span>
              </button>
              <br />
              <button
                type="button"
                className="pn-choice"
                data-active={
                  activeWorldFocus === "individuals" ? "true" : "false"
                }
                style={
                  {
                    "--choice-on": PARTNER_WORLDS.individuals.onColor,
                    "--line-delay": `${50 + 5 * 35 + 350}ms`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => handleChoiceEnter("individuals", e)}
                onMouseLeave={handleChoiceLeave}
                onClick={() => handleChoiceClick("individuals")}
              >
                <span
                  className="pn-choice-marker"
                  style={{ background: PARTNER_WORLDS.individuals.color }}
                  aria-hidden="true"
                />
                <MaskedWord
                  text="allied"
                  index={4}
                  className="pn-choice-label"
                />{" "}
                <MaskedWord
                  text="individuals"
                  index={5}
                  className="pn-choice-label"
                />
                <span className="pn-choice-underline" aria-hidden="true" />
                <span className="pn-choice-sup" aria-hidden="true">
                  02
                </span>
              </button>{" "}
              <MaskedWord text="and" index={6} className="pn-plain-word" />{" "}
              <MaskedWord text="lasting" index={7} className="pn-plain-word" />
              <br />
              <button
                type="button"
                className="pn-choice"
                data-active={
                  activeWorldFocus === "partnerships" ? "true" : "false"
                }
                style={
                  {
                    "--choice-on": PARTNER_WORLDS.partnerships.onColor,
                    "--line-delay": `${50 + 8 * 35 + 350}ms`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => handleChoiceEnter("partnerships", e)}
                onMouseLeave={handleChoiceLeave}
                onClick={() => handleChoiceClick("partnerships")}
              >
                <span
                  className="pn-choice-marker"
                  style={{ background: PARTNER_WORLDS.partnerships.color }}
                  aria-hidden="true"
                />
                <MaskedWord
                  text="partnerships."
                  index={8}
                  className="pn-choice-label"
                />
                <span className="pn-choice-underline" aria-hidden="true" />
                <span className="pn-choice-sup" aria-hidden="true">
                  03
                </span>
              </button>{" "}
              <MaskedWord text="Ready" index={9} className="pn-plain-word" />{" "}
              <MaskedWord text="to" index={10} className="pn-plain-word" />{" "}
              <button
                type="button"
                className="pn-choice"
                data-active={hoveredChoice === "join" ? "true" : "false"}
                style={
                  {
                    "--choice-on": PARTNER_WORLDS.join.onColor,
                    "--line-delay": `${50 + 11 * 35 + 350}ms`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => handleChoiceEnter("join", e)}
                onMouseLeave={handleChoiceLeave}
                onClick={() => handleChoiceClick("join")}
              >
                <span
                  className="pn-choice-marker"
                  style={{ background: PARTNER_WORLDS.join.color }}
                  aria-hidden="true"
                />
                <MaskedWord
                  text="join us."
                  index={11}
                  className="pn-choice-label"
                />
                <span className="pn-choice-underline" aria-hidden="true" />
                <span className="pn-choice-sup" aria-hidden="true">
                  04
                </span>
              </button>
            </h1>

            <dl
              className="pn-stats"
              data-entered={entered ? "true" : "false"}
            >
              {PARTNER_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="pn-stat-item"
                  style={
                    {
                      "--stat-delay": `${350 + idx * 100}ms`,
                    } as React.CSSProperties
                  }
                >
                  <dd className="pn-stat-val">{stat.value}</dd>
                  <dt className="pn-stat-lbl">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="pn-world-frame">
            <PineForestBackdrop
              reducedMotion={reducedMotion}
              objectPosition="50% 62%"
              petalLayer="both"
              includeMotes
              sceneLayerRef={dirSceneRef}
              backPetalsRef={dirBackPetalsRef}
              mistLayerRef={dirMistRef}
              motesLayerRef={dirMotesRef}
              frontPetalsRef={dirFrontPetalsRef}
            />

            <div
              ref={wallRef}
              className="pn-ring-wall"
              data-focus-world={activeWorldFocus ?? undefined}
              onMouseDown={handleWallPointerDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div ref={lensRef} className="pn-ring-lens">
                <div ref={centerRef} className="pn-ring-center">
                  {Array.from({ length: TOTAL_SLOTS }).map((_, slotIdx) => {
                    const cardIdx =
                      slotSites[slotIdx] % PARTNER_RING_CARDS.length;
                    const card = PARTNER_RING_CARDS[cardIdx];
                    const worldMeta = PARTNER_WORLDS[card.world];
                    const cardWidth = Math.round(160 * card.ratio);

                    return (
                      <Link
                        key={slotIdx}
                        href={card.href}
                        ref={(el) => {
                          cardRefs.current[slotIdx] = el;
                        }}
                        data-slot-idx={slotIdx}
                        data-world={card.world}
                        onClick={(event) => {
                          if (
                            performance.now() - animRef.current.lastDragEndMs <
                            60
                          ) {
                            event.preventDefault();
                            return;
                          }
                          if (card.href === "/partner-network#join") {
                            event.preventDefault();
                            switchView("join");
                          }
                        }}
                        onMouseMove={(event) => {
                          if (reducedMotion) return;
                          const rect =
                            event.currentTarget.getBoundingClientRect();
                          const nx =
                            (event.clientX - rect.left) / rect.width - 0.5;
                          const ny =
                            (event.clientY - rect.top) / rect.height - 0.5;
                          const t = animRef.current.cardTilts[slotIdx];
                          if (t) {
                            t.trx = -20 * ny;
                            t.try = 24 * nx;
                            t.ttz = 45;
                          }
                        }}
                        onMouseLeave={() => {
                          const t = animRef.current.cardTilts[slotIdx];
                          if (t) {
                            t.trx = 0;
                            t.try = 0;
                            t.ttz = 0;
                          }
                        }}
                        className="pn-card"
                        style={
                          {
                            width: `${cardWidth}px`,
                            left: `${-cardWidth / 2}px`,
                            "--card-world": worldMeta.color,
                            "--card-on": worldMeta.onColor,
                          } as React.CSSProperties
                        }
                      >
                        <div
                          ref={(el) => {
                            tiltRefs.current[slotIdx] = el;
                          }}
                          className="pn-card-tilt"
                        >
                          <div className="pn-card-outline" aria-hidden="true" />
                          <div
                            ref={(el) => {
                              faceRefs.current[slotIdx] = el;
                            }}
                            className="pn-card-face"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={card.imageSrc}
                              alt={card.title}
                              className="pn-card-media"
                              style={{
                                objectPosition:
                                  card.objectPosition ?? "50% 50%",
                              }}
                              loading="eager"
                            />
                            {card.videoSrc && !reducedMotion && (
                              <video
                                ref={(el) => {
                                  cardVideoRefs.current[slotIdx] = el;
                                }}
                                src={card.videoSrc}
                                poster={card.imageSrc}
                                muted
                                loop
                                playsInline
                                preload="none"
                                onPlaying={(e) =>
                                  e.currentTarget.classList.add("is-playing")
                                }
                                className="pn-card-media pn-card-video"
                              />
                            )}
                            <div className="pn-card-dim" aria-hidden="true" />

                            <span className="pn-card-chip">
                              <span
                                className="pn-card-dot"
                                aria-hidden="true"
                              />
                              No. {card.numeral}
                            </span>

                            <div className="pn-card-labelbar">
                              <div className="min-w-0">
                                <p className="pn-card-label-world">
                                  {worldMeta.label}
                                </p>
                                <p className="pn-card-label-title">
                                  {card.title}
                                </p>
                              </div>
                              <span
                                className="pn-card-label-arrow"
                                aria-hidden="true"
                              >
                                ↗
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Cursor Preview Card */}
      {activeView === "directory" && previewMeta && (
        <div
          className="pn-preview-anchor"
          aria-hidden="true"
          style={{
            transform: `translate3d(${previewPos.x}px, ${previewPos.y}px, 0)`,
          }}
        >
          <div
            className={`pn-preview-card is-open ${
              hoveredChoice === "join" ? "is-join" : ""
            }`}
            style={{ transformOrigin: previewOrigin }}
          >
            {hoveredChoice === "join" ? (
              <div className="pn-preview-caret-wrap">
                Offer partner capacity
                <span className="pn-preview-caret" />
              </div>
            ) : (
              previewCard && (
                <div className="pn-preview-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewCard.imageSrc}
                    alt=""
                    className="pn-card-media"
                    style={{
                      objectPosition: previewCard.objectPosition ?? "50% 45%",
                    }}
                  />
                </div>
              )
            )}
            <div className="pn-preview-meta">
              <div className="pn-preview-tag">
                <span
                  className="pn-preview-square"
                  style={{ background: previewMeta.color }}
                />
                <span>
                  {previewMeta.label}
                  {previewCard ? ` · ${previewCard.title.toUpperCase()}` : ""}
                </span>
              </div>
              <p className="pn-preview-blurb">{previewMeta.blurb}</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EXACT BUILD / JOIN BRIEF PANEL */}
      {activeView === "join" && (
        <section
          id="view-join"
          aria-label="Join the NPIA Partner Network"
          className="pn-stage is-join"
        >
          <div className="pn-join-panel">
            <PineForestBackdrop
              reducedMotion={reducedMotion}
              objectPosition="50% 45%"
              petalLayer="allBack"
              sceneLayerRef={joinSceneRef}
              backPetalsRef={joinBackPetalsRef}
            />

            <h1 className="pn-join-headline">
              Connect your shelter
              <br />
              to the rescue grid.
            </h1>

            <div className="pn-brief-card">
              <p className="pn-brief-kicker">Share how you want to partner</p>

              <p className="pn-brief-sentence">
                I represent{" "}
                <input
                  type="text"
                  aria-label="Organisation or individual name"
                  placeholder="an organisation / individual"
                  value={orgInput}
                  onChange={(e) => setOrgInput(e.target.value)}
                  className="pn-brief-input"
                  style={{
                    width: `${
                      Math.max(
                        18,
                        Math.min(
                          32,
                          (orgInput || "an organisation / individual").length
                        )
                      ) * 0.5
                    }em`,
                  }}
                />
                <br />
                in{" "}
                <input
                  type="text"
                  aria-label="City or neighbourhood"
                  placeholder="our city / ward"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="pn-brief-input"
                  style={{
                    width: `${
                      Math.max(
                        12,
                        Math.min(22, (locationInput || "our city / ward").length)
                      ) * 0.5
                    }em`,
                  }}
                />
                , joining
                <br />
                <span role="radiogroup" aria-label="Partner track">
                  {BRIEF_TRACKS.map((track, idx) => (
                    <React.Fragment key={track}>
                      {idx === 1 && " "}
                      {idx === 2 && " / "}
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selectedTrack === track}
                        className="pn-radio-btn"
                        onClick={() => setSelectedTrack(track)}
                      >
                        <span
                          className="pn-radio-highlight"
                          aria-hidden="true"
                        />
                        {track}
                      </button>
                    </React.Fragment>
                  ))}
                  .
                </span>
              </p>

              <p className="pn-brief-kicker">
                Routes to NPIA partner intake. Our coordination desk responds.
              </p>

              <div className="pn-brief-actions">
                <button
                  type="button"
                  onClick={handleCopyBrief}
                  aria-label="Copy this brief"
                  title="Copy brief"
                  className="pn-icon-circle-btn"
                >
                  <Asterisk size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleShareBrief}
                  aria-label="Share this brief"
                  title="Share brief"
                  className="pn-icon-circle-btn"
                >
                  <Share2 size={17} aria-hidden="true" />
                </button>

                <button
                  ref={sendBtnRef}
                  type="button"
                  onClick={handleSendBrief}
                  onMouseMove={(e) => {
                    if (reducedMotion || !sendBtnRef.current) return;
                    const rect = sendBtnRef.current.getBoundingClientRect();
                    const dx = e.clientX - (rect.left + rect.width / 2);
                    const dy = e.clientY - (rect.top + rect.height / 2);
                    setSendMagnet({ x: 0.3 * dx, y: 0.4 * dy });
                  }}
                  onMouseLeave={() => setSendMagnet({ x: 0, y: 0 })}
                  className="pn-send-pill"
                  style={{
                    transform: `translate3d(${sendMagnet.x.toFixed(
                      1
                    )}px, ${sendMagnet.y.toFixed(1)}px, 0)`,
                  }}
                >
                  <span>Send to NPIA</span>
                  <span aria-hidden="true">↗</span>
                </button>

                {copiedNotice && (
                  <span
                    className="pn-brief-kicker"
                    style={{ color: "var(--clay)" }}
                    role="status"
                  >
                    Brief copied
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pn-worked-row">
            <span className="pn-brief-kicker">PARTNER TRACKS</span>
            <div className="pn-worked-marks">
              <span className="pn-worked-mark">
                <svg viewBox="0 0 42 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M1 12c5-8 10-8 15 0s10 8 15 0 6-6 10 0" strokeLinecap="round" />
                </svg>
                <span>Allied Organisations</span>
              </span>
              <span className="pn-worked-mark">
                <svg viewBox="0 0 42 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M2 15L14 4l8 8 7-6 11 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Allied Individuals &amp; Partnerships</span>
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
