// Phase 6: refined Banner.
// A printed, editorial banner with a 2px tone-colored rule along the left
// edge (echoing the eyebrow motif). Heavier on typography, lighter on fill.

import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';

interface BannerProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

const styles: Record<
  string,
  { bg: string; border: string; rule: string; icon: React.ReactNode }
> = {
  info: {
    bg: 'bg-info-soft/60',
    border: 'border-info/30',
    rule: 'bg-info',
    icon: <Info size={15} className="text-info" />,
  },
  warning: {
    bg: 'bg-warning-soft/60',
    border: 'border-warning/30',
    rule: 'bg-warning',
    icon: <AlertTriangle size={15} className="text-warning" />,
  },
  danger: {
    bg: 'bg-danger-soft/60',
    border: 'border-danger/30',
    rule: 'bg-danger',
    icon: <AlertCircle size={15} className="text-danger" />,
  },
  success: {
    bg: 'bg-success-soft/60',
    border: 'border-success/30',
    rule: 'bg-success',
    icon: <CheckCircle size={15} className="text-success" />,
  },
};

export function Banner({ type, title, description, action }: BannerProps) {
  const s = styles[type];
  return (
    <div className={`relative flex items-start gap-3 pl-4 pr-4 py-3 border rounded-sm ${s.bg} ${s.border}`}>
      <span className={`absolute left-0 top-0 bottom-0 w-[2px] ${s.rule}`} aria-hidden="true" />
      <div className="mt-0.5 flex-shrink-0">{s.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-primary leading-snug">{title}</p>
        {description && (
          <p className="text-[12px] text-secondary mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-[12px] font-semibold text-primary underline underline-offset-2 whitespace-nowrap flex-shrink-0 hover:no-underline"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
