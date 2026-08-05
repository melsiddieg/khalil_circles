import React, { useState } from 'react';
import { ALL_CIRCLES, parseMeterPattern } from '../constants';
import { COLLISIONS, COMPOSITIONS_BUILT, LADDER_COUNTS, UNITS, unitById } from '../data/ladder';
import { sequencePeriod } from '../data/rotations';
import { ChevronLeftIcon } from './Icons';
import OrnateDivider from './OrnateDivider';
import { polar, unitColor } from './explore/geometry';
import { useLanguage } from '../i18n/LanguageContext';
import { getCircleName, getMeterName } from '../i18n/names';
import { Circle } from '../types';

const SYMBOL_LTR = { direction: 'ltr', unicodeBidi: 'bidi-override' } as const;
const RUNGS = 5;

/** Prosodic symbols keep their classical order everywhere in the app. */
const Glyph: React.FC<{ unit: string; color: string; size?: number }> = ({
  unit,
  color,
  size = 11,
}) => (
  <span className="font-mono font-bold" style={{ color, fontSize: size, ...SYMBOL_LTR }}>
    {unit}
  </span>
);

/** A moraic string as beads: ● moving, ○ quiescent. Reads left→right in time. */
const Beads: React.FC<{ mora: string; color?: string; size?: number }> = ({
  mora,
  color = 'var(--gold-bright, #E9C87E)',
  size = 9,
}) => (
  <span className="inline-flex items-center gap-[3px]" dir="ltr">
    {[...mora].map((c, i) => (
      <span
        key={i}
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          // A quiescent bead must still read as a beat that happened. At
          // 8px a faint outline disappears and the rhythm looks like gaps,
          // so the ring is full-strength over a dim fill of the same hue.
          background: c === '1' ? color : `${color}26`,
          border: c === '1' ? 'none' : `1.5px solid ${color}`,
          boxSizing: 'border-box',
        }}
      />
    ))}
  </span>
);

const UnitChip: React.FC<{ id: string; circle?: Circle; dim?: boolean }> = ({
  id,
  circle,
  dim,
}) => {
  const u = unitById(id)!;
  const c = circle ? unitColor(id, circle) : unitColor(id, ALL_CIRCLES[0]);
  return (
    <span
      className="inline-flex flex-col items-center gap-1 rounded-lg px-2.5 py-1.5"
      style={{
        backgroundColor: `${c}1f`,
        border: `1px solid ${c}66`,
        opacity: dim ? 0.45 : 1,
      }}
    >
      <Glyph unit={id} color={c} />
      <Beads mora={u.mora} color={c} size={7} />
    </span>
  );
};

/* ── rung 1 ─────────────────────────────────────────────────────── */

const RungLetter: React.FC = () => {
  const { t } = useLanguage();
  // فَعُولُنْ — the simplest foot, letter by letter.
  const letters = [
    { ar: 'فَ', m: '1' },
    { ar: 'عُ', m: '1' },
    { ar: 'و', m: '0' },
    { ar: 'لُ', m: '1' },
    { ar: 'نْ', m: '0' },
  ];
  return (
    <>
      <p className="text-sm text-gray-400 font-amiri leading-relaxed mb-5">{t.ladder.r1Lead}</p>
      <div className="flex flex-wrap items-end justify-center gap-2 mb-5" dir="rtl">
        {letters.map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="font-amiri text-2xl text-amber-100">{l.ar}</span>
            <span
              className="font-mono text-lg font-bold"
              style={{ color: l.m === '1' ? '#E9C87E' : '#6B7280' }}
            >
              {l.m}
            </span>
            <span className="text-[9px] font-amiri text-gray-500">
              {l.m === '1' ? t.ladder.r1Moving : t.ladder.r1Still}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-3">
        <Beads mora="11010" size={13} />
      </div>
      <p className="text-center text-xs text-amber-200/75 font-amiri">{t.ladder.r1Note}</p>
    </>
  );
};

/* ── rung 2 ─────────────────────────────────────────────────────── */

/** One unit row: glyph, beads, bits, name. Module scope — this repo's lint
    forbids declaring a component inside a render. */
const UnitRow: React.FC<{ u: (typeof UNITS)[number]; lang: string }> = ({ u, lang }) => {
  const c = unitColor(u.id, ALL_CIRCLES[0]);
  return (
    <div className="flex items-center gap-3">
      <span className="w-[52px] text-end">
        <Glyph unit={u.id} color={c} size={13} />
      </span>
      <Beads mora={u.mora} color={c} size={9} />
      <span className="font-mono text-[11px] text-gray-500" dir="ltr">
        {u.mora}
      </span>
      <span className="font-amiri text-sm text-gray-300 ms-auto">
        {lang === 'ar' ? u.nameAr : u.nameEn}
      </span>
    </div>
  );
};

const RungUnit: React.FC = () => {
  const { t, lang } = useLanguage();
  const family = UNITS.filter((u) => u.family !== null);
  const odd = UNITS.filter((u) => u.family === null);
  const c1 = ALL_CIRCLES[0];

  return (
    <>
      <p className="text-sm text-gray-400 font-amiri leading-relaxed mb-5">{t.ladder.r2Lead}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900/40 rounded-xl p-4">
          <div className="text-xs label-gold font-amiri mb-3">{t.ladder.r2Family}</div>
          <div className="flex flex-col gap-2.5">
            {family.map((u) => (
              <UnitRow key={u.id} u={u} lang={lang} />
            ))}
          </div>
          <div className="text-center font-mono text-[11px] text-amber-200/70 mt-3" dir="ltr">
            1<sup>k</sup>0 &nbsp;·&nbsp; k = 1, 2, 3
          </div>
        </div>
        <div className="bg-gray-900/40 rounded-xl p-4">
          <div className="text-xs label-gold font-amiri mb-3">{t.ladder.r2Odd}</div>
          <div className="flex flex-col gap-2.5">
            {odd.map((u) => (
              <UnitRow key={u.id} u={u} lang={lang} />
            ))}
          </div>
        </div>
      </div>

      {/* The naming reveal: مجموع / مفروق are readings of the bit pattern. */}
      <div className="panel-engraved rounded-xl p-4 mt-4">
        <h4 className="font-kufi text-amber-300 text-sm mb-2">{t.ladder.r2Reveal}</h4>
        <div className="flex flex-wrap items-center justify-center gap-6 my-3">
          {(['0//', '/0/'] as const).map((id) => {
            const u = unitById(id)!;
            return (
              <div key={id} className="flex flex-col items-center gap-1.5">
                <span className="font-amiri text-base text-gray-200">{u.nameAr}</span>
                <Beads mora={u.mora} color={unitColor(id, c1)} size={13} />
                <span className="font-mono text-xs text-gray-500" dir="ltr">
                  {u.mora}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 font-amiri leading-relaxed">{t.ladder.r2RevealBody}</p>
      </div>
    </>
  );
};

/* ── rung 3 ─────────────────────────────────────────────────────── */

const RungFoot: React.FC = () => {
  const { t, lang } = useLanguage();
  const [pick, setPick] = useState(COMPOSITIONS_BUILT[1].id);
  const comp = COMPOSITIONS_BUILT.find((c) => c.id === pick)!;
  const circle = ALL_CIRCLES.find((c) => c.id === comp.circleIds[0]) ?? ALL_CIRCLES[0];

  return (
    <>
      <p className="text-sm text-gray-400 font-amiri leading-relaxed mb-4">{t.ladder.r3Lead}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {COMPOSITIONS_BUILT.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setPick(c.id)}
            aria-current={c.id === pick}
            className={`px-3 py-1.5 rounded-full border font-amiri text-sm transition-all ${
              c.id === pick
                ? 'border-amber-400/70 bg-amber-400/15 text-amber-200'
                : 'border-gold-soft text-gray-400 hover:text-amber-200 hover:border-gold'
            }`}
          >
            {lang === 'ar' ? c.labelAr : c.labelEn}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 font-amiri mb-3">
        {t.ladder.r3Yields(String(comp.feet.length))} ·{' '}
        <span style={{ color: circle.visualTheme.primaryColor }}>
          {getCircleName(circle, lang)}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {comp.feet.map((f, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{
              background: f.collides ? 'rgba(233,200,126,0.07)' : 'rgba(13,18,32,0.5)',
              border: f.collides
                ? '1px solid rgba(233,200,126,0.45)'
                : '1px solid var(--gold-hairline-soft)',
            }}
            dir="rtl"
          >
            <div className="flex gap-1.5">
              {f.units.map((u, j) => (
                <UnitChip key={j} id={u} circle={circle} />
              ))}
            </div>
            <span className="text-gray-600">←</span>
            <span className="font-amiri text-lg font-bold text-amber-100">{f.nameAr}</span>
            <span className="ms-auto flex items-center gap-2">
              <Beads mora={f.mora} size={8} />
              {f.collides && (
                <span className="text-[10px] font-amiri text-amber-300 border border-amber-400/50 rounded-full px-2 py-0.5">
                  {t.ladder.r3Collide}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* The twist: the map from decomposition to sound is not injective. */}
      <div className="panel-engraved rounded-xl p-4 mt-4">
        <h4 className="font-kufi text-amber-300 text-sm mb-2">{t.ladder.r3Twist}</h4>
        <div className="flex flex-col gap-2 my-3">
          {COLLISIONS.map((c) => (
            <div key={c.mora} className="flex flex-wrap items-center justify-center gap-3">
              {c.feet.map((f, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-amber-300 font-bold">=</span>}
                  <span className="font-amiri text-base text-gray-200">{f.nameAr}</span>
                </React.Fragment>
              ))}
              <Beads mora={c.mora} size={8} />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 font-amiri leading-relaxed">{t.ladder.r3TwistBody}</p>
      </div>
    </>
  );
};

/* ── rung 4 ─────────────────────────────────────────────────────── */

const RungMeter: React.FC = () => {
  const { t, lang } = useLanguage();
  const [cid, setCid] = useState(ALL_CIRCLES[0].id);
  const circle = ALL_CIRCLES.find((c) => c.id === cid)!;

  return (
    <>
      <p className="text-sm text-gray-400 font-amiri leading-relaxed mb-4">{t.ladder.r4Lead}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCid(c.id)}
            aria-current={c.id === cid}
            className="px-3 py-1.5 rounded-full border font-amiri text-sm transition-all"
            style={
              c.id === cid
                ? {
                    borderColor: c.visualTheme.primaryColor,
                    background: `${c.visualTheme.primaryColor}1f`,
                    color: c.visualTheme.primaryColor,
                  }
                : { borderColor: 'var(--gold-hairline-soft)', color: '#9CA3AF' }
            }
          >
            {getCircleName(c, lang)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {circle.meters.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-center gap-3 rounded-xl px-3 py-2 bg-gray-900/40
                       border border-gold-soft"
            dir="rtl"
          >
            <span
              className="font-amiri text-base font-bold min-w-[100px]"
              style={{ color: circle.visualTheme.primaryColor }}
            >
              {getMeterName(m, lang)}
            </span>
            <span className="flex flex-wrap gap-1.5">
              {parseMeterPattern(m, circle).map((tf, i) => (
                <span
                  key={i}
                  className="font-amiri text-sm text-gray-300 rounded-md px-2 py-0.5
                             bg-gray-950/50 border border-gold-soft"
                >
                  {tf.merged}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

/* ── rung 5 ─────────────────────────────────────────────────────── */

const RungCircle: React.FC = () => {
  const { t, lang } = useLanguage();
  const [cid, setCid] = useState(ALL_CIRCLES[0].id);
  const circle = ALL_CIRCLES.find((c) => c.id === cid)!;
  const seq = circle.atomicSequence;
  const n = seq.length;
  // sequencePeriod on a <=10 element array is far cheaper than memoising it.
  const period = sequencePeriod(seq);
  const R = 78;

  return (
    <>
      <p className="text-sm text-gray-400 font-amiri leading-relaxed mb-4">{t.ladder.r5Lead}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {ALL_CIRCLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCid(c.id)}
            aria-current={c.id === cid}
            className="px-3 py-1.5 rounded-full border font-amiri text-sm transition-all"
            style={
              c.id === cid
                ? {
                    borderColor: c.visualTheme.primaryColor,
                    background: `${c.visualTheme.primaryColor}1f`,
                    color: c.visualTheme.primaryColor,
                  }
                : { borderColor: 'var(--gold-hairline-soft)', color: '#9CA3AF' }
            }
          >
            {getCircleName(c, lang)}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* the line, and the same line closed */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1" dir="rtl">
            {seq.map((u, i) => (
              <UnitChip key={i} id={u} circle={circle} />
            ))}
          </div>
          <span className="text-amber-300 text-lg" aria-hidden="true">
            ↓
          </span>
          <svg viewBox="-105 -105 210 210" className="w-52 h-52" role="img" aria-hidden="true">
            <circle
              r={R}
              fill="none"
              stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))"
              strokeWidth="1"
            />
            {seq.map((u, i) => {
              const { x, y } = polar(i, n, R);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={8}
                  fill={unitColor(u, circle)}
                  stroke="rgba(13,18,32,0.9)"
                  strokeWidth="2"
                />
              );
            })}
            <path
              d={`M0,${-R - 14} L-5,${-R - 5} L5,${-R - 5} Z`}
              fill="var(--gold-bright, #E9C87E)"
            />
          </svg>
          <p className="text-xs text-gray-500 font-amiri">
            {t.ladder.r5Note(String(n), String(period))}
          </p>
        </div>

        {/* what each cut reads as */}
        <div className="w-full max-w-xs flex flex-col gap-1.5">
          {circle.meters.map((m, i) => (
            <div
              key={m.id}
              className="flex items-center gap-2 text-sm font-amiri rounded-lg px-3 py-1.5
                         bg-gray-900/40 border border-gold-soft"
            >
              <span className="text-gray-600 font-mono text-[11px]" dir="ltr">
                {i}
              </span>
              <span style={{ color: circle.visualTheme.primaryColor }}>
                {getMeterName(m, lang)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ── the view ───────────────────────────────────────────────────── */

const LadderView: React.FC<{ onBackToHub: () => void }> = ({ onBackToHub }) => {
  const { t, dir } = useLanguage();
  const [rung, setRung] = useState(1);

  const titles = [
    t.ladder.r1Title,
    t.ladder.r2Title,
    t.ladder.r3Title,
    t.ladder.r4Title,
    t.ladder.r5Title,
  ];
  const bodies = [<RungLetter />, <RungUnit />, <RungFoot />, <RungMeter />, <RungCircle />];

  const funnel = [
    { v: LADDER_COUNTS.states, l: t.ladder.funnelStates },
    { v: LADDER_COUNTS.units, l: t.ladder.funnelUnits },
    { v: LADDER_COUNTS.arrangements, l: t.ladder.funnelArr },
    { v: LADDER_COUNTS.distinctFeet, l: t.ladder.funnelFeet },
    { v: LADDER_COUNTS.meters, l: t.ladder.funnelMeters },
    { v: LADDER_COUNTS.circles, l: t.ladder.funnelCircles },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto" dir={dir}>
      <button
        onClick={onBackToHub}
        className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300 font-inter mb-4"
      >
        <ChevronLeftIcon className={`w-5 h-5 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
        {t.ladder.back}
      </button>

      <header className="text-center mb-6">
        <h2 className="heading-display text-3xl md:text-4xl mb-3">{t.ladder.title}</h2>
        <OrnateDivider />
        <p className="text-gray-400 font-amiri text-base leading-relaxed max-w-3xl mx-auto mt-3">
          {t.ladder.subtitle}
        </p>
      </header>

      {/* The rungs, as a ladder you climb */}
      <ol className="flex items-stretch justify-center gap-1.5 mb-5 flex-wrap">
        {titles.map((title, i) => {
          const nth = i + 1;
          const active = nth === rung;
          return (
            <li key={nth}>
              <button
                type="button"
                onClick={() => setRung(nth)}
                aria-current={active}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                  active
                    ? 'border-amber-400/70 bg-amber-400/10'
                    : 'border-gold-soft hover:border-gold bg-gray-900/40'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px]
                              font-mono shrink-0 ${
                                active
                                  ? 'bg-amber-400 text-gray-900 font-bold'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                  dir="ltr"
                >
                  {nth}
                </span>
                <span
                  className={`font-amiri text-xs text-start leading-snug max-w-[9rem] ${
                    active ? 'text-amber-200' : 'text-gray-400'
                  }`}
                >
                  {title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <section key={rung} className="panel-engraved rounded-2xl p-6 mb-4 animate-view-fade">
        <h3 className="text-lg font-bold text-amber-300 font-kufi mb-3">{titles[rung - 1]}</h3>
        {bodies[rung - 1]}
      </section>

      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => setRung((r) => Math.max(1, r - 1))}
          disabled={rung === 1}
          className="px-4 py-2 rounded-full border border-gold-soft text-gray-300 font-amiri text-sm
                     hover:border-gold hover:text-amber-200 disabled:opacity-30 transition-all"
        >
          {t.ladder.prev}
        </button>
        <span className="text-xs text-gray-600 font-mono" dir="ltr">
          {rung} / {RUNGS}
        </span>
        <button
          type="button"
          onClick={() => setRung((r) => Math.min(RUNGS, r + 1))}
          disabled={rung === RUNGS}
          className="px-5 py-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600
                     text-gray-900 font-bold font-amiri text-sm hover:shadow-amber-500/40
                     hover:shadow-lg disabled:opacity-30 disabled:shadow-none transition-all"
        >
          {t.ladder.next}
        </button>
      </div>

      {/* The tally, and what it amounts to */}
      <section className="panel-engraved rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-bold text-amber-300 font-kufi text-center mb-4">
          {t.ladder.funnelTitle}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3 mb-5">
          {funnel.map((f, i) => (
            <React.Fragment key={f.l}>
              {i > 0 && (
                <span className="text-gray-600 mx-1" aria-hidden="true">
                  {/* the funnel flows in the reading direction, so the arrow
                      has to mirror with the language like Controls does */}
                  {dir === 'rtl' ? '←' : '→'}
                </span>
              )}
              <span className="flex flex-col items-center min-w-[74px]">
                <span className="text-2xl font-bold text-amber-300 font-inter">{f.v}</span>
                <span className="text-[10px] text-gray-500 font-amiri text-center leading-tight">
                  {f.l}
                </span>
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-gray-300 font-amiri leading-relaxed text-center max-w-2xl mx-auto">
          {t.ladder.closing}
        </p>
      </section>
    </div>
  );
};

export default LadderView;
