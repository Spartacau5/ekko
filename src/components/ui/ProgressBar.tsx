import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, max = 100, label, showPercent = true, size = 'md' }: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="flex flex-col gap-1">
      {(label || showPercent) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-[13px] font-medium text-primary">{label}</span>}
          {showPercent && <span className="text-[13px] text-muted">{percent}%</span>}
        </div>
      )}
      <div className={`w-full bg-surface-muted rounded-sm overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className="h-full bg-accent rounded-sm transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
