"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as MP4Box from "mp4box";
import type { MP4ArrayBuffer, MP4Sample } from "mp4box";

const LERP_TAU = 10;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 8;
const MAX_SAMPLED_FRAMES = 72;
const MAX_ENCODE_WIDTH = 960;
const WATCHDOG_MS = 60000;

interface FrameEntry {
  ts: number; // presentation timestamp in microseconds
  blob: Blob;
}

function getDescriptionBytes(
  mp4File: MP4Box.ISOFile,
  trackId: number
): Uint8Array | undefined {
  try {
    const trak = mp4File.getTrackById(trackId);
    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
      if (box) {
        const stream = new MP4Box.DataStream(
          undefined,
          0,
          MP4Box.DataStream.BIG_ENDIAN
        );
        box.write(stream);
        return new Uint8Array(stream.buffer, 8, Math.max(0, stream.position - 8));
      }
    }
  } catch {
    // Codec description unavailable
  }
  return undefined;
}

function nearestIndex(bank: FrameEntry[], targetSec: number): number {
  const targetUs = targetSec * 1e6;
  let lo = 0;
  let hi = bank.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (bank[mid].ts < targetUs) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  if (lo > 0) {
    const prevDiff = Math.abs(targetUs - bank[lo - 1].ts);
    const currDiff = Math.abs(bank[lo].ts - targetUs);
    if (prevDiff < currDiff) return lo - 1;
  }
  return lo;
}

export function useVideoScrub(
  videoSrc: string,
  onProgressFrame?: (p: number) => void
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onProgressFrameRef = useRef(onProgressFrame);
  onProgressFrameRef.current = onProgressFrame;

  const [canvasLive, setCanvasLive] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);

  const bankRef = useRef<FrameEntry[]>([]);
  const lruRef = useRef<Map<number, ImageBitmap | null>>(new Map());
  const currentRef = useRef(0);
  const durRef = useRef(0);
  const readyRef = useRef(false);
  const revertedRef = useRef(false);
  const paintedRef = useRef(false);
  const buildingRef = useRef(false);
  const lastDrawnIdxRef = useRef(-1);
  const activeIdxRef = useRef(0);

  const scrollToProgress = useCallback((pTarget: number) => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;
    const clamped = Math.min(1, Math.max(0, pTarget));
    const rect = el.getBoundingClientRect();
    const topAbs = rect.top + window.scrollY;
    const span = Math.max(1, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: topAbs + clamped * span,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let disposed = false;
    let rafId = 0;
    let isInViewport = false;
    let watchdogId: ReturnType<typeof setTimeout> | null = null;
    const abortCtrl = new AbortController();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getProgress = () => {
      const el = containerRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      return Math.min(1, Math.max(0, -rect.top / span));
    };

    const syncDuration = () => {
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        durRef.current = video.duration;
      }
    };

    const videoEl = videoRef.current;
    if (videoEl) {
      syncDuration();
      videoEl.addEventListener("loadedmetadata", syncDuration);
      videoEl.addEventListener("durationchange", syncDuration);
    }

    const paintBitmap = (idx: number, bmp: ImageBitmap) => {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      lastDrawnIdxRef.current = idx;
      if (!paintedRef.current) {
        paintedRef.current = true;
        setCanvasLive(true);
      }
    };

    const touchLRU = (idx: number, bmp: ImageBitmap | null) => {
      const lru = lruRef.current;
      if (lru.has(idx)) {
        lru.delete(idx);
      }
      lru.set(idx, bmp);
      while (lru.size > LRU_MAX) {
        const oldestKey = lru.keys().next().value;
        if (oldestKey === undefined) break;
        const oldBmp = lru.get(oldestKey);
        lru.delete(oldestKey);
        oldBmp?.close();
      }
    };

    const warmLRU = (centerIdx: number) => {
      const bank = bankRef.current;
      const lru = lruRef.current;
      const offsets = [0, 1, -1, 2, -2, 3, -3];

      for (const offset of offsets) {
        const idx = centerIdx + offset;
        if (idx < 0 || idx >= bank.length) continue;

        if (lru.has(idx)) {
          const existing = lru.get(idx) ?? null;
          lru.delete(idx);
          lru.set(idx, existing);
          continue;
        }

        lru.set(idx, null);
        createImageBitmap(bank[idx].blob)
          .then((bmp) => {
            if (disposed || revertedRef.current || !lru.has(idx)) {
              bmp.close();
              return;
            }
            touchLRU(idx, bmp);
            if (idx === activeIdxRef.current) {
              paintBitmap(idx, bmp);
            }
          })
          .catch(() => {
            lru.delete(idx);
          });
      }
    };

    const drawNearestFrame = (timeSec: number) => {
      const bank = bankRef.current;
      if (bank.length === 0) return;

      const idx = nearestIndex(bank, timeSec);
      activeIdxRef.current = idx;
      warmLRU(idx);

      const exact = lruRef.current.get(idx);
      if (exact) {
        if (idx !== lastDrawnIdxRef.current) {
          paintBitmap(idx, exact);
        }
        return;
      }

      // If exact frame is still decoding async, immediately show nearest warm cached frame
      let bestIdx = -1;
      let bestDist = Infinity;
      for (const [k, bmp] of lruRef.current.entries()) {
        if (!bmp) continue;
        const dist = Math.abs(k - idx);
        if (dist < bestDist && dist <= 10) {
          bestDist = dist;
          bestIdx = k;
        }
      }
      if (bestIdx !== -1 && bestIdx !== lastDrawnIdxRef.current) {
        const standIn = lruRef.current.get(bestIdx);
        if (standIn) paintBitmap(bestIdx, standIn);
      }
    };

    let lastNow = performance.now();
    let lastVideoSeekNow = 0;
    let lastCallbackP = -1;

    const emitProgress = (p: number) => {
      if (
        Math.abs(p - lastCallbackP) > 0.0002 ||
        (p === 0 && lastCallbackP !== 0) ||
        (p === 1 && lastCallbackP !== 1)
      ) {
        lastCallbackP = p;
        onProgressFrameRef.current?.(p);
      }
    };

    // Emit initial progress immediately on mount
    emitProgress(getProgress());

    const tick = (now: number) => {
      if (disposed || !isInViewport) {
        rafId = 0;
        return;
      }

      const dt = Math.min(0.05, Math.max(0.0001, (now - lastNow) * 0.001));
      lastNow = now;

      const p = getProgress();
      emitProgress(p);

      const dur = durRef.current;
      if (dur > 0) {
        const target = p * dur;

        if (prefersReducedMotion) {
          currentRef.current = target;
        } else {
          currentRef.current +=
            (target - currentRef.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(target - currentRef.current) < SNAP) {
            currentRef.current = target;
          }
        }

        if (readyRef.current && !revertedRef.current && bankRef.current.length > 0) {
          drawNearestFrame(currentRef.current);
        } else if (
          videoEl &&
          videoEl.readyState >= 1 &&
          !videoEl.seeking &&
          now - lastVideoSeekNow >= 45 &&
          Math.abs(videoEl.currentTime - currentRef.current) > 0.035
        ) {
          lastVideoSeekNow = now;
          videoEl.currentTime = currentRef.current;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const startRaf = () => {
      if (!disposed && isInViewport && rafId === 0) {
        lastNow = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const containerEl = containerRef.current;
    const observer =
      containerEl && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              isInViewport = entry.isIntersecting;
              if (isInViewport) {
                emitProgress(getProgress());
                startRaf();
              } else if (rafId !== 0) {
                cancelAnimationFrame(rafId);
                rafId = 0;
              }
            },
            { rootMargin: "300px 0px 300px 0px", threshold: 0.01 }
          )
        : null;

    if (observer && containerEl) {
      observer.observe(containerEl);
    } else {
      isInViewport = true;
      startRaf();
    }

    const onScrollOrResize = () => {
      emitProgress(getProgress());
    };
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    window.addEventListener("orientationchange", onScrollOrResize, {
      passive: true,
    });

    const activateFallback = () => {
      if (disposed) return;
      revertedRef.current = true;
      buildingRef.current = false;
      setCanvasLive(false);
      setFallbackActive(true);
      if (videoEl) {
        videoEl.preload = "auto";
        if (videoEl.readyState === 0) {
          videoEl.load();
        }
      }
    };

    const buildBank = async (preferSoftware: boolean) => {
      if (
        disposed ||
        buildingRef.current ||
        revertedRef.current ||
        prefersReducedMotion ||
        typeof VideoDecoder === "undefined" ||
        !videoSrc
      ) {
        return;
      }

      buildingRef.current = true;
      bankRef.current = [];
      readyRef.current = false;

      if (watchdogId) clearTimeout(watchdogId);
      watchdogId = setTimeout(() => {
        if (!readyRef.current && !disposed) {
          activateFallback();
          abortCtrl.abort();
        }
      }, WATCHDOG_MS);

      let fetchSucceeded = false;

      try {
        const res = await fetch(videoSrc, { signal: abortCtrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuf = (await res.arrayBuffer()) as MP4ArrayBuffer;
        fetchSucceeded = true;
        if (disposed || revertedRef.current) return;

        arrayBuf.fileStart = 0;

        const mp4File = MP4Box.createFile();
        const offCanvas =
          typeof OffscreenCanvas !== "undefined"
            ? new OffscreenCanvas(MAX_ENCODE_WIDTH, 540)
            : document.createElement("canvas");
        if (offCanvas instanceof HTMLCanvasElement) {
          offCanvas.width = MAX_ENCODE_WIDTH;
          offCanvas.height = 540;
        }
        const offCtx = offCanvas.getContext("2d") as
          | CanvasRenderingContext2D
          | OffscreenCanvasRenderingContext2D
          | null;
        if (!offCtx) throw new Error("2D context unavailable");

        const encodeBlob = (frame: VideoFrame): Promise<Blob | null> => {
          const rawW = frame.displayWidth || 960;
          const rawH = frame.displayHeight || 540;
          const scale = Math.min(1, MAX_ENCODE_WIDTH / rawW);
          const w = Math.max(1, Math.round(rawW * scale));
          const h = Math.max(1, Math.round(rawH * scale));

          offCanvas.width = w;
          offCanvas.height = h;
          offCtx.drawImage(frame, 0, 0, w, h);

          if (offCanvas instanceof OffscreenCanvas) {
            return offCanvas.convertToBlob({
              type: "image/jpeg",
              quality: 0.8,
            });
          }
          return new Promise((resolve) => {
            offCanvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
          });
        };

        const entries: FrameEntry[] = [];
        const pendingBlobs: Promise<void>[] = [];
        let pendingEncodeCount = 0;
        let decodeErrored = false;
        let decodedCount = 0;
        let sampleStride = 1;

        let resolveMeta!: (dec: VideoDecoder) => void;
        let rejectMeta!: (err: unknown) => void;
        const metaPromise = new Promise<VideoDecoder>((resP, rejP) => {
          resolveMeta = resP;
          rejectMeta = rejP;
        });

        const sampleQueue: MP4Sample[] = [];

        mp4File.onReady = (info) => {
          try {
            const track = info.videoTracks[0];
            if (!track) throw new Error("No video track");

            if (durRef.current <= 0 && track.duration > 0 && track.timescale > 0) {
              durRef.current = track.duration / track.timescale;
            }

            const total = track.nb_samples || 0;
            sampleStride =
              total > MAX_SAMPLED_FRAMES
                ? Math.max(1, Math.floor(total / MAX_SAMPLED_FRAMES))
                : 1;

            const description = getDescriptionBytes(mp4File, track.id);
            const config: VideoDecoderConfig = {
              codec: track.codec,
              codedWidth: track.video?.width,
              codedHeight: track.video?.height,
              description,
              hardwareAcceleration: preferSoftware
                ? "prefer-software"
                : "no-preference",
            };

            const dec = new VideoDecoder({
              output: (frame) => {
                if (disposed || revertedRef.current) {
                  frame.close();
                  return;
                }
                const idxNum = decodedCount++;
                const isKept = idxNum === 0 || idxNum % sampleStride === 0;
                if (!isKept) {
                  frame.close();
                  return;
                }

                const ts = frame.timestamp ?? 0;
                pendingEncodeCount++;
                const pBlob = encodeBlob(frame)
                  .then((blob) => {
                    if (blob && !disposed && !revertedRef.current) {
                      entries.push({ ts, blob });
                    }
                  })
                  .finally(() => {
                    pendingEncodeCount--;
                    frame.close();
                  });
                pendingBlobs.push(pBlob);
              },
              error: () => {
                decodeErrored = true;
              },
            });

            dec.configure(config);
            mp4File.setExtractionOptions(track.id, null, {
              nbSamples: Math.max(total || 1000, 1000),
            });
            mp4File.start();
            resolveMeta(dec);
          } catch (err) {
            rejectMeta(err);
          }
        };

        mp4File.onSamples = (_trackId, _user, samples) => {
          for (const sample of samples) {
            sampleQueue.push(sample);
          }
        };

        mp4File.onError = (err) => {
          rejectMeta(err);
        };

        mp4File.appendBuffer(arrayBuf);
        mp4File.flush();
        const decoder = await metaPromise;

        for (let i = 0; i < sampleQueue.length; i++) {
          if (disposed || revertedRef.current || decodeErrored) break;

          while (
            !disposed &&
            !revertedRef.current &&
            !decodeErrored &&
            decoder.decodeQueueSize + pendingEncodeCount >= LEAD
          ) {
            await new Promise((r) => setTimeout(r, 8));
          }

          if (disposed || revertedRef.current || decodeErrored) break;

          const s = sampleQueue[i];
          const chunk = new EncodedVideoChunk({
            type: s.is_sync ? "key" : "delta",
            timestamp: (s.cts * 1e6) / s.timescale,
            duration: (s.duration * 1e6) / s.timescale,
            data: s.data,
          });
          decoder.decode(chunk);

          // Periodically yield cleanly to avoid main-thread jank during scroll
          if (i % 12 === 11) {
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        if (!decodeErrored && !disposed && !revertedRef.current) {
          await decoder.flush();
        }
        await Promise.all(pendingBlobs);

        if (decoder.state !== "closed") {
          decoder.close();
        }

        if (decodeErrored && !preferSoftware && !disposed && !revertedRef.current) {
          buildingRef.current = false;
          await buildBank(true);
          return;
        }

        if (
          !decodeErrored &&
          entries.length > 0 &&
          !disposed &&
          !revertedRef.current
        ) {
          entries.sort((a, b) => a.ts - b.ts);
          bankRef.current = entries;
          readyRef.current = true;
          buildingRef.current = false;
          if (watchdogId) {
            clearTimeout(watchdogId);
            watchdogId = null;
          }
          drawNearestFrame(currentRef.current);
        } else {
          buildingRef.current = false;
        }
      } catch {
        buildingRef.current = false;
        if (fetchSucceeded && !preferSoftware && !disposed && !revertedRef.current) {
          await buildBank(true);
        } else if (!disposed) {
          activateFallback();
        }
      }
    };

    const supportsWebCodecs =
      !prefersReducedMotion && typeof VideoDecoder !== "undefined" && Boolean(videoSrc);

    if (!supportsWebCodecs && !prefersReducedMotion) {
      activateFallback();
    }

    const startTimer = setTimeout(() => {
      if (supportsWebCodecs) {
        void buildBank(false);
      }
    }, 60);

    const lruMap = lruRef.current;

    return () => {
      disposed = true;
      clearTimeout(startTimer);
      observer?.disconnect();
      if (rafId !== 0) cancelAnimationFrame(rafId);
      if (watchdogId) clearTimeout(watchdogId);
      abortCtrl.abort();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("orientationchange", onScrollOrResize);
      if (videoEl) {
        videoEl.removeEventListener("loadedmetadata", syncDuration);
        videoEl.removeEventListener("durationchange", syncDuration);
      }
      lruMap.forEach((bmp) => bmp?.close());
      lruMap.clear();
    };
  }, [videoSrc]);

  return {
    containerRef,
    videoRef,
    canvasRef,
    canvasLive,
    fallbackActive,
    scrollToProgress,
  };
}
