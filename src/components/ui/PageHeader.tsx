// Phase 6: refined PageHeader.
// A single editorial rhythm for every content page:
//   eyebrow (optional) → serif page title → subtitle → right-aligned actions
// with a thin bottom rule to separate the header from page body.
//
// `serif` is true by default — Phase 6 wants content pages to feel editorial
// unless a page explicitly opts into a sans page title.

import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  serif?: boolean;
  divider?: boolean;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  serif = true,
  divider = true,
  className = '',
}: PageHeaderProps) {
  return (
    <header
      className={`${divider ? 'pb-5 mb-6 border-b border-border-subtle' : 'mb-6'} ${className}`}
    >
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
          <h1
            className={
              serif
                ? 'font-serif font-semibold text-primary text-[30px] leading-[38px] tracking-tight'
                : 'font-semibold text-primary text-[26px] leading-[32px]'
            }
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] leading-[22px] text-secondary mt-1.5 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
