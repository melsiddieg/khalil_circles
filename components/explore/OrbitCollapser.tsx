import React, { useMemo, useState } from 'react';
import { Circle } from '../../types';
import {
  CIRCLE_ROTATIONS,
  canonicalOffset,
  sequencePeriod,
  stabilizerOrder,
} from '../../data/rotations';
import { unitColor } from './geometry';
import OrbitStabEquation from '../OrbitStabEquation';
import { useLanguage } from '../../i18n/LanguageContext';
import { getMeterName } from '../../i18n/names';

const ROW_H = 34;
const PILE_SHIFT = 3; // px offset per buried strip, for a stacked-paper look

const OrbitCollapser: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t, lang } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const seq = circle.atomicSequence;
  const n = seq.length;
  const period = sequencePeriod(seq);
  const stab = stabilizerOrder(seq);

  // Layout plan: each rotation row knows its canonical pile and its depth in it.
  const rows = useMemo(() => {
    const canonicals: number[] = [];
    const depthSeen = new Map<number, number>();
    return Array.from({ length: n }, (_, k) => {
      const canon = canonicalOffset(circle.id, k);
      if (!canonicals.includes(canon)) canonicals.push(canon);
      const depth = depthSeen.get(canon) ?? 0;
      depthSeen.set(canon, depth + 1);
      return { k, canon, pile: canonicals.indexOf(canon), depth };
    });
  }, [circle.id, n]);

  const pileLabel = (canon: number): { text: string; color: string } => {
    const info = CIRCLE_ROTATIONS[circle.id][canon];
    if (info.kind === 'meter') {
      const meter = circle.meters.find((m) => m.id === info.meterId)!;
      return { text: getMeterName(meter, lang), color: circle.visualTheme.primaryColor };
    }
    if (info.kind === 'muhmal') {
      const name = lang === 'ar' ? info.nameAr : info.nameEn;
      return { text: name ?? (lang === 'ar' ? 'مهمل' : 'unused'), color: '#9CA3AF' };
    }
    return { text: '', color: '#9CA3AF' };
  };

  return (
    <div>
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-pressed={collapsed}
          className="px-5 py-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900
                     font-bold font-amiri text-sm hover:shadow-amber-500/40 hover:shadow-lg
                     active:scale-95 transition-all"
        >
          {collapsed ? t.explore.collapseReset : t.explore.collapseAction}
        </button>
      </div>

      {/* The strips */}
      <div
        className="relative mx-auto max-w-md transition-all duration-700"
        style={{ height: (collapsed ? period : n) * ROW_H + PILE_SHIFT * stab }}
      >
        {rows.map(({ k, canon, pile, depth }) => {
          const top = collapsed ? pile * ROW_H + depth * PILE_SHIFT : k * ROW_H;
          const isTop = !collapsed || depth === stab - 1;
          return (
            <div
              key={k}
              className="absolute inset-x-0 flex items-center gap-2 transition-all ease-in-out"
              style={{
                top,
                transitionDuration: '700ms',
                transitionDelay: collapsed ? `${depth * 120}ms` : `${(n - k) * 25}ms`,
                zIndex: collapsed ? depth : n - k,
              }}
            >
              {/* offset label */}
              <span
                className={`w-6 text-center font-inter text-xs shrink-0 transition-opacity duration-500 ${
                  collapsed && depth > 0 ? 'opacity-0' : 'text-gray-500'
                }`}
                dir="ltr"
              >
                {collapsed ? canon : k}
              </span>

              {/* the strip: rotation-k reading as unit cells */}
              <div
                className="flex-1 flex gap-0.5 rounded-md border px-1 py-0.5 bg-gray-900/85"
                style={{
                  borderColor: isTop ? 'var(--gold-hairline)' : 'var(--gold-hairline-soft)',
                  boxShadow: collapsed && depth > 0 ? '0 2px 6px rgba(0,0,0,0.5)' : undefined,
                }}
                dir="rtl"
              >
                {seq.map((_, i) => {
                  const unit = seq[(i + k) % n];
                  return (
                    <span
                      key={i}
                      className="flex-1 h-5 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: `${unitColor(unit, circle)}2e` }}
                    >
                      <span
                        className="font-mono text-[9px] font-bold"
                        style={{ color: unitColor(unit, circle) }}
                        dir="ltr"
                      >
                        {unit.split('').reverse().join('')}
                      </span>
                    </span>
                  );
                })}
              </div>

              {/* pile badge + name, on the surviving top strip only */}
              <span
                className={`w-28 shrink-0 text-xs font-amiri transition-opacity duration-500 ${
                  collapsed && isTop ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-gray-500 me-1" dir="ltr">
                  ×{stab}
                </span>
                <span style={{ color: pileLabel(canon).color }}>{pileLabel(canon).text}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* The theorem, proving itself */}
      <div
        className={`text-center font-amiri mt-6 transition-all duration-700 ${
          collapsed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        aria-hidden={!collapsed}
      >
        <p className="text-amber-200 text-lg mb-2">
          {t.explore.collapseEquation(String(n), String(period), String(stab))}
        </p>
        <div className="scale-90 origin-top">
          <OrbitStabEquation
            n={n}
            orbit={period}
            stab={stab}
            color={circle.visualTheme.primaryColor}
          />
        </div>
      </div>
    </div>
  );
};

export default OrbitCollapser;
