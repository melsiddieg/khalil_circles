import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

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
        |C<sub>{n}</sub>|
      </Term>
      <span className="text-gray-500">=</span>
      <Term label={t.math.eqOrbit}>|Orbit|</Term>
      <span className="text-amber-400">×</span>
      <Term label={t.math.eqStab}>|Stab|</Term>
      <span className="mx-2 text-gray-500">⟹</span>
      <span>
        <span style={{ color }}>{n}</span>
        <span className="text-gray-500"> = </span>
        <span style={{ color }}>{orbit}</span>
        <span className="text-amber-400"> × </span>
        <span style={{ color }}>{stab}</span>
      </span>
    </div>
  );
};

export default OrbitStabEquation;
