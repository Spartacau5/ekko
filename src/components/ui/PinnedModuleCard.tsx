import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, ArrowUpRight, Users, FileText, Megaphone, Filter, BarChart3, Link2 } from 'lucide-react';
import { PinnedItem, PinnedKind } from '../../data/workspace';
import { getTeamMember } from '../../data/team';
import { isOnNarrativeSpine } from '../../data/demoFlows';
import { Chip } from './Chip';
import { ScopeBadge } from './ScopeBadge';

interface PinnedModuleCardProps {
  item: PinnedItem;
  onUnpin?: (id: string) => void;
}

const kindIcon: Record<PinnedKind, React.ReactNode> = {
  donor: <Users size={13} />,
  policy: <FileText size={13} />,
  peer: <Megaphone size={13} />,
  view: <Filter size={13} />,
  metric: <BarChart3 size={13} />,
};

const kindLabel: Record<PinnedKind, string> = {
  donor: 'Donor',
  policy: 'Policy',
  peer: 'Peer org',
  view: 'Saved view',
  metric: 'Metric',
};

export function PinnedModuleCard({ item, onUnpin }: PinnedModuleCardProps) {
  const pinnedBy = getTeamMember(item.pinnedBy);
  const onSpine = isOnNarrativeSpine(item.link);

  return (
    <Link
      to={item.link}
      className={`group relative block bg-surface border rounded-md p-4 no-underline
        transition-[border-color,background-color,box-shadow] duration-150 ease-out
        hover:border-border-default hover:shadow-[0_1px_0_rgba(17,17,17,0.04)]
        ${onSpine ? 'border-accent/50' : 'border-border-subtle'}`}
      title={onSpine ? "Part of this week\u2019s connected story" : undefined}
    >
      {/* Accent edge stripe for spine items — quiet but unmistakable. */}
      {onSpine && (
        <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent rounded-l-md" />
      )}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-muted">{kindIcon[item.kind]}</span>
          <p className="eyebrow-plain">{kindLabel[item.kind]}</p>
        </div>
        <div className="flex items-center gap-1">
          {onSpine && (
            <span
              className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary bg-accent-soft border border-accent/45 rounded-sm px-1.5 py-0.5 uppercase tracking-[0.12em]"
              aria-label="Part of the weekly story"
            >
              <Link2 size={8} /> Story
            </span>
          )}
          <Pin size={11} className="text-muted -rotate-12" />
        </div>
      </div>

      <p className="text-[14px] font-semibold text-primary leading-snug tracking-tight mb-1">{item.title}</p>
      <p className="text-[12px] text-secondary line-clamp-2 mb-3">{item.subtitle}</p>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {item.badge && <Chip label={item.badge} variant="accent" />}
        <ScopeBadge scope="team" />
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle">
        <p className="text-[11px] text-muted truncate">
          Pinned by {pinnedBy?.name ?? 'team'}
        </p>
        <ArrowUpRight
          size={13}
          className="text-muted opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0
            transition-[opacity,transform] duration-150 ease-out"
        />
      </div>
    </Link>
  );
}
