// Phase 6 (second pass): refined progress bar.
// Tabular percent, tighter type, subtle inset track, and accent fill with a
// 1px darker inner outline so it reads as a printed element.

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  tone?: 'accent' | 'success' | 'neutral';
}

const TONE_FILL: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  accent: 'bg-accent border-border-default/60',
  success: 'bg-success border-success/70',
  neutral: 'bg-primary border-primary/70',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
  tone = 'accent',
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const trackHeight = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className="flex flex-col gap-1.5">
      {(label || showPercent) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-[12px] font-medium text-primary">{label}</span>}
          {showPercent && (
            <span className="text-[12px] text-muted tabular-nums">{percent}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-surface-muted/80 border border-border-subtle/70 rounded-sm overflow-hidden ${trackHeight}`}
      >
        <div
          className={`h-full border-r ${TONE_FILL[tone]} transition-[width] duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
