// Phase 4.5: card representing one integration the user can connect.
// Renders the integration's name, what it does, what it unlocks, and a
// status-aware action button. Used in Day 0 dashboard, People page, donor
// detail "data missing" sections, and the Settings integrations tab.

import React from 'react';
import { Plug, Loader2, Check } from 'lucide-react';
import { ResolvedIntegration } from '../../data/maturity';

interface ConnectionPromptCardProps {
  integration: ResolvedIntegration;
  compact?: boolean;
  onConnect?: (id: string) => void;
}

export function ConnectionPromptCard({ integration, compact, onConnect }: ConnectionPromptCardProps) {
  const status = integration.currentStatus;
  const isConnected = status === 'connected';
  const isInProgress = status === 'in_progress';

  return (
    <div className="bg-surface border border-border-subtle rounded-md p-4 flex items-start gap-3 hover:border-border-default transition-colors duration-150">
      <div className="w-9 h-9 rounded-sm bg-surface border border-border-default flex items-center justify-center flex-shrink-0 shadow-[0_1px_0_rgba(17,17,17,0.04)]">
        <span className="font-serif text-[15px] font-semibold text-primary leading-none">{integration.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-primary tracking-tight">{integration.name}</p>
            <p className="eyebrow-plain mt-0.5">{integration.category}</p>
          </div>
          <StatusPill status={status} />
        </div>
        {!compact && (
          <p className="text-[12px] text-secondary mt-2 leading-snug">{integration.description}</p>
        )}
        <p className="text-[11px] text-muted italic mt-1.5 font-serif">Unlocks: {integration.unlocks}</p>
        {!isConnected && (
          <button
            type="button"
            onClick={() => onConnect?.(integration.id)}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary border border-border-default rounded-sm px-3 py-1.5 bg-surface hover:bg-surface-muted transition-colors duration-150"
          >
            {isInProgress ? <Loader2 size={11} className="animate-spin" /> : <Plug size={11} />}
            {isInProgress ? 'Resume connection' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ResolvedIntegration['currentStatus'] }) {
  const base = 'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-sm px-1.5 py-[3px] border';
  if (status === 'connected') {
    return (
      <span className={`${base} text-success bg-success-soft border-success/40`}>
        <Check size={10} /> Connected
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className={`${base} text-warning bg-warning-soft border-warning/40`}>
        <Loader2 size={10} className="animate-spin" /> In progress
      </span>
    );
  }
  return (
    <span className={`${base} text-muted bg-surface-muted border-border-subtle`}>
      Not connected
    </span>
  );
}
