import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, ArrowUpRight, Users, FileText, Megaphone, Filter, BarChart3 } from 'lucide-react';
import { PinnedItem, PinnedKind } from '../../data/workspace';
import { getTeamMember } from '../../data/team';
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

  return (
    <Link
      to={item.link}
      className="group relative block bg-surface border border-border-subtle rounded-md p-4 no-underline
        transition-[border-color,background-color] duration-150 ease-out
        hover:border-border-default hover:bg-surface-muted/20"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted uppercase tracking-wider">
          <span className="text-secondary">{kindIcon[item.kind]}</span>
          {kindLabel[item.kind]}
        </div>
        <Pin size={12} className="text-muted -rotate-12" />
      </div>

      <p className="text-[14px] font-semibold text-primary leading-snug mb-1">{item.title}</p>
      <p className="text-[12px] text-secondary line-clamp-2 mb-3">{item.subtitle}</p>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {item.badge && <Chip label={item.badge} variant="accent" />}
        <ScopeBadge scope="team" />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
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
