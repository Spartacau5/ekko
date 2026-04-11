// Phase 4.5: small inline CTA used at the top of Day 0 list/detail surfaces.
// "X is missing — connect Y to unlock Z." More compact than a Banner, used in
// places where a full banner would feel heavy.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface UnlockCTAProps {
  label: string;
  description?: string;
  ctaLabel: string;
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  tone?: 'accent' | 'info';
}

export function UnlockCTA({ label, description, ctaLabel, to, onClick, icon, tone = 'accent' }: UnlockCTAProps) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={`w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0
        ${tone === 'accent' ? 'bg-accent-soft text-primary' : 'bg-info-soft text-info'}`}>
        {icon ?? <Sparkles size={13} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-primary leading-snug">{label}</p>
        {description && <p className="text-[12px] text-secondary mt-0.5 leading-snug">{description}</p>}
      </div>
      <span className="text-[12px] font-medium text-primary inline-flex items-center gap-1 whitespace-nowrap">
        {ctaLabel} <ArrowRight size={11} />
      </span>
    </div>
  );

  const className = `block bg-surface border border-border-subtle rounded-sm hover:bg-surface-muted/40 transition-colors duration-150 no-underline`;
  if (to) return <Link to={to} className={className}>{inner}</Link>;
  return (
    <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
      {inner}
    </button>
  );
}
