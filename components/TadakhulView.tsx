import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_CIRCLES } from '../constants';
import { CONFUSION_EDGES, ConfusionEdge, isolatedMeterIds } from '../data/tadakhul';
import { getMeterById } from '../data/circles';
import { Circle } from '../types';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import { expandUnits, unitColor } from './explore/geometry';
import { useDrawProgress, usePrefersReducedMotion } from '../utils/animation';
import { easeOutBack, laggedProgress, smooth, window as subWindow } from '../utils/rate';
import { hit, ensureAudioContext } from '../utils/percussion';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';

interface TadakhulViewProps {
  onBackToHub: () => void;
}

const SYMBOL_LTR = { direction: 'ltr', unicodeBidi: 'bidi-override' } as const;

/** A unit chip in the app's shared vocabulary: colored box + classical symbol. */
const UnitChip: React.FC<{ unit: string; circle: Circle; ghost?: boolean; style?: React.CSSProperties }> = ({
  unit,
  circle,
  ghost = false,
  style,
}) => (
  <span
    className="inline-flex items-center justify-center rounded-md font-mono font-bold"
    style={{
      width: 40,
      height: 26,
      fontSize: 11,
      color: unitColor(unit, circle),
      backgroundColor: `${unitColor(unit, circle)}${ghost ? '10' : '22'}`,
      border: `1px ${ghost ? 'dashed' : 'solid'} ${unitColor(unit, circle)}${ghost ? '55' : '88'}`,
      ...SYMBOL_LTR,
      ...style,
    }}
  >
    {unit}
  </span>
);

/**
 * «الجسر» — the fāṣila collapse performed on the whole necklace of
 * circle 2, yielding circle 3. One timeline: circle-2 tape lands, each
 * fāṣila folds into two cords (LaggedStart), the circle-3 tape settles,
 * then the two meter descents and the birth of al-Ramal caption in.
 */
const Bridge: React.FC<{ replayKey: number }> = ({ replayKey }) => {
  const { t, lang } = useLanguage();
  const c2 = ALL_CIRCLES.find((c) => c.id === 'circle2-pure')!;
  const c3 = ALL_CIRCLES.find((c) => c.id === 'circle3-contracted')!;
  return <BridgeScene key={replayKey} c2={c2} c3={c3} t={t} lang={lang} />;
};

const BridgeScene: React.FC<{
  c2: Circle;
  c3: Circle;
  t: ReturnType<typeof useLanguage>['t'];
  lang: string;
}> = ({ c2, c3, t }) => {
  const time = useDrawProgress(4200);
  const tTop = subWindow(time, 0, 0.2);
  const tFold = subWindow(time, 0.22, 0.62);
  const tBottom = subWindow(time, 0.55, 0.78);
  const tCaptions = subWindow(time, 0.74, 1);

  // circle-2 tape: 6 units; the fāṣilas (odd positions) fold
  const seq2 = c2.atomicSequence;
  const seq3 = c3.atomicSequence;
  const fasilaOrdinal = (i: number) => (i - 1) / 2; // 1,3,5 → 0,1,2

  return (
    <div className="flex flex-col items-center gap-1">
      {/* circle 2 tape */}
      <div className="flex items-center gap-2 mb-1" dir="rtl">
        <span className="w-20 text-end font-amiri text-sm" style={{ color: c2.visualTheme.primaryColor }}>
          {getCircleName(c2, 'ar')}
        </span>
        <div className="flex gap-1.5" dir="rtl">
          {seq2.map((u, i) => {
            const p = smooth(laggedProgress(tTop, i, seq2.length, 0.4));
            const folding = u === '0///' ? smooth(laggedProgress(tFold, fasilaOrdinal(i), 3, 0.4)) : 0;
            return (
              <span key={i} style={{ opacity: p * (1 - 0.65 * folding), transform: `scale(${1 - 0.12 * folding})` }}>
                <UnitChip unit={u} circle={c2} />
              </span>
            );
          })}
        </div>
      </div>

      {/* the fold arrows */}
      <div className="flex items-center gap-1.5 text-lg" dir="rtl" aria-hidden="true">
        {seq2.map((u, i) =>
          u === '0///' ? (
            <span
              key={i}
              className="font-mono"
              style={{
                color: 'var(--gold-bright, #E9C87E)',
                opacity: smooth(laggedProgress(tFold, fasilaOrdinal(i), 3, 0.4)),
                fontSize: 13,
              }}
            >
              ⤋⤋
            </span>
          ) : (
            <span key={i} style={{ width: 40 }} />
          )
        )}
      </div>

      {/* circle 3 tape: cords born from each fāṣila arrive with its fold */}
      <div className="flex items-center gap-2 mt-1" dir="rtl">
        <span className="w-20 text-end font-amiri text-sm" style={{ color: c3.visualTheme.primaryColor }}>
          {getCircleName(c3, 'ar')}
        </span>
        <div className="flex gap-1.5" dir="rtl">
          {seq3.map((u, i) => {
            // positions 0,3,6 are the surviving pegs; the cord pairs follow their fāṣila
            const foot = Math.floor(i / 3);
            const isPeg = i % 3 === 0;
            const p = isPeg
              ? smooth(laggedProgress(tBottom, foot, 3, 0.4))
              : smooth(laggedProgress(tFold, foot, 3, 0.4));
            return (
              <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * -8}px)` }}>
                <UnitChip unit={u} circle={c3} />
              </span>
            );
          })}
        </div>
      </div>

      {/* consequences */}
      <div
        className="mt-4 grid gap-2 text-center font-amiri text-sm"
        style={{ opacity: smooth(subWindow(tCaptions, 0, 0.5)) }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1.5 rounded-full border border-gold-soft bg-gray-900/50 text-gray-300">
            {t.tadakhul.bridgeWafir}
          </span>
          <span className="px-3 py-1.5 rounded-full border border-gold-soft bg-gray-900/50 text-gray-300">
            {t.tadakhul.bridgeKamil}
          </span>
        </div>
        <p
          className="max-w-xl mx-auto text-[13px] leading-relaxed text-amber-200/80"
          style={{ opacity: smooth(subWindow(tCaptions, 0.4, 1)) }}
        >
          {t.tadakhul.bridgeRamal}
        </p>
      </div>
    </div>
  );
};

/** Deterministic map: five circle columns (reading order, right to left), edges as curves. */
const ConfusionGraph: React.FC<{
  selected: string | null;
  onSelect: (id: string) => void;
}> = ({ selected, onSelect }) => {
  const { t, lang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  // Mount timeline: nodes land (LaggedStart, overshoot), then the chords
  // write themselves, then the mechanism labels fade in. After the write,
  // the selected chord carries a streaming current toward its target.
  const time = useDrawProgress(2200);
  const tNodes = subWindow(time, 0, 0.45);
  const tEdges = subWindow(time, 0.4, 0.85);
  const tLabels = subWindow(time, 0.8, 1);
  const written = time >= 1;

  // Layout in SVG space. Columns laid right-to-left: circle 1 rightmost.
  const W = 880;
  const COL_W = 150;
  const colX = (order: number) => W - 85 - (order - 1) * (COL_W + 26); // center x of column
  const nodeH = 30;
  const nodeW = 108;

  const nodes = useMemo(() => {
    const out = new Map<string, { x: number; y: number; circle: Circle }>();
    ALL_CIRCLES.forEach((c) => {
      const x = colX(c.order);
      c.meters.forEach((m, i) => {
        out.set(m.id, { x, y: 78 + i * (nodeH + 14), circle: c });
      });
    });
    return out;
  }, []);

  const isolated = useMemo(
    () => new Set(isolatedMeterIds(ALL_CIRCLES.flatMap((c) => c.meters.map((m) => m.id)))),
    []
  );
  const nodeOrder = useMemo(() => [...nodes.keys()], [nodes]);

  const H = 78 + 6 * (nodeH + 14) + 10;

  const edgePath = (e: ConfusionEdge): string => {
    const a = nodes.get(e.fromMeterId)!;
    const b = nodes.get(e.toMeterId)!;
    if (e.kind === 'rotation') {
      // same column: bow out to the outer side (left of column 4)
      const x = a.x - nodeW / 2;
      return `M ${x} ${a.y} C ${x - 52} ${a.y}, ${x - 52} ${b.y}, ${x} ${b.y}`;
    }
    // cross-column: from the variant's inner edge toward the original's
    const x1 = a.x + (b.x > a.x ? nodeW / 2 : -nodeW / 2);
    const x2 = b.x + (b.x > a.x ? -nodeW / 2 : nodeW / 2);
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`;
  };

  const kindColor = (k: ConfusionEdge['kind']) =>
    k === 'collapse' ? '#E9C87E' : k === 'lossy' ? '#9CA3AF' : '#67E8F9';

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto w-full max-w-4xl min-w-[720px]"
        role="img"
        aria-label={t.tadakhul.mapTitle}
      >
        {/* column headers */}
        {ALL_CIRCLES.map((c) => (
          <text
            key={c.id}
            x={colX(c.order)}
            y={40}
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fill={c.visualTheme.primaryColor}
            className="font-amiri"
          >
            {getCircleName(c, lang)}
          </text>
        ))}

        {/* edges under nodes */}
        {CONFUSION_EDGES.map((e, ei) => {
          const active = selected === e.id;
          const c = kindColor(e.kind);
          // Each chord Writes itself along its own length; afterwards the
          // selected one streams its dashes toward the meter it lands on.
          const writeP = smooth(laggedProgress(tEdges, ei, CONFUSION_EDGES.length, 0.4));
          const drawProps = written
            ? active && !reduced
              ? { strokeDasharray: '6 5', className: 'animate-tad-flow' }
              : { strokeDasharray: e.kind === 'collapse' ? undefined : '5 4' }
            : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - writeP };
          return (
            <g key={e.id}>
              <path
                d={edgePath(e)}
                fill="none"
                stroke={c}
                strokeOpacity={active ? 0.95 : 0.45}
                strokeWidth={active ? 2.6 : 1.5}
                markerEnd={writeP > 0.95 ? `url(#arrow-${e.kind}${active ? '-hi' : ''})` : undefined}
                style={{ transition: 'stroke-opacity 200ms, stroke-width 200ms' }}
                {...drawProps}
              />
              {/* fat invisible hit target */}
              <path
                d={edgePath(e)}
                fill="none"
                stroke="transparent"
                strokeWidth="16"
                className="cursor-pointer"
                onClick={() => onSelect(e.id)}
              />
              {/* mechanism label at curve midpoint */}
              <g opacity={tLabels}>
                <MechanismLabel e={e} path={edgePath(e)} active={active} color={c} onSelect={onSelect} />
              </g>
            </g>
          );
        })}

        {/* nodes — origin-centred groups so the landing pop scales in place */}
        {ALL_CIRCLES.map((c) =>
          c.meters.map((m) => {
            const n = nodes.get(m.id)!;
            const lonely = isolated.has(m.id);
            const nodeIdx = nodeOrder.indexOf(m.id);
            const pop = reduced ? 1 : easeOutBack(laggedProgress(tNodes, nodeIdx, nodeOrder.length, 0.25));
            const inSelected =
              selected &&
              CONFUSION_EDGES.some(
                (e) => e.id === selected && (e.fromMeterId === m.id || e.toMeterId === m.id)
              );
            return (
              <g
                key={m.id}
                opacity={(lonely ? 0.5 : 1) * Math.min(1, pop * 1.4)}
                transform={`translate(${n.x} ${n.y}) scale(${Math.max(0.01, pop)})`}
              >
                <rect
                  x={-nodeW / 2}
                  y={-nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  rx={8}
                  fill={`${c.visualTheme.primaryColor}${inSelected ? '30' : '14'}`}
                  stroke={inSelected ? 'var(--gold-bright, #E9C87E)' : c.visualTheme.primaryColor}
                  strokeOpacity={inSelected ? 1 : 0.5}
                  strokeWidth={inSelected ? 1.8 : 1}
                  strokeDasharray={lonely ? '3 3' : undefined}
                  style={{ transition: 'stroke 200ms, fill 200ms' }}
                />
                <text
                  x={0}
                  y={1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#E5E7EB"
                  className="font-amiri pointer-events-none"
                >
                  {getMeterName(m, lang)}
                </text>
              </g>
            );
          })
        )}

        <defs>
          {(['collapse', 'lossy', 'rotation'] as const).flatMap((k) =>
            [false, true].map((hi) => (
              <marker
                key={`${k}${hi}`}
                id={`arrow-${k}${hi ? '-hi' : ''}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={kindColor(k)} fillOpacity={hi ? 0.95 : 0.55} />
              </marker>
            ))
          )}
        </defs>
      </svg>

      {/* legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-1 text-xs font-amiri text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5" style={{ backgroundColor: '#E9C87E' }} />
          {t.tadakhul.kindCollapse}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-6 h-0.5"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #9CA3AF 0 5px, transparent 5px 9px)',
            }}
          />
          {t.tadakhul.kindLossy}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-6 h-0.5"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #67E8F9 0 5px, transparent 5px 9px)',
            }}
          />
          {t.tadakhul.kindRotation}
        </span>
      </div>
    </div>
  );
};

/** Mechanism name pinned to the curve's midpoint (approximated from its endpoints). */
const MechanismLabel: React.FC<{
  e: ConfusionEdge;
  path: string;
  active: boolean;
  color: string;
  onSelect: (id: string) => void;
}> = ({ e, path, active, color, onSelect }) => {
  const { lang } = useLanguage();
  // cheap midpoint: average of the M and final points in the path string
  const nums = path.match(/-?[\d.]+/g)!.map(Number);
  const x = (nums[0] + nums[nums.length - 2]) / 2 + (e.kind === 'rotation' ? -52 : 0);
  const y = (nums[1] + nums[nums.length - 1]) / 2 + (e.kind === 'rotation' ? 0 : -7);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="11"
      fontWeight={active ? 700 : 500}
      fill={color}
      fillOpacity={active ? 1 : 0.8}
      className="font-amiri cursor-pointer"
      onClick={() => onSelect(e.id)}
    >
      {lang === 'ar' ? e.mechanismAr : e.mechanismEn}
    </text>
  );
};

/** One foot: its name and its unit chips — or, when ziḥāf has broken the
    unit grammar, its bare moraic string in a dashed frame. */
const Foot: React.FC<{ foot: ConfusionEdge['footBefore']; circle: Circle }> = ({ foot, circle }) => (
  <div className="flex flex-col items-center gap-1.5">
    <span className="font-amiri text-lg" style={{ color: circle.visualTheme.primaryColor }}>
      {foot.nameAr}
    </span>
    {foot.units ? (
      <div className="flex gap-1" dir="rtl">
        {foot.units.map((u, i) => (
          <UnitChip key={i} unit={u} circle={circle} />
        ))}
      </div>
    ) : (
      <span
        className="font-mono text-sm px-2 py-1 rounded-md border border-dashed border-gold-soft text-gray-300"
        style={SYMBOL_LTR}
      >
        {foot.mora}
      </span>
    )}
  </div>
);

/** One sounding step of the bench: a prosodic letter, or an anchor rest. */
interface BenchStep {
  sym: '1' | '0';
  unitInitial: boolean;
  color: string;
  /** the letter the ziḥāf touches (collapse edges) */
  marked?: boolean;
  /** an inserted end-of-line rest, not a letter of the foot */
  anchor?: boolean;
}

/** Letters of a foot: from its unit chips, or from a bare moraic string. */
const footSteps = (foot: ConfusionEdge['footBefore'], circle: Circle): BenchStep[] => {
  if (foot.units) {
    return expandUnits(foot.units).map((l) => ({
      sym: l.sym,
      unitInitial: l.unitInitial,
      color: unitColor(foot.units![l.unitIndex], circle),
    }));
  }
  // storage convention: rightmost symbol = first sound
  return (foot.mora ?? '')
    .split('')
    .reverse()
    .map((ch, i) => ({
      sym: ch === '/' ? '1' : '0',
      unitInitial: i === 0,
      color: circle.visualTheme.primaryColor,
    }));
};

/**
 * «المِسمَع» — the listening bench. The confusion is an auditory fact,
 * so it should be heard, live:
 *  · collapse edges: toggle the ziḥāf WHILE it plays — one drum stroke
 *    (the ringed letter) falls silent, and the meter crosses the bridge;
 *  · lossy edges: the foot swaps for its clipped form mid-loop;
 *  · the rotation edge: the line loops both feet; toggle the ANCHOR
 *    (an end-of-line rest) — without it the two starting points are one
 *    sound, with it the difference returns. The short anchor, audible.
 */
const SoundBench: React.FC<{ edge: ConfusionEdge; fromCircle: Circle; toCircle: Circle }> = ({
  edge,
  fromCircle,
  toCircle,
}) => {
  const { t, lang } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [applied, setApplied] = useState(false); // ziḥāf applied / start swapped
  const [anchor, setAnchor] = useState(edge.kind === 'rotation');
  const [pos, setPos] = useState(-1);
  const ctxRef = useRef<AudioContext | null>(null);
  const seqRef = useRef<BenchStep[]>([]);

  const mechanism = lang === 'ar' ? edge.mechanismAr : edge.mechanismEn;

  const steps = useMemo((): BenchStep[] => {
    let out: BenchStep[];
    if (edge.kind === 'rotation') {
      const a = footSteps(edge.footBefore, fromCircle);
      const b = footSteps(edge.footAfter, toCircle);
      out = applied ? [...b, ...a] : [...a, ...b];
    } else if (!applied) {
      out = footSteps(edge.footBefore, fromCircle);
    } else if (edge.kind === 'collapse') {
      out = footSteps(edge.footAfter, toCircle);
    } else {
      out = footSteps(edge.footAfter, fromCircle);
    }
    // Mark the quiesced letter on collapse edges: same length before and
    // after, differing in exactly one symbol (enforced by test).
    if (edge.kind === 'collapse') {
      const before = footSteps(edge.footBefore, fromCircle);
      const after = footSteps(edge.footAfter, toCircle);
      before.forEach((s, i) => {
        if (after[i] && s.sym !== after[i].sym && out[i]) out[i] = { ...out[i], marked: true };
      });
    }
    if (anchor) {
      out = [
        ...out,
        { sym: '0', unitInitial: false, color: '#6B7280', anchor: true },
        { sym: '0', unitInitial: false, color: '#6B7280', anchor: true },
      ];
    }
    return out;
  }, [edge, fromCircle, toCircle, applied, anchor]);

  useEffect(() => {
    seqRef.current = steps;
  }, [steps]);

  // Lookahead scheduler + playhead, alive while playing (Rhythm Clock's pattern).
  useEffect(() => {
    if (!playing) return;
    const ctx = ensureAudioContext(ctxRef.current);
    ctxRef.current = ctx;
    void ctx.resume();

    let idx = 0;
    let next = ctx.currentTime + 0.1;
    const queue: { time: number; idx: number }[] = [];
    const scheduler = setInterval(() => {
      while (next < ctx.currentTime + 0.18) {
        const seq = seqRef.current;
        const s = seq[idx % seq.length];
        if (s && s.sym === '1') hit(ctx, next, s.unitInitial);
        queue.push({ time: next, idx: idx % seq.length });
        next += 0.175;
        idx += 1;
      }
    }, 30);

    let raf = 0;
    const loop = () => {
      while (queue.length > 1 && queue[1].time <= ctx.currentTime) queue.shift();
      if (queue.length && queue[0].time <= ctx.currentTime) setPos(queue[0].idx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      clearInterval(scheduler);
      cancelAnimationFrame(raf);
      void ctx.suspend();
      setPos(-1);
    };
  }, [playing]);

  // Release the audio context for good on unmount (edge change remounts).
  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    []
  );

  const note =
    edge.kind === 'collapse'
      ? t.tadakhul.benchNoteCollapse
      : edge.kind === 'lossy'
        ? t.tadakhul.benchNoteLossy
        : t.tadakhul.benchNoteRotation;

  return (
    <div className="rounded-xl border border-gold-soft bg-gray-950/50 p-4 mt-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3">
        <span className="text-xs label-gold font-amiri me-1">{t.tadakhul.benchTitle}</span>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className="px-4 py-1.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900
                     font-bold font-amiri text-sm hover:shadow-amber-500/40 hover:shadow-lg active:scale-95 transition-all"
        >
          {playing ? t.tadakhul.benchStop : t.tadakhul.benchPlay}
        </button>
        <button
          type="button"
          onClick={() => setApplied((a) => !a)}
          aria-pressed={applied}
          className={`px-3.5 py-1.5 rounded-full border font-amiri text-sm transition-all ${
            applied
              ? 'border-amber-400/70 bg-amber-400/15 text-amber-200'
              : 'border-gold-soft text-gray-300 hover:border-gold hover:text-amber-200'
          }`}
        >
          {edge.kind === 'rotation'
            ? t.tadakhul.benchSwapStart
            : applied
              ? t.tadakhul.benchUndo(mechanism)
              : t.tadakhul.benchApply(mechanism)}
        </button>
        <label
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-amiri text-xs cursor-pointer transition-all ${
            anchor ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-200' : 'border-gold-soft text-gray-400'
          }`}
        >
          <input
            type="checkbox"
            checked={anchor}
            onChange={(e) => setAnchor(e.target.checked)}
            className="accent-cyan-300 cursor-pointer"
          />
          {t.tadakhul.benchAnchor}
        </label>
      </div>

      {/* the letters, sounding */}
      <div className="flex justify-center">
        <div className="flex gap-1 items-center" dir="rtl">
          {steps.map((s, i) => {
            const active = pos === i;
            return s.anchor ? (
              <span
                key={i}
                className="w-2 h-8 rounded-sm transition-colors duration-100"
                style={{
                  backgroundColor: active ? 'rgba(103,232,249,0.35)' : 'rgba(103,232,249,0.12)',
                  border: '1px dashed rgba(103,232,249,0.5)',
                }}
                title={t.tadakhul.benchAnchor}
              />
            ) : (
              <span
                key={i}
                className="w-6 h-9 rounded-md flex items-center justify-center transition-all duration-100"
                style={{
                  backgroundColor: active ? `${s.color}33` : 'rgba(13,18,32,0.7)',
                  border: s.marked
                    ? '1.6px solid var(--gold-bright, #E9C87E)'
                    : `1px solid ${active ? s.color : 'rgba(212,176,106,0.16)'}`,
                  boxShadow: active ? `0 0 8px ${s.color}66` : undefined,
                  transform: active ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                <span
                  className="text-[13px] font-bold"
                  style={{ color: s.sym === '1' ? s.color : '#4B5563' }}
                >
                  {s.sym === '1' ? '●' : '○'}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* legend + the point of the exercise */}
      <div className="flex justify-center gap-4 text-[10px] text-gray-500 font-amiri mt-2.5">
        <span>● {t.tadakhul.benchDum}</span>
        <span>○ {t.tadakhul.benchRest}</span>
        {edge.kind === 'collapse' && (
          <span className="text-amber-300/80">◉ {mechanism}</span>
        )}
      </div>
      <p className="text-center text-xs text-gray-400 font-amiri leading-relaxed mt-2 max-w-xl mx-auto">
        {note}
      </p>
    </div>
  );
};

/** The anatomy of one confusion, laid out under the map. */
const EdgeDetail: React.FC<{ edge: ConfusionEdge }> = ({ edge }) => {
  const { t, lang } = useLanguage();
  const from = getMeterById(edge.fromMeterId)!;
  const to = getMeterById(edge.toMeterId)!;

  return (
    <div className="panel-engraved rounded-2xl p-5 animate-view-fade">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4 font-amiri">
        <span className="text-xl font-bold" style={{ color: from.circle.visualTheme.primaryColor }}>
          {getMeterName(from.meter, lang)}
        </span>
        <span className="text-gray-500 text-sm">
          {lang === 'ar' ? edge.mechanismAr : edge.mechanismEn} ←
        </span>
        <span className="text-xl font-bold" style={{ color: to.circle.visualTheme.primaryColor }}>
          {getMeterName(to.meter, lang)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-5 mb-4" dir="rtl">
        <div className="text-center">
          <div className="text-[10px] label-gold font-amiri mb-1">{t.tadakhul.detailBefore}</div>
          <Foot foot={edge.footBefore} circle={from.circle} />
        </div>
        <span className="text-2xl text-amber-300" aria-hidden="true">
          ←
        </span>
        <div className="text-center">
          <div className="text-[10px] label-gold font-amiri mb-1">{t.tadakhul.detailAfter}</div>
          <Foot foot={edge.footAfter} circle={to.circle} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm font-amiri leading-relaxed">
        <div className="bg-gray-900/40 rounded-xl p-3">
          <div className="text-xs label-gold mb-1">{t.tadakhul.detailMechanism}</div>
          <p className="text-gray-300">{lang === 'ar' ? edge.effectAr : edge.effectEn}</p>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-3">
          <div className="text-xs label-gold mb-1">{t.tadakhul.detailWhere}</div>
          <p className="text-gray-300">{lang === 'ar' ? edge.whereAr : edge.whereEn}</p>
        </div>
        {edge.rulingAr && (
          <div className="bg-gray-900/40 rounded-xl p-3 sm:col-span-2">
            <div className="text-xs label-gold mb-1">{t.tadakhul.detailRuling}</div>
            <p className="text-gray-300">{lang === 'ar' ? edge.rulingAr : edge.rulingEn}</p>
          </div>
        )}
        {edge.shahid && (
          <div className="bg-gray-900/40 rounded-xl p-3 sm:col-span-2 text-center">
            <div className="text-xs label-gold mb-1">{t.tadakhul.detailShahid}</div>
            <p className="font-amiri text-lg text-amber-100" lang="ar" dir="rtl">
              {edge.shahid.textAr}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'ar' ? edge.shahid.noteAr : edge.shahid.noteEn}
            </p>
          </div>
        )}
      </div>

      <SoundBench edge={edge} fromCircle={from.circle} toCircle={to.circle} />
    </div>
  );
};

const TadakhulView: React.FC<TadakhulViewProps> = ({ onBackToHub }) => {
  const { t, dir } = useLanguage();
  const [selectedEdge, setSelectedEdge] = useState<string | null>('kamil-rajaz');
  const [bridgeRun, setBridgeRun] = useState(0);

  const edge = CONFUSION_EDGES.find((e) => e.id === selectedEdge) ?? null;

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-5 h-5 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
        {t.tadakhul.back}
      </button>

      <header className="text-center mb-6">
        <h2 className="heading-display text-3xl md:text-4xl mb-3">{t.tadakhul.title}</h2>
        <OrnateDivider />
        <p className="text-gray-400 font-amiri text-base leading-relaxed max-w-3xl mx-auto mt-3">
          {t.tadakhul.subtitle}
        </p>
      </header>

      {/* The bridge: one operation, two famous confusions */}
      <section className="panel-engraved rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-amber-300 font-kufi text-center">
            {t.tadakhul.bridgeTitle}
          </h3>
          <button
            type="button"
            onClick={() => setBridgeRun((r) => r + 1)}
            aria-label={t.tadakhul.bridgeReplay}
            title={t.tadakhul.bridgeReplay}
            className="text-gray-500 hover:text-amber-300 transition-colors text-base leading-none"
          >
            ↻
          </button>
        </div>
        <p className="text-sm text-gray-400 font-amiri leading-relaxed max-w-3xl mx-auto text-center mb-5">
          {t.tadakhul.bridgeIntro}
        </p>
        <Bridge replayKey={bridgeRun} />
      </section>

      {/* The map */}
      <section className="panel-engraved rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-amber-300 font-kufi text-center mb-1">
          {t.tadakhul.mapTitle}
        </h3>
        <p className="text-xs text-gray-500 font-amiri text-center mb-3">{t.tadakhul.mapHint}</p>
        <ConfusionGraph selected={selectedEdge} onSelect={setSelectedEdge} />
      </section>

      {/* Anatomy of the selected chord */}
      <section className="mb-6">
        {edge ? (
          <EdgeDetail key={edge.id} edge={edge} />
        ) : (
          <p className="text-center text-gray-500 font-amiri">{t.tadakhul.selectPrompt}</p>
        )}
      </section>

      {/* The reading of the map */}
      <section className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="panel-engraved rounded-2xl p-5">
          <h4 className="font-kufi text-amber-300 mb-2">{t.tadakhul.whyTitle}</h4>
          <p className="text-sm text-gray-400 font-amiri leading-relaxed">{t.tadakhul.whyBody}</p>
          <p className="text-sm text-amber-200/75 font-amiri leading-relaxed mt-2">
            {t.tadakhul.whyException}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="panel-engraved rounded-2xl p-5">
            <h4 className="font-kufi text-amber-300 mb-2">{t.tadakhul.decodeTitle}</h4>
            <p className="text-sm text-gray-400 font-amiri leading-relaxed">{t.tadakhul.decodeBody}</p>
          </div>
        </div>
        <div className="panel-engraved rounded-2xl p-5">
          <h4 className="font-kufi text-amber-300 mb-2">{t.tadakhul.isolatedTitle}</h4>
          <p className="text-sm text-gray-400 font-amiri leading-relaxed">{t.tadakhul.isolatedNote}</p>
        </div>
        <div className="panel-engraved rounded-2xl p-5">
          <h4 className="font-kufi text-amber-300 mb-2">
            <span className="font-amiri">الرجز</span> ⤳
          </h4>
          <p className="text-sm text-gray-400 font-amiri leading-relaxed">{t.tadakhul.rajazNote}</p>
        </div>
      </section>
    </div>
  );
};

export default TadakhulView;
