// Phase 6: refined chip.
// Tighter typography and slightly softer surfaces so chips read as a
// disciplined micro-typography across all pages. Adds an `accent` variant
// for Ekko's controlled yellow moment.

import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'outline';
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-muted/70 text-primary border-border-subtle',
  success: 'bg-success-soft text-success border-success/35',
  warning: 'bg-warning-soft text-warning border-warning/35',
  danger:  'bg-danger-soft text-danger border-danger/35',
  info:    'bg-info-soft text-info border-info/35',
  accent:  'bg-accent-soft text-primary border-accent/45',
  outline: 'bg-surface text-secondary border-border-subtle',
};

export function Chip({ label, onRemove, variant = 'default' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-[7px] h-[20px] text-[11px] font-medium leading-none border rounded-sm tracking-[0.005em]
        transition-[background-color,border-color,color] duration-150 ease-out
        ${variantStyles[variant]}`}
    >
      <span className="pt-px">{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-0.5 -mr-1 p-0.5 rounded-sm
            transition-colors duration-150 ease-out
            hover:bg-black/10
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current/50"
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}
