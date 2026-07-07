import React, { useId } from 'react';

interface IslamicPatternProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  opacity?: number;
  scale?: number;
}

/**
 * Procedurally generated Islamic geometric pattern used as a decorative
 * backdrop on the circle cards. Eight-pointed stars with diagonal lattice
 * lines and corner flourishes, all tinted with the circle's theme colors.
 */
const IslamicPattern: React.FC<IslamicPatternProps> = ({
  className = '',
  primaryColor = '#F59E0B',
  accentColor = '#1F2937',
  opacity = 0.1,
  scale = 1,
}) => {
  // SVG pattern ids are document-global; scope them per instance so each
  // card's pattern picks up its own circle's theme colors.
  const uid = useId();
  const starPatternId = `islamic-star-pattern-${uid}`;

  return (
  <svg
    className={className}
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id={starPatternId}
        x="0"
        y="0"
        width={20 * scale}
        height={20 * scale}
        patternUnits="userSpaceOnUse"
      >
        <g transform={`scale(${scale})`} fill="none" stroke={primaryColor} strokeWidth="0.5" opacity={opacity}>
          {/* Eight-pointed star */}
          <path d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z" fill={primaryColor} fillOpacity="0.1" />
          {/* Diagonal lattice */}
          <path d="M0 0 L20 20 M20 0 L0 20" stroke={accentColor} strokeWidth="0.2" />
          {/* Rotated square */}
          <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" />
        </g>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill={`url(#${starPatternId})`} />
    <rect width="100%" height="100%" fill="none" stroke={primaryColor} strokeWidth="2" strokeOpacity={opacity} rx="15" />

    {/* Corner flourishes */}
    <path d="M5 20 V 5 H 20" fill="none" stroke={primaryColor} strokeWidth="2" strokeOpacity={opacity * 2} />
    <path d="M80 5 H 95 V 20" fill="none" stroke={primaryColor} strokeWidth="2" strokeOpacity={opacity * 2} />
    <path d="M95 80 V 95 H 80" fill="none" stroke={primaryColor} strokeWidth="2" strokeOpacity={opacity * 2} />
    <path d="M20 95 H 5 V 80" fill="none" stroke={primaryColor} strokeWidth="2" strokeOpacity={opacity * 2} />
  </svg>
  );
};

export default IslamicPattern;
