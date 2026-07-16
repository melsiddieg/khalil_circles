import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * A three-blade ceiling fan you can turn by a third. Unmarked, it looks
 * untouched no matter how often you turn it — which IS the definition of
 * a symmetry; mark one blade and the same turn becomes visible. The
 * cheapest possible demonstration that C₃ stabilizes the shape.
 */
const Fan: React.FC = () => {
  const { t } = useLanguage();
  const [turns, setTurns] = useState(0);
  const [marked, setMarked] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="-50 -50 100 100" className="w-20 h-20 shrink-0" aria-hidden="true">
        <circle r="46" fill="none" stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))" strokeWidth="1" />
        <g
          style={{
            transform: `rotate(${turns * 120}deg)`,
            transformOrigin: 'center',
            transition: 'transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1)',
          }}
        >
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`rotate(${i * 120})`}>
              <path
                d="M 0 -4 C -11 -14, -12 -32, 0 -42 C 12 -32, 11 -14, 0 -4 Z"
                fill="var(--gold-bright, #E9C87E)"
                fillOpacity="0.75"
                stroke="var(--gold-bright, #E9C87E)"
                strokeWidth="1"
              />
              {marked && i === 0 && <circle cy="-30" r="4.5" fill="#2DD4BF" />}
            </g>
          ))}
        </g>
        <circle r="5" fill="#0d1424" stroke="var(--gold-bright, #E9C87E)" strokeWidth="1.5" />
      </svg>

      <div className="flex flex-col gap-1.5 min-w-0">
        <button
          type="button"
          onClick={() => setTurns((n) => n + 1)}
          className="px-2.5 py-1 rounded-full bg-amber-500/90 text-gray-900 font-bold font-amiri
                     text-[11px] hover:bg-amber-400 active:scale-95 transition-all"
        >
          ↻ {t.math.glossFanTurn}
        </button>
        <label className="flex items-center gap-1.5 text-[11px] text-gray-400 font-amiri cursor-pointer">
          <input
            type="checkbox"
            checked={marked}
            onChange={(e) => setMarked(e.target.checked)}
            className="accent-teal-400 cursor-pointer"
          />
          {t.math.glossFanMark}
        </label>
        <p className="text-[10px] leading-snug font-amiri text-gray-500">
          {marked ? t.math.glossFanMoved : t.math.glossFanSame}
        </p>
      </div>
    </div>
  );
};

const Entry: React.FC<{ q: string; a: string; children?: React.ReactNode }> = ({ q, a, children }) => (
  <div>
    <h4 className="font-kufi text-[13px] text-amber-300/90 mb-1">{q}</h4>
    <p className="font-amiri text-[13px] leading-relaxed text-gray-400">{a}</p>
    {children && <div className="mt-2">{children}</div>}
  </div>
);

/**
 * «شرحٌ على الهامش» — the plain-language companion to the group-theory
 * panel, in the spirit of the marginal commentary (ḥāshiya) that classical
 * manuscripts carried beside their dense main text: no notation, everyday
 * analogies, one thing you can poke.
 */
const GroupTheoryGloss: React.FC = () => {
  const { t } = useLanguage();

  return (
    <aside
      className="rounded-2xl border border-dashed border-gold-soft bg-gray-950/40 p-4
                 flex flex-col gap-3.5 self-start"
      aria-label={t.math.glossTitle}
    >
      <header>
        <h3 className="font-kufi text-base text-amber-300 mb-0.5">{t.math.glossTitle}</h3>
        <p className="font-amiri text-[11px] text-gray-500 leading-snug">{t.math.glossSubtitle}</p>
        <div className="flex items-center gap-2 mt-2" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-l from-amber-500/40 to-transparent" />
          <span className="text-amber-500/70 text-[10px]">✦</span>
          <span className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
        </div>
      </header>

      <Entry q={t.math.glossQ1} a={t.math.glossA1} />
      <Entry q={t.math.glossQ2} a={t.math.glossA2} />
      <Entry q={t.math.glossQ3} a={t.math.glossA3}>
        <Fan />
      </Entry>
      <Entry q={t.math.glossQ4} a={t.math.glossA4} />

      <p className="font-amiri text-[12px] leading-relaxed text-amber-200/70 border-t border-gold-soft pt-3">
        {t.math.glossClosing}
      </p>
    </aside>
  );
};

export default GroupTheoryGloss;
