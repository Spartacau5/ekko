import React from 'react';
import { Circle, CircleDot, CheckCircle2 } from 'lucide-react';
import { ActionStatus } from '../../data/actions';

interface StatusBadgeProps {
  status: ActionStatus;
  size?: 'sm' | 'md';
}

const labels: Record<ActionStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  completed: 'Completed',
};

const styles: Record<ActionStatus, string> = {
  open: 'bg-surface-muted text-secondary border-border-subtle',
  in_progress: 'bg-info-soft text-info border-info/30',
  completed: 'bg-success-soft text-success border-success/30',
};

const icons: Record<ActionStatus, React.ReactNode> = {
  open: <Circle size={11} strokeWidth={2.2} />,
  in_progress: <CircleDot size={11} strokeWidth={2.2} />,
  completed: <CheckCircle2 size={11} strokeWidth={2.2} />,
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-[12px]';
  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} font-medium border rounded-sm
        transition-[background-color,border-color] duration-150 ease-out ${styles[status]}`}
    >
      {icons[status]}
      {labels[status]}
    </span>
  );
}
