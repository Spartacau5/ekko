// Phase 6 (second pass): shared card header primitive.
// Every module in the product — dashboards, detail pages, settings — ends up
// with its own inline header treatment. This primitive collapses them into
// one shape:
//
//   [optional icon] eyebrow
//   section title           [right-aligned actions]
//
// with an optional bottom border so it can act as the top bar of a bordered
// card. Use in place of the ad-hoc "px-5 py-4 border-b flex items-center..."
// pattern that was growing across the codebase.

import React from 'react';

interface CardHeaderProps {
  eyebrow?: string;
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  /** `bar` = rendered as a bordered card top bar with horizontal padding.
   *  `flat` = rendered as a titled section without card chrome. */
  variant?: 'bar' | 'flat';
  tone?: 'default' | 'muted' | 'accent';
  dense?: boolean;
  className?: string;
}

const TONE_BG = {
  default: '',
  muted: 'bg-surface-muted/30',
  accent: 'bg-accent-soft/40',
};

export function CardHeader({
  eyebrow,
  title,
  meta,
  icon,
  actions,
  variant = 'bar',
  tone = 'default',
  dense = false,
  className = '',
}: CardHeaderProps) {
  const isBar = variant === 'bar';
  const bg = tone !== 'default' ? TONE_BG[tone] : '';

  const wrapClass = isBar
    ? `flex items-start justify-between gap-4 border-b border-border-subtle ${bg} ${dense ? 'px-4 py-3' : 'px-5 py-4'}`
    : `flex items-start justify-between gap-4 ${dense ? 'mb-2.5' : 'mb-3'}`;

  return (
    <header className={`${wrapClass} ${className}`}>
      <div className="min-w-0 flex items-start gap-2.5">
        {icon && (
          <div className="w-6 h-6 mt-0.5 rounded-sm bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0 text-secondary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h3 className={`text-[14px] font-semibold text-primary leading-tight tracking-tight ${dense ? '' : 'text-[15px]'}`}>
            {title}
          </h3>
          {meta && <p className="text-[12px] text-muted mt-0.5">{meta}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </header>
  );
}
