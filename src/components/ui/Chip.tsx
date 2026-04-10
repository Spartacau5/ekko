import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
}

const variantStyles: Record<string, string> = {
  default: 'bg-surface-muted text-primary border-border-subtle',
  success: 'bg-success-soft text-success border-success/30',
  warning: 'bg-warning-soft text-warning border-warning/30',
  danger: 'bg-danger-soft text-danger border-danger/30',
  info: 'bg-info-soft text-info border-info/30',
  accent: 'bg-accent-soft text-primary border-accent/30',
};

export function Chip({ label, onRemove, variant = 'default' }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[13px] font-medium border rounded-sm ${variantStyles[variant]}`}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
          <X size={12} />
        </button>
      )}
    </span>
  );
}
