import React from 'react';
import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { Alert } from '../../data/alerts';
import { usePins } from '../../lib/PinContext';
import { useRole } from '../../lib/RoleContext';
import { useToast } from '../ui/Toast';

// Single signal row. Colored dot corresponds to category (Policy / People /
// Peer); title is the headline, with a short detail line below. Hover reveals
// a pin icon the user can click to pin this signal to the dashboard.

const CATEGORY_DOT: Record<string, string> = {
  policy: 'bg-info',
  people: 'bg-success',
  peers:  'bg-accent',
  setup:  'bg-muted',
};

interface SignalRowProps {
  alert: Alert;
}

export function SignalRow({ alert }: SignalRowProps) {
  const { isPinned, togglePin } = usePins();
  const { activeMember } = useRole();
  const toast = useToast();
  const dotClass = CATEGORY_DOT[alert.category] || 'bg-muted';
  const pinned = isPinned('signal', alert.id);

  const onPin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = togglePin('signal', alert.id, activeMember.name);
    toast.show({
      type: next ? 'success' : 'info',
      title: next ? 'Signal pinned' : 'Signal unpinned',
      description: next ? 'Added to the team\'s pinned priorities.' : undefined,
    });
  };

  const content = (
    <div className="group relative flex items-start gap-3 px-3 py-3 rounded-md hover:bg-surface-muted/40 transition-colors duration-150 cursor-pointer">
      <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
      <div className="flex-1 min-w-0 flex flex-col gap-1 pr-7">
        <p className="text-[14px] leading-[20px] font-medium text-primary">{alert.title}</p>
        <p className="text-[12px] leading-[16px] text-muted line-clamp-2">{alert.description}</p>
      </div>
      <button
        type="button"
        onClick={onPin}
        aria-pressed={pinned}
        aria-label={pinned ? 'Unpin signal' : 'Pin signal'}
        className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-sm cursor-pointer transition-[opacity,color,background-color] duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:opacity-100
          ${pinned
            ? 'opacity-100 text-primary bg-accent-soft'
            : 'opacity-0 group-hover:opacity-100 text-muted hover:text-primary hover:bg-surface-muted'}`}
      >
        <Pin size={12} fill={pinned ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
  if (alert.actionLink) {
    return <Link to={alert.actionLink} className="no-underline">{content}</Link>;
  }
  return content;
}

export function SignalLegend() {
  return (
    <div className="flex items-center gap-3 text-[11px] text-muted">
      <LegendItem dotClass="bg-info" label="Policy" />
      <LegendItem dotClass="bg-success" label="People" />
      <LegendItem dotClass="bg-accent" label="Peer" />
    </div>
  );
}

function LegendItem({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}
