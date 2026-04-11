// Phase 6: editorial section header primitive.
// A deliberate replacement for the dozen or so ad-hoc section headings across
// the product. Establishes a single typographic rhythm: a small uppercase
// eyebrow (with Ekko's quiet 2px accent rule), a section title (sans by
// default, serif when editorial emphasis is warranted), an optional meta
// line, and an optional right-aligned actions slot.
//
// Use in two shapes:
//   <SectionHeader eyebrow="People" title="Priority donors" />
//   <SectionHeader eyebrow="People" title="Priority donors" serif actions={<Link to="/people">View all</Link>} />

import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  meta?: string;
  serif?: boolean;
  size?: 'sm' | 'md' | 'lg';
  actions?: React.ReactNode;
  align?: 'start' | 'center';
  className?: string;
  titleId?: string;
}

const SIZE_STYLES = {
  sm: {
    title: 'text-[14px] leading-[20px]',
    serif: 'text-[16px] leading-[22px]',
    meta: 'text-[12px] mt-0.5',
    gap: 'mb-3',
  },
  md: {
    title: 'text-[15px] leading-[22px]',
    serif: 'text-[18px] leading-[24px]',
    meta: 'text-[13px] mt-1',
    gap: 'mb-4',
  },
  lg: {
    title: 'text-[18px] leading-[26px]',
    serif: 'text-[22px] leading-[28px]',
    meta: 'text-[13px] mt-1.5',
    gap: 'mb-5',
  },
};

export function SectionHeader({
  eyebrow,
  title,
  meta,
  serif = false,
  size = 'md',
  actions,
  align = 'start',
  className = '',
  titleId,
}: SectionHeaderProps) {
  const sz = SIZE_STYLES[size];
  const titleClass = serif
    ? `font-serif font-semibold text-primary tracking-tight ${sz.serif}`
    : `font-semibold text-primary ${sz.title}`;

  return (
    <header
      className={`flex ${align === 'center' ? 'items-center' : 'items-end'} justify-between gap-4 ${sz.gap} ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 id={titleId} className={titleClass}>
          {title}
        </h2>
        {meta && <p className={`section-meta ${sz.meta}`}>{meta}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </header>
  );
}
