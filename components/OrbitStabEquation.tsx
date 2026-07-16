import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAnimatedNumber } from '../utils/animation';

interface OrbitStabEquationProps {
  n: number;
  orbit: number;
  stab: number;
  /** Theme color for the concrete numbers */
  color: string;
}

const Term: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <span className="inline-flex flex-col items-center align-top">
    <span>{children}</span>
    <span className="text-[10px] leading-tight label-gold font-amiri mt-0.5">{label}</span>
  </span>
);

/**
 * A number that counts to its new value and flashes while it travels —
 * Manim's ChangeDecimalToValue with an Indicate: the reader's eye is told
 * which quantity moved, and watches it move rather than finding it
 * already changed.
 */
const CountingNumber: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const { display, pulse } = useAnimatedNumber(value);
  return (
    <span
      className="inline-block tabular-nums"
      style={{
        color,
        transform: `scale(${1 + pulse * 0.22})`,
        filter: pulse > 0.01 ? `drop-shadow(0 0 ${pulse * 10}px ${color})` : undefined,
        transition: 'none',
      }}
    >
      {Math.round(display)}
    </span>
  );
};

/**
 * The orbit–stabilizer identity with each symbolic token annotated in the
 * reader's language, plus the concrete instance for the current circle.
 */
const OrbitStabEquation: React.FC<OrbitStabEquationProps> = ({ n, orbit, stab, color }) => {
  const { t } = useLanguage();
  return (
    <div
      className="flex flex-wrap items-start justify-center gap-x-3 gap-y-2 text-xl md:text-2xl font-inter text-gray-200"
      dir="ltr"
    >
      <Term label={t.math.eqGroup}>
        |C<sub className="tabular-nums">{n}</sub>|
      </Term>
      <span className="text-gray-500">=</span>
      <Term label={t.math.eqOrbit}>|Orbit|</Term>
      <span className="text-amber-400">×</span>
      <Term label={t.math.eqStab}>|Stab|</Term>
      <span className="mx-2 text-gray-500">⟹</span>
      <span>
        <CountingNumber value={n} color={color} />
        <span className="text-gray-500"> = </span>
        <CountingNumber value={orbit} color={color} />
        <span className="text-amber-400"> × </span>
        <CountingNumber value={stab} color={color} />
      </span>
    </div>
  );
};

export default OrbitStabEquation;
