import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle } from '../../types';
import { polar, unitColor } from './geometry';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * «مِداد» — an experiment on Chromium's HTML-in-Canvas API
 * (chrome://flags/#canvas-draw-element, Chromium 147+).
 *
 * The verse is a LIVE DOM child of a <canvas layoutsubtree>: the browser
 * does the full Arabic shaping (the thing SVG textPath famously breaks),
 * ctx.drawElementImage() captures it, and the canvas then
 *   Act I  — bends the captured ink around the circle as genuinely
 *            connected curved calligraphy (pixel slice-warp), and
 *   Act II — on click, dissolves it into particles that condense onto
 *            the circle's unit dots and reform on the next click.
 *
 * Everything is feature-detected; without the flag the stage shows the
 * verse normally plus enable instructions.
 */

// The experimental API surface, typed locally.
interface ExperimentalCtx extends CanvasRenderingContext2D {
  drawElementImage?: (element: Element, x: number, y: number) => void;
}

const detectSupport = (): boolean => {
  if (typeof document === 'undefined') return false;
  const ctx = document.createElement('canvas').getContext('2d');
  return typeof (ctx as ExperimentalCtx | null)?.drawElementImage === 'function';
};

const SIZE = 520; // CSS px, square stage
const RING_R = 168; // radius of the calligraphy ring
const DOT_R = 96; // radius of the unit-dot ring the ink condenses onto
const SLICE_W = 2; // CSS px per warp slice
const PARTICLE_STEP = 2; // sampling stride over the snapshot

interface Particle {
  hx: number; // home (ring) position
  hy: number;
  tx: number; // target (unit dot) position
  ty: number;
  r: number;
  g: number;
  b: number;
  tr: number; // target tint
  tg: number;
  tb: number;
  phase: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

const InkCanvas: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t } = useLanguage();
  const [supported] = useState(detectSupport);
  const [dissolved, setDissolved] = useState(false);
  const [degraded, setDegraded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const verseRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLCanvasElement | null>(null);
  const snapScale = useRef(1); // measured device-px per CSS-px of the snapshot
  const needSnap = useRef(true);
  const particles = useRef<Particle[]>([]);
  const morph = useRef(0); // 0 = ring, 1 = condensed on dots
  const raf = useRef(0);
  // State mirrors readable from inside the render loop without restarting it
  const dissolvedRef = useRef(false);
  const degradedRef = useRef(false);

  const meter = circle.meters[0];
  const verse = useMemo(() => meter.mnemonic?.split('***')[0].trim() ?? meter.name, [meter]);

  // Ask for a fresh snapshot whenever the live element repaints
  // (font swap, theme change, …) — the new `paint` event when available.
  useEffect(() => {
    if (!supported) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mark = () => {
      needSnap.current = true;
    };
    canvas.addEventListener('paint', mark);
    void document.fonts.ready.then(mark);
    return () => canvas.removeEventListener('paint', mark);
  }, [supported]);

  // Main render loop.
  useEffect(() => {
    if (!supported) return;
    const canvas = canvasRef.current;
    const el = verseRef.current;
    if (!canvas || !el) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as ExperimentalCtx | null;
    if (!ctx?.drawElementImage) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [pr, pg, pb] = hexToRgb('#E9C87E'); // engraved-gold ink

    const takeSnapshot = (): boolean => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return false;
      try {
        // The engine's output scale for drawElementImage is not something
        // to assume (it differs between dpr 1 and Retina builds of this
        // experimental API), so we MEASURE instead: draw under identity
        // transform into the full backing store, find the ink's bounding
        // box, crop to it, and derive the device-px-per-CSS-px scale from
        // the measured ink width vs the element's layout width. Drawing
        // offset also leaves room for tashkeel overflowing the border box.
        const OFF = 60;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawElementImage!(el, OFF, OFF);
        const full = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let minX = 1e9,
          maxX = -1,
          minY = 1e9,
          maxY = -1;
        for (let y = 0; y < full.height; y++) {
          for (let x = 0; x < full.width; x++) {
            if (full.data[(y * full.width + x) * 4 + 3] > 12) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0) {
          // Nothing painted yet — try again on a later frame.
          needSnap.current = true;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return false;
        }
        const PAD = 3;
        minX = Math.max(0, minX - PAD);
        minY = Math.max(0, minY - PAD);
        maxX = Math.min(full.width - 1, maxX + PAD);
        maxY = Math.min(full.height - 1, maxY + PAD);
        const bw = maxX - minX + 1;
        const bh = maxY - minY + 1;
        const snap = document.createElement('canvas');
        snap.width = bw;
        snap.height = bh;
        snap.getContext('2d')!.putImageData(full, -minX, -minY);
        snapRef.current = snap;
        // Measured device-px per CSS-px of the captured ink.
        const scale = Math.max(0.25, bw / rect.width);
        snapScale.current = scale;
        buildParticles(snap.getContext('2d')!.getImageData(0, 0, bw, bh), scale);
        degradedRef.current = false;
        setDegraded(false);
      } catch (err) {
        // "No cached paint record" (InvalidStateError) just means the
        // engine hasn't painted the element yet — retry next frame.
        if (err instanceof DOMException && err.name === 'InvalidStateError') {
          needSnap.current = true;
        } else {
          // Tainted canvas / readback refusal: slices & particles are off.
          snapRef.current = null;
          degradedRef.current = true;
          setDegraded(true);
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return true;
    };

    const ringPose = (fracAlong: number, span: number) => {
      // Preserve the image's pixel order along the arc: image-left maps to
      // the arc's left end (the text inside the image is already RTL).
      // Mirroring this mapping shreds the glyphs into reordered slices.
      const angle = -Math.PI / 2 - span / 2 + fracAlong * span;
      return {
        angle,
        x: SIZE / 2 + Math.cos(angle) * RING_R,
        y: SIZE / 2 + Math.sin(angle) * RING_R,
      };
    };

    const buildParticles = (image: ImageData, scale: number) => {
      const w = image.width / scale; // CSS px
      const h = image.height / scale;
      const span = Math.min((w / RING_R) * 1.0, Math.PI * 1.6);
      const dots = circle.atomicSequence.map((unit, i) => {
        const p = polar(i, circle.atomicSequence.length, DOT_R);
        const [r, g, b] = hexToRgb(unitColor(unit, circle));
        return { x: SIZE / 2 + p.x, y: SIZE / 2 + p.y, r, g, b };
      });
      const out: Particle[] = [];
      const stride = Math.max(1, Math.round(PARTICLE_STEP * scale));
      for (let py = 0; py < image.height; py += stride) {
        for (let px = 0; px < image.width; px += stride) {
          const a = image.data[(py * image.width + px) * 4 + 3];
          if (a < 90) continue;
          const frac = px / image.width;
          const pose = ringPose(frac, span);
          const radial = py / scale - h / 2;
          const hx = pose.x + Math.cos(pose.angle) * radial;
          const hy = pose.y + Math.sin(pose.angle) * radial;
          const dot = dots[out.length % dots.length];
          out.push({
            hx,
            hy,
            tx: dot.x + (Math.random() - 0.5) * 14,
            ty: dot.y + (Math.random() - 0.5) * 14,
            r: pr,
            g: pg,
            b: pb,
            tr: dot.r,
            tg: dot.g,
            tb: dot.b,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      particles.current = out;
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (needSnap.current) {
        needSnap.current = false;
        takeSnapshot();
      }

      // Ease the morph toward its target.
      const goal = dissolvedRef.current ? 1 : 0;
      const m0 = morph.current;
      morph.current = m0 + (goal - m0) * Math.min(1, dt * (reduced ? 8 : 2.6));
      const m = morph.current;
      const time = now / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Anchor dots (brighten as the ink condenses on them)
      circle.atomicSequence.forEach((unit, i) => {
        const p = polar(i, circle.atomicSequence.length, DOT_R);
        ctx.beginPath();
        ctx.arc(SIZE / 2 + p.x, SIZE / 2 + p.y, 6 + m * 3, 0, Math.PI * 2);
        ctx.fillStyle = unitColor(unit, circle);
        ctx.globalAlpha = 0.25 + m * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      const snap = snapRef.current;
      const spin = reduced ? 0 : Math.sin(time * 0.35) * 0.12;

      if (snap && m < 0.985) {
        // Act I — the ring: slice-warp the captured ink around the circle.
        const scale = snapScale.current;
        const w = snap.width / scale;
        const h = snap.height / scale;
        const span = Math.min((w / RING_R) * 1.0, Math.PI * 1.6);
        const slices = Math.ceil(w / SLICE_W);
        ctx.globalAlpha = 1 - m;
        ctx.shadowColor = 'rgba(233,200,126,0.45)';
        ctx.shadowBlur = 10;
        for (let s = 0; s < slices; s++) {
          const frac = (s + 0.5) / slices;
          const pose = ringPose(frac, span);
          const angle = pose.angle + spin;
          const x = SIZE / 2 + Math.cos(angle) * RING_R;
          const y = SIZE / 2 + Math.sin(angle) * RING_R;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + Math.PI / 2);
          // Draw slightly wider than the stride so rotated neighbours
          // overlap and no hairline gaps open at the glyph extremities.
          ctx.drawImage(
            snap,
            s * SLICE_W * scale,
            0,
            (SLICE_W + 0.75) * scale,
            snap.height,
            -SLICE_W / 2 - 0.375,
            -h / 2,
            SLICE_W + 0.75,
            h
          );
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else if (!snap && degradedRef.current) {
        // Degraded mode: no pixels — orbit the live element whole.
        const angle = -Math.PI / 2 + spin;
        const rect = el.getBoundingClientRect();
        ctx.save();
        ctx.translate(SIZE / 2 + Math.cos(angle) * RING_R, SIZE / 2 + Math.sin(angle) * RING_R);
        ctx.rotate(angle + Math.PI / 2);
        try {
          ctx.drawElementImage!(el, -rect.width / 2, -rect.height / 2);
        } catch {
          /* nothing more to degrade to */
        }
        ctx.restore();
      }

      // Act II — the ink as particles.
      if (particles.current.length > 0 && m > 0.015) {
        const swirl = m * (1 - m) * 4; // strongest mid-flight
        for (const p of particles.current) {
          const wob = reduced ? 0 : Math.sin(time * 2 + p.phase) * 6 * swirl;
          const x = p.hx + (p.tx - p.hx) * m + wob;
          const y = p.hy + (p.ty - p.hy) * m + Math.cos(time * 1.7 + p.phase) * 4 * swirl;
          const cr = Math.round(p.r + (p.tr - p.r) * m);
          const cg = Math.round(p.g + (p.tg - p.g) * m);
          const cb = Math.round(p.b + (p.tb - p.b) * m);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.55 + m * 0.45})`;
          ctx.fillRect(x, y, 2.4, 2.4);
        }
      }

      raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
    // The loop reads dissolve state through a ref to avoid restarting.
  }, [supported, circle, verse]);

  const toggle = () => {
    setDissolved((d) => {
      dissolvedRef.current = !d;
      return !d;
    });
  };

  if (!supported) {
    return (
      <div className="text-center">
        <p
          className="font-amiri text-2xl leading-loose mb-5"
          dir="rtl"
          lang="ar"
          style={{ color: '#E9C87E' }}
        >
          {verse}
        </p>
        <div className="max-w-md mx-auto rounded-xl border border-dashed border-gold-soft bg-gray-900/40 p-4">
          <p className="font-amiri text-gray-300 text-sm mb-1">{t.explore.inkUnsupportedTitle}</p>
          <p className="font-amiri text-gray-500 text-xs mb-2">{t.explore.inkUnsupportedBody}</p>
          <code
            className="font-mono text-xs text-amber-300 bg-gray-950/60 rounded px-2 py-1 select-all"
            dir="ltr"
          >
            chrome://flags/#canvas-draw-element
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={dissolved}
        className="mb-2 px-5 py-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900
                   font-bold font-amiri text-sm hover:shadow-amber-500/40 hover:shadow-lg active:scale-95 transition-all"
      >
        {dissolved ? t.explore.inkReform : t.explore.inkDissolve}
      </button>
      {degraded && <p className="text-xs text-gray-500 font-amiri mb-1">{t.explore.inkDegraded}</p>}
      {/* The live, invisible-until-drawn verse lives INSIDE the canvas. */}
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}
        role="img"
        aria-label={`${t.explore.inkTitle} — ${verse}`}
        {...({ layoutsubtree: '' } as Record<string, string>)}
      >
        <div
          ref={verseRef}
          dir="rtl"
          lang="ar"
          style={{
            width: 'max-content',
            padding: '6px 10px',
            fontFamily: "'Amiri', serif",
            fontSize: '30px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            color: '#E9C87E',
          }}
        >
          {verse}
        </div>
      </canvas>
    </div>
  );
};

export default InkCanvas;
