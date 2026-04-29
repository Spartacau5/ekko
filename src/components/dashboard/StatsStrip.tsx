import React from 'react';
import { Info } from 'lucide-react';

// "Today at a Glance" inline strip. Four label / value pairs in a single row
// with soft dividers. Kept intentionally flat — no sparklines or trend
// arrows — to signal "these are today's standings" as quickly as possible.

export type StatTone = 'primary' | 'danger' | 'info' | 'success';

export interface StatItem {
  label: string;
  value: string;
  tooltip?: string;
  tone?: StatTone;
}

interface StatsStripProps {
  title?: string;
  items: StatItem[];
  variant?: 'default' | 'large';
}

const TONE_CLASS: Record<StatTone, string> = {
  primary: 'text-primary',
  danger: 'text-danger',
  info: 'text-brand',
  success: 'text-success',
};

export function StatsStrip({ title = 'Today at a Glance', items, variant = 'default' }: StatsStripProps) {
  if (variant === 'large') {
    return (
      <div className="bg-surface border border-border-subtle rounded-lg shadow-card px-7 py-6">
        <h2 className="text-[22px] font-semibold text-primary tracking-tight mb-5">{title}</h2>
        <div className="grid grid-cols-4 divide-x divide-border-subtle">
          {items.map((s, i) => (
            <div key={i} className={`flex items-center justify-between gap-3 ${i === 0 ? 'pr-6' : 'px-6'}`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[15px] text-primary truncate">{s.label}</span>
                {s.tooltip && (
                  <span title={s.tooltip} className="text-muted shrink-0" aria-label={s.tooltip}>
                    <Info size={13} />
                  </span>
                )}
              </div>
              <span className={`text-[34px] leading-none font-bold tabular-nums tracking-tight shrink-0 ${TONE_CLASS[s.tone ?? 'primary']}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-surface border border-border-subtle rounded-md px-5 py-4">
      <p className="eyebrow mb-2.5">{title}</p>
      <div className="grid grid-cols-4 divide-x divide-border-subtle">
        {items.map((s, i) => (
          <div key={i} className={`flex items-center justify-between gap-4 ${i === 0 ? 'pr-5' : 'px-5'}`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[13px] text-secondary truncate">{s.label}</span>
              {s.tooltip && (
                <span title={s.tooltip} className="text-muted shrink-0" aria-label={s.tooltip}>
                  <Info size={12} />
                </span>
              )}
            </div>
            <span className={`text-[22px] font-semibold tabular-nums tracking-tight shrink-0 ${TONE_CLASS[s.tone ?? 'primary']}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
