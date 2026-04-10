import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { donorGroups, DonorGroup } from '../../data/groups';
import { Button, Chip, SearchBar, SegmentedControl } from '../../components/ui';
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

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <SegmentedControl
          options={groupTypeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <Button variant="primary"><Plus size={14} className="mr-1.5" />New group</Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search groups by name or description..." />
        </div>
        <span className="text-[13px] text-muted">{filtered.length} {filtered.length === 1 ? 'group' : 'groups'}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(group => <GroupCard key={group.id} group={group} />)}
      </div>

      {filtered.length === 0 && (
        <div className="bg-surface border border-border-subtle rounded-md p-12 text-center">
          <Users size={32} className="mx-auto text-muted mb-3" />
          <p className="text-sm font-medium text-primary mb-1">No groups match your search</p>
          <p className="text-[13px] text-muted">Try adjusting your filters or search query.</p>
        </div>
      )}
    </>
  );
}

function GroupCard({ group }: { group: DonorGroup }) {
  const typeVariant: any = {
    segment: 'info',
    campaign: 'accent',
    event: 'warning',
    persona: 'default',
  };
  const growthPositive = group.growthLast90 >= 0;
  const engagementColor = group.engagementScore >= 70 ? '#0E7C66' : group.engagementScore >= 50 ? '#B07100' : '#A14A3B';

  return (
    <Link
      to={`/people/groups/${group.id}`}
      className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Chip label={group.type} variant={typeVariant[group.type]} />
            {group.tags.slice(0, 2).map(t => <Chip key={t} label={t} variant="default" />)}
          </div>
          <h3 className="text-[18px] leading-[24px] font-semibold text-primary mb-1">{group.name}</h3>
          <p className="text-[13px] text-secondary line-clamp-2">{group.description}</p>
        </div>
        <ArrowUpRight size={14} className="text-muted flex-shrink-0 mt-1" />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
        <Metric label="Members" value={group.memberCount.toLocaleString()} />
        <Metric label="Lifetime" value={`$${(group.totalLifetime / 1000).toFixed(0)}K`} />
        <Metric label="Avg gift" value={`$${group.avgGift.toLocaleString()}`} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {growthPositive ? <TrendingUp size={12} className="text-success" /> : <TrendingDown size={12} className="text-danger" />}
            <span className={`text-[12px] font-medium ${growthPositive ? 'text-success' : 'text-danger'}`}>
              {growthPositive ? '+' : ''}{group.growthLast90}% 90d
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-muted">Engagement</span>
            <span className="text-[12px] font-medium" style={{ color: engagementColor }}>{group.engagementScore}/100</span>
          </div>
        </div>
        <span className="text-[11px] text-muted">by {group.createdBy}</span>
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
