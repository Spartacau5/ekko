// Phase 4.5: a Day 0 teaser of mature-state value. Used in grids on Dashboard,
// People, Policy, and Peers to communicate "this is what unlocks once you
// connect/configure X." Visually distinct from real cards: dashed border,
// soft background, "Preview" eyebrow, and a clear unlock footer. Never feels
// like an empty error state.

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface ValuePreviewCardProps {
  title: string;
  description: string;
  unlockedBy: string;
  exampleStat?: { label: string; value: string };
  icon?: React.ReactNode;
}

export function ValuePreviewCard({ title, description, unlockedBy, exampleStat, icon }: ValuePreviewCardProps) {
  return (
    <div
      className="bg-surface-muted/40 border border-dashed border-border-subtle rounded-md p-5 flex flex-col gap-3"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(17,17,17,0.035) 0 1px, transparent 1px 9px)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="eyebrow-plain inline-flex items-center gap-1">
          <Lock size={9} /> Preview
        </p>
      </div>

      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-sm bg-surface border border-border-default flex items-center justify-center flex-shrink-0 text-secondary shadow-[0_1px_0_rgba(17,17,17,0.04)]">
          {icon ?? <Sparkles size={13} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-primary leading-snug tracking-tight">{title}</p>
          <p className="text-[12px] text-secondary mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      {exampleStat && (
        <div className="bg-surface border border-border-subtle rounded-sm px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted leading-snug">{exampleStat.label}</span>
          <span className="font-serif text-[18px] font-semibold text-primary tracking-tight tabular-nums">~{exampleStat.value}</span>
        </div>
      )}

      <div className="mt-auto pt-2 border-t border-border-subtle/70 flex items-center gap-1.5">
        <span className="w-[10px] h-[2px] bg-accent flex-shrink-0" />
        <span className="text-[11px] text-secondary leading-snug font-serif italic">
          Unlocks once you <span className="text-primary not-italic font-semibold">{unlockedBy.toLowerCase()}</span>
        </span>
      </div>
    </div>
  );
}
