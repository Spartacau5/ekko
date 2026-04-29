import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, FileText, User, BarChart3, Link2, ArrowUpRight } from 'lucide-react';

// Team-pinned priority card. Each card shows the source category (policy /
// donor / peer / signal), a story tag, a pin icon, title, description, up to
// two status chips, and the name of whoever pinned it. The first pinned card
// gets a subtle yellow left rail for visual anchoring.

export type PinCategory = 'policy' | 'donor' | 'peer' | 'signal';

export interface PinnedItem {
  id: string;
  category: PinCategory;
  title: string;
  description: string;
  statusChip?: { label: string; variant: 'warning' | 'danger' | 'info' | 'default' };
  teamChip?: boolean;
  pinnedBy: string;
  link?: string;
}

const CATEGORY_META: Record<PinCategory, { label: string; icon: React.ReactNode }> = {
  policy: { label: 'POLICY', icon: <FileText size={12} /> },
  donor:  { label: 'DONOR',  icon: <User size={12} /> },
  peer:   { label: 'PEER',   icon: <BarChart3 size={12} /> },
  signal: { label: 'SIGNAL', icon: <Link2 size={12} /> },
};

interface PinnedCardProps {
  item: PinnedItem;
  accent?: boolean;
}

export function PinnedCard({ item, accent = false }: PinnedCardProps) {
  const meta = CATEGORY_META[item.category];
  const body = (
    <div
      className={`card-lift group relative h-full bg-surface border rounded-md p-4 flex flex-col gap-3
        hover:border-border-default
        ${accent ? 'border-accent' : 'border-border-subtle'}`}
    >
      {accent && <span className="absolute inset-y-0 left-0 w-[3px] bg-accent rounded-l-md" aria-hidden="true" />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted">
          {meta.icon}
          <span className="text-[10px] font-semibold tracking-wider uppercase">{meta.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-sm bg-accent-soft text-[10px] font-semibold uppercase tracking-wide text-primary">
            Story
          </span>
          <Pin size={12} className="text-muted" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] leading-[20px] font-semibold text-primary line-clamp-2">{item.title}</p>
        <p className="text-[12px] leading-[16px] text-muted line-clamp-3">{item.description}</p>
      </div>

      <div className="flex items-center gap-1.5 mt-auto">
        {item.statusChip && (
          <span
            className={`px-2 py-1 rounded-sm text-[11px] font-medium
              ${item.statusChip.variant === 'warning' ? 'bg-accent-soft text-primary' :
                item.statusChip.variant === 'danger'  ? 'bg-danger-soft text-danger' :
                item.statusChip.variant === 'info'    ? 'bg-info-soft text-info' :
                                                         'bg-surface-muted text-secondary'}`}
          >
            {item.statusChip.label}
          </span>
        )}
        {item.teamChip && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-sm bg-surface-muted text-[11px] text-secondary">
            <User size={10} /> Team
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
        <p className="text-[11px] text-muted">Pinned by {item.pinnedBy}</p>
        {item.link && (
          <ArrowUpRight
            size={13}
            className="text-muted opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-150"
          />
        )}
      </div>
    </div>
  );
  if (item.link) {
    return <Link to={item.link} className="no-underline block h-full">{body}</Link>;
  }
  return body;
}
