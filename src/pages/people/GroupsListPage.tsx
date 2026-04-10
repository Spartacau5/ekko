import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { donorGroups, DonorGroup } from '../../data/groups';
import { Button, Chip, SearchBar, SegmentedControl, EmptyState } from '../../components/ui';
import { Users, TrendingUp, TrendingDown, Plus, ArrowUpRight } from 'lucide-react';

const groupTypeOptions = [
  { value: 'all', label: 'All groups' },
  { value: 'segment', label: 'Segments' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'event', label: 'Events' },
  { value: 'persona', label: 'Personas' },
];

export function GroupsListPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return donorGroups.filter(g => {
      if (typeFilter !== 'all' && g.type !== typeFilter) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase()) && !g.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, typeFilter]);

  // Aggregate metrics across filtered set
  const totalMembers = filtered.reduce((sum, g) => sum + g.memberCount, 0);
  const totalLifetime = filtered.reduce((sum, g) => sum + g.totalLifetime, 0);
  const fastestGrowing = [...filtered].sort((a, b) => b.growthLast90 - a.growthLast90)[0];

  return (
    <>
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total groups"
          value={filtered.length.toString()}
          sublabel={typeFilter !== 'all' ? `filtered by ${typeFilter}` : 'across all types'}
        />
        <StatCard
          label="Members across groups"
          value={totalMembers.toLocaleString()}
          sublabel="people in at least one group"
        />
        <StatCard
          label="Lifetime giving"
          value={`$${(totalLifetime / 1000).toFixed(0)}K`}
          sublabel="sum of group lifetime"
        />
        <StatCard
          label="Fastest growing"
          value={fastestGrowing ? `+${fastestGrowing.growthLast90}%` : '—'}
          sublabel={fastestGrowing ? fastestGrowing.name : '—'}
          positive={!!fastestGrowing && fastestGrowing.growthLast90 > 0}
        />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <SegmentedControl options={groupTypeOptions} value={typeFilter} onChange={setTypeFilter} />
        <Button variant="primary"><Plus size={14} className="mr-1.5" />New group</Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search groups by name or description..." />
        </div>
        <span className="text-[13px] text-muted">{filtered.length} {filtered.length === 1 ? 'group' : 'groups'}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="No groups match your filters"
          description="Try adjusting your filters or search query, or create a new group."
          action={{ label: 'Clear filters', onClick: () => { setSearch(''); setTypeFilter('all'); } }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(group => <GroupCard key={group.id} group={group} />)}
        </div>
      )}
    </>
  );
}

function GroupCard({ group }: { group: DonorGroup }) {
  const typeVariant: Record<string, 'info' | 'accent' | 'warning' | 'default'> = {
    segment: 'info',
    campaign: 'accent',
    event: 'warning',
    persona: 'default',
  };
  const growthPositive = group.growthLast90 >= 0;
  const engagementLabel = group.engagementScore >= 70 ? 'High' : group.engagementScore >= 50 ? 'Medium' : 'Low';
  const engagementColor = group.engagementScore >= 70 ? 'text-success' : group.engagementScore >= 50 ? 'text-warning' : 'text-danger';

  return (
    <Link
      to={`/people/groups/${group.id}`}
      className="group block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
    >
      {/* Header: type chip + first tag (max 1) + arrow */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Chip label={group.type.charAt(0).toUpperCase() + group.type.slice(1)} variant={typeVariant[group.type]} />
          {group.tags[0] && <Chip label={group.tags[0]} variant="default" />}
        </div>
        <ArrowUpRight size={14} className="text-muted group-hover:text-primary transition-colors flex-shrink-0" />
      </div>

      {/* Title + description */}
      <h3 className="text-[18px] leading-[24px] font-semibold text-primary mb-1">{group.name}</h3>
      <p className="text-[13px] text-secondary line-clamp-2 mb-4">{group.description}</p>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
        <Metric label="Members" value={group.memberCount.toLocaleString()} />
        <Metric label="Lifetime" value={`$${(group.totalLifetime / 1000).toFixed(0)}K`} />
        <Metric label="Avg gift" value={`$${group.avgGift.toLocaleString()}`} />
      </div>

      {/* Footer: growth + engagement — single line, no divider */}
      <div className="flex items-center gap-4 mt-3 text-[12px]">
        <div className="flex items-center gap-1">
          {growthPositive
            ? <TrendingUp size={12} className="text-success" />
            : <TrendingDown size={12} className="text-danger" />}
          <span className={`font-medium ${growthPositive ? 'text-success' : 'text-danger'}`}>
            {growthPositive ? '+' : ''}{group.growthLast90}%
          </span>
          <span className="text-muted">90d</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted">Engagement</span>
          <span className={`font-medium ${engagementColor}`}>{engagementLabel}</span>
        </div>
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[16px] font-semibold text-primary">{value}</p>
    </div>
  );
}

function StatCard({ label, value, sublabel, positive }: { label: string; value: string; sublabel?: string; positive?: boolean }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-[32px] leading-[36px] font-semibold ${positive ? 'text-success' : 'text-primary'}`}>{value}</p>
      {sublabel && <p className="text-[13px] text-muted mt-1 line-clamp-1">{sublabel}</p>}
    </div>
  );
}
