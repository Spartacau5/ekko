import React from 'react';
import { Info } from 'lucide-react';

// "Today at a Glance" inline strip. Four label / value pairs in a single row
// with soft dividers. Kept intentionally flat — no sparklines or trend
// arrows — to signal "these are today's standings" as quickly as possible.

export interface StatItem {
  label: string;
  value: string;
  tooltip?: string;
}

interface StatsStripProps {
  title?: string;
  items: StatItem[];
}

export function StatsStrip({ title = 'Today at a Glance', items }: StatsStripProps) {
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
            <span className="text-[22px] font-semibold text-primary tabular-nums tracking-tight shrink-0">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
