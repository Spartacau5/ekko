import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

interface DueDateBadgeProps {
  dueDate: string;       // ISO
  status?: 'open' | 'in_progress' | 'completed';
  // Today's reference date for the prototype. Static so the demo is stable.
  today?: string;
  size?: 'sm' | 'md';
}

const TODAY = '2026-04-10';

export function DueDateBadge({ dueDate, status, today = TODAY, size = 'md' }: DueDateBadgeProps) {
  const due = new Date(dueDate);
  const now = new Date(today);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let label: string;
  let tone: 'overdue' | 'urgent' | 'soon' | 'normal' | 'done';

  if (status === 'completed') {
    tone = 'done';
    label = 'Completed';
  } else if (diffDays < 0) {
    tone = 'overdue';
    label = `${Math.abs(diffDays)}d overdue`;
  } else if (diffDays === 0) {
    tone = 'urgent';
    label = 'Due today';
  } else if (diffDays <= 3) {
    tone = 'urgent';
    label = `Due in ${diffDays}d`;
  } else if (diffDays <= 14) {
    tone = 'soon';
    label = `Due in ${diffDays}d`;
  } else {
    tone = 'normal';
    label = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const styleMap: Record<typeof tone, string> = {
    overdue: 'text-danger',
    urgent: 'text-danger',
    soon: 'text-warning',
    normal: 'text-muted',
    done: 'text-success',
  };

  const textSize = size === 'sm' ? 'text-[11px]' : 'text-[12px]';
  const Icon = tone === 'overdue' || tone === 'urgent' ? AlertCircle : Calendar;
  const iconSize = size === 'sm' ? 11 : 12;

  return (
    <span className={`inline-flex items-center gap-1 ${textSize} font-medium ${styleMap[tone]}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
