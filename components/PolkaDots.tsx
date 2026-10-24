"use client";

import { useEffect, useRef } from "react";

// Evenly spaced polka dots: a staggered (brick-style) grid with a tiny jitter.
// Dots now cover the whole screen (including the middle) and sit behind the
// content (z-index -1 in globals.css). They fall forever and wrap to the top.
// Starting positions are deterministic, so server and client render identical dots.
// When the cursor gets close, nearby dots get pushed away and spring back.

const COLORS = ["#F39399", "#A6C9DD", "#F9F6BD"];

// Hover feel: tweak these two numbers
const REACH = 150; // px: how close the cursor must be to push a dot
const PUSH = 80; // px: how far a dot is pushed at most

// Fall feel: tweak these
const SPEED = 20; // px per second for the slowest column
const SPEED_SPREAD = 3; // columns fall at SPEED * (1 ... 1 + 0.25 * (SPREAD-1)); 1 = all the same
const PIXEL_STEP = 8; // px: dots drop in chunky jumps of this size (pixel look). 0 = smooth fall

// Areas with NO dots, in % of the viewport: [x1, y1, x2, y2]
type Zone = [number, number, number, number];
type Config = { cols: number; rows: number; zones: Zone[] };

const WIDE: Config = { cols: 16, rows: 9, zones: [] };
const NARROW: Config = {
  cols: 7,
  rows: 14,
  zones: [],
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = { x: number; y: number; size: number; color: string; speed: number };

function makeDots({ cols, rows, zones }: Config, seed: number) {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitter = () => (rand() - 0.5) * 0.2; // +-10% of a cell
      const x = ((c + 0.5 + (r % 2 ? 0.5 : 0) + jitter()) / cols) * 100;
      const y = ((r + 0.5 + jitter()) / rows) * 100;
      if (x > 99) continue;
      if (zones.some(([x1, y1, x2, y2]) => x > x1 && x < x2 && y > y1 && y < y2)) continue;
      dots.push({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        size: (c + r) % 2 ? 20 : 14,
        color: COLORS[(c + 2 * r) % 3], // diagonal colour rhythm
        speed: SPEED * (1 + 0.25 * ((c * 3) % SPEED_SPREAD)), // same per column, so rows stay evenly spaced
      });
    }
  }
  return dots;
}

const WIDE_DOTS = makeDots(WIDE, 7);
const NARROW_DOTS = makeDots(NARROW, 21);

export default function PolkaDots() {
  const wideRef = useRef<HTMLDivElement>(null);
  const narrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = [
      { el: wideRef.current, dots: WIDE_DOTS },
      { el: narrowRef.current, dots: NARROW_DOTS },
    ];
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const W = window.innerWidth;
      const H = window.innerHeight;

      for (const { el, dots } of layers) {
        if (!el || el.offsetWidth === 0) continue; // hidden layer (display: none)
        const nodes = el.children;
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          const node = nodes[i] as HTMLElement;

          // fall: move down, wrap from the bottom back to just above the top
          const y0 = (d.y / 100) * H;
          const span = H + d.size * 2;
          let y = ((((y0 + d.size + t * d.speed) % span) + span) % span) - d.size;
          if (PIXEL_STEP > 0) y = Math.round(y / PIXEL_STEP) * PIXEL_STEP; // pixel look
          node.style.transform = `translate(-50%, -50%) translateY(${(y - y0).toFixed(1)}px)`;

          // cursor push (uses the dot's current position)
          let tx = 0;
          let ty = 0;
          if (pointer) {
            const dx = (d.x / 100) * W - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < REACH) {
              const push = (1 - dist / REACH) * PUSH;
              const len = dist || 1;
              tx = (dx / len) * push;
              ty = (dy / len) * push;
            }
          }
          const next = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
          if (node.style.translate !== next) node.style.translate = next;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      pointer = null;
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={wideRef} className="dots dots-wide" aria-hidden="true">
        {WIDE_DOTS.map((d, i) => (
          <span key={i} className="dot" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: d.color }} />
        ))}
      </div>
      <div ref={narrowRef} className="dots dots-narrow" aria-hidden="true">
        {NARROW_DOTS.map((d, i) => (
          <span key={i} className="dot" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, background: d.color }} />
        ))}
      </div>
    </>
  );
}
