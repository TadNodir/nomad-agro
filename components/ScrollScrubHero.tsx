"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/**
 * ScrollScrubHero
 * ----------------
 * Apple-style scroll-scrub hero. Explodes a video into a JPG/WebP frame
 * sequence (via ffmpeg) and paints the correct frame onto a <canvas> based
 * on scroll progress. Pin via sticky; scrub via a tall track.
 *
 * Frames live in: /public/frames/hero/frame_0001.jpg ... frame_NNNN.jpg
 * Generate with:
 *   ffmpeg -i input.mp4 -vf "fps=24,scale=1600:-1" -q:v 6 \
 *     public/frames/hero/frame_%04d.jpg
 *
 * After generating, set FRAME_COUNT to the actual number of files.
 */

const FRAME_COUNT = 120; // 5 s × 24 fps from hero-source.mp4
const FRAME_PATH = (i: number) =>
  `/frames/hero/frame_${String(i + 1).padStart(4, "0")}.jpg`;

// Intrinsic frame dimensions (match your ffmpeg scale). Used for cover math.
const FRAME_W = 1600;
const FRAME_H = 900;

type Props = {
  /** Height of the scroll track in viewport heights. Higher = slower scrub. */
  trackVh?: number;
  /** Overlay content (headline, CTA) rendered above the canvas. */
  children?: React.ReactNode;
  /** Static poster shown for reduced-motion users (e.g. first frame). */
  posterSrc?: string;
};

export default function ScrollScrubHero({
  trackVh = 300,
  children,
  posterSrc = FRAME_PATH(0),
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef<number>(-1);

  const [progress, setProgress] = useState(0); // preload progress 0..1
  const [ready, setReady] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  /** Paint a frame with true "cover" fit, retina-aware. */
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[Math.round(index)];
    if (!img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    // size backing store for retina
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // cover math
    const scale = Math.max(cw / FRAME_W, ch / FRAME_H);
    const dw = FRAME_W * scale;
    const dh = FRAME_H * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawn.current = Math.round(index);
  }, []);

  // Preload all frames (skip if reduced motion — we show a poster instead)
  useEffect(() => {
    if (prefersReducedMotion) {
      setReady(true);
      return;
    }
    let loaded = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = img.onerror = () => {
        if (cancelled) return;
        loaded++;
        setProgress(loaded / FRAME_COUNT);
        if (loaded === FRAME_COUNT) {
          setReady(true);
          draw(0);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion, draw]);

  // Redraw on scrub
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!ready || prefersReducedMotion) return;
    if (Math.round(latest) === lastDrawn.current) return;
    requestAnimationFrame(() => draw(latest));
  });

  // Redraw on resize
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onResize = () => draw(lastDrawn.current < 0 ? 0 : lastDrawn.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw, prefersReducedMotion]);

  // ---- Reduced-motion fallback: static hero, no scrub, no preload ----
  if (prefersReducedMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc}
          alt="Nomad Agro premium dried fruits"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 flex h-full items-center justify-center">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      style={{ height: `${trackVh}vh` }}
      className="relative w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* subtle dark gradient so overlay text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-900 text-white">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-[#5CE65C] transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-sm tracking-wide text-white/70">
              {Math.round(progress * 100)}%
            </p>
          </div>
        )}

        {/* Overlay content (headline, CTA, etc.) */}
        <div className="relative z-10 flex h-full items-center justify-center">
          {children}
        </div>
      </div>
    </section>
  );
}
