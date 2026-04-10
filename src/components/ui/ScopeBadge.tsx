import React from 'react';
import { Lock, Users, Globe } from 'lucide-react';

export type Scope = 'private' | 'team' | 'shared';

interface ScopeBadgeProps {
  scope: Scope;
  size?: 'sm' | 'md';
  // Optional override label, e.g. "Team-shared" instead of "Team"
  label?: string;
}

const meta: Record<Scope, { label: string; icon: React.ReactNode; tone: string }> = {
  private: {
    label: 'Private',
    icon: <Lock size={11} />,
    tone: 'bg-surface-muted/60 text-muted border-border-subtle',
  },
  team: {
    label: 'Team',
    icon: <Users size={11} />,
    tone: 'bg-info-soft text-info border-info/30',
  },
  shared: {
    label: 'Shared',
    icon: <Globe size={11} />,
    tone: 'bg-success-soft text-success border-success/30',
  },
};

// Unified scope chip used wherever the workspace needs to communicate
// who can see a thing — saved views, pinned items, watchlists, tracked
// peers. Same chrome, same vocabulary, calm and operational.
export function ScopeBadge({ scope, size = 'md', label }: ScopeBadgeProps) {
  const m = meta[scope];
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} font-medium border rounded-sm
        transition-[background-color,border-color] duration-150 ease-out ${m.tone}`}
    >
      {m.icon}
      {label ?? m.label}
    </span>
  );
}
