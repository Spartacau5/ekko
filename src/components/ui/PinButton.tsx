import React from 'react';
import { Pin } from 'lucide-react';
import { usePins, PinTargetType } from '../../lib/PinContext';
import { useRole } from '../../lib/RoleContext';
import { useToast } from './Toast';

// Toggleable pin button. Bound to PinContext so pinning from any detail page
// surfaces on the dashboard's "Pinned priorities" band.

interface PinButtonProps {
  type: PinTargetType;
  id: string;
  /** Short, readable label for the toast ("Donor pinned", "Policy unpinned"). */
  entityLabel?: string;
  /** Icon-only or icon + label. Default icon + label. */
  compact?: boolean;
  className?: string;
}

export function PinButton({ type, id, entityLabel, compact = false, className = '' }: PinButtonProps) {
  const { isPinned, togglePin } = usePins();
  const { activeMember } = useRole();
  const toast = useToast();
  const pinned = isPinned(type, id);

  const onClick = () => {
    const next = togglePin(type, id, activeMember.name);
    toast.show({
      type: next ? 'success' : 'info',
      title: next ? `${entityLabel || 'Item'} pinned` : `${entityLabel || 'Item'} unpinned`,
      description: next ? 'Added to the team\'s pinned priorities.' : undefined,
    });
  };

  const base =
    'inline-flex items-center gap-1.5 rounded-sm border transition-[background-color,border-color,color] duration-150 cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface focus-visible:ring-border-default';
  const state = pinned
    ? 'bg-accent-soft text-primary border-accent hover:bg-accent'
    : 'bg-surface text-secondary border-border-default hover:bg-surface-muted hover:text-primary';
  const size = compact ? 'w-8 h-8 justify-center' : 'px-3 py-1.5 text-[12.5px] font-medium';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pinned}
      title={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
      className={`${base} ${state} ${size} ${className}`}
    >
      {pinned ? <Pin size={14} fill="currentColor" /> : <Pin size={14} />}
      {!compact && <span>{pinned ? 'Pinned' : 'Pin'}</span>}
    </button>
  );
}
