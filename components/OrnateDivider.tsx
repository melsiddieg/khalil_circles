import React from 'react';

/**
 * The ✦ hairline divider that sits under display headings — one ornament,
 * used identically everywhere, so every view opens like a medallion
 * inscription.
 */
const OrnateDivider: React.FC<{ className?: string }> = ({ className = 'mb-4' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-16 md:w-24 bg-gradient-to-l from-amber-500/60 to-transparent" />
    <span className="text-amber-500/80 text-lg">✦</span>
    <span className="h-px w-16 md:w-24 bg-gradient-to-r from-amber-500/60 to-transparent" />
  </div>
);

export default OrnateDivider;
