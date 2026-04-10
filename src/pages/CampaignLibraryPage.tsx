import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { peerCampaigns, PeerCampaign, CampaignTheme, CampaignChannel } from '../data/campaigns';
import {
  PageHeader, Chip, SearchBar, Button, SegmentedControl, Modal, Checkbox, EmptyState, useToast,
} from '../components/ui';
import {
  Filter, Star, TrendingUp, Megaphone, BookOpen, ArrowLeft,
} from 'lucide-react';

const themeOptions = [
  { value: 'all', label: 'All themes' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'high-performing', label: 'High-performing' },
];

const themeFilterValues: CampaignTheme[] = [
  'Emergency aid', 'Tenant rights', 'Housing policy', 'Year-end appeal',
  'Capital campaign', 'Volunteer drive', 'Stewardship', 'Awareness',
  'Recurring acquisition', 'Family services',
];

const channelFilterValues: CampaignChannel[] = [
  'Email', 'Direct mail', 'Social media', 'SMS', 'Press', 'Events', 'Phone', 'Door-to-door', 'Webinars', 'Partner network',
];

export function CampaignLibraryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState<{ themes: string[]; channels: string[] }>({ themes: [], channels: [] });
  const toast = useToast();

  const toggleTheme = (t: string) => {
    setAdvFilters(f => ({
      ...f,
      themes: f.themes.includes(t) ? f.themes.filter(x => x !== t) : [...f.themes, t],
    }));
  };
  const toggleChannel = (c: string) => {
    setAdvFilters(f => ({
      ...f,
      channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c],
    }));
  };
  const clearAdv = () => setAdvFilters({ themes: [], channels: [] });
  const advCount = advFilters.themes.length + advFilters.channels.length;

  const filtered = useMemo(() => {
    return peerCampaigns.filter(c => {
      if (filter === 'favorites' && !c.isFavorite) return false;
      if (filter === 'high-performing' && c.performanceVsAvg < 100) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.topMessage.toLowerCase().includes(search.toLowerCase()) && !c.orgName.toLowerCase().includes(search.toLowerCase())) return false;
      if (advFilters.themes.length && !advFilters.themes.includes(c.theme)) return false;
      if (advFilters.channels.length && !c.channels.some(ch => advFilters.channels.includes(ch))) return false;
      return true;
    });
  }, [search, filter, advFilters]);

  const stats = {
    total: peerCampaigns.length,
    favorites: peerCampaigns.filter(c => c.isFavorite).length,
    highPerforming: peerCampaigns.filter(c => c.performanceVsAvg >= 100).length,
    avgPerf: Math.round(peerCampaigns.reduce((sum, c) => sum + c.performanceVsAvg, 0) / peerCampaigns.length),
  };

  return (
    <>
      <Link to="/peers" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to peers
      </Link>

      <PageHeader
        title="Campaign intelligence"
        subtitle="What’s working in your sector — anonymized peer campaigns"
        serif
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total campaigns" value={stats.total.toString()} icon={<BookOpen size={14} />} />
        <StatCard label="High-performing" value={stats.highPerforming.toString()} icon={<TrendingUp size={14} />} sublabel="above sector avg" />
        <StatCard label="Saved as favorite" value={stats.favorites.toString()} icon={<Star size={14} />} />
        <StatCard label="Avg performance" value={`+${stats.avgPerf - 100}%`} icon={<Megaphone size={14} />} sublabel="vs sector baseline" />
      </div>

      {/* View + filters */}
      <div className="flex items-center gap-3 mb-4">
        <SegmentedControl options={themeOptions} value={filter} onChange={setFilter} />
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search campaigns by title, message, or org..." />
        </div>
        <Button variant="secondary" onClick={() => setFilterModalOpen(true)}>
          <Filter size={14} className="mr-2" />
          Filters {advCount > 0 && <span className="ml-1.5 text-[12px] bg-accent text-primary px-1.5 rounded-sm">{advCount}</span>}
        </Button>
      </div>

      {advCount > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {advFilters.themes.map(t => <Chip key={`t-${t}`} label={t} onRemove={() => toggleTheme(t)} variant="info" />)}
          {advFilters.channels.map(c => <Chip key={`c-${c}`} label={c} onRemove={() => toggleChannel(c)} />)}
          <button onClick={clearAdv} className="text-[13px] text-secondary hover:text-primary underline">Clear all</button>
        </div>
      )}

      {/* Campaign cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={32} />}
          title="No campaigns match your filters"
          description="Try adjusting your filters or search query."
          action={{ label: 'Clear filters', onClick: () => { clearAdv(); setSearch(''); setFilter('all'); } }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}

      <Modal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter campaigns"
        width="max-w-2xl"
        footer={
          <>
            <Button variant="ghost" onClick={clearAdv}>Clear all</Button>
            <Button onClick={() => {
              setFilterModalOpen(false);
              if (advCount > 0) {
                toast.show({
                  type: 'success',
                  title: `${advCount} ${advCount === 1 ? 'filter' : 'filters'} applied`,
                  description: `Showing ${filtered.length} of ${peerCampaigns.length} campaigns`,
                });
              }
            }}>Apply filters</Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h4 className="text-[13px] font-semibold text-primary mb-2">Theme</h4>
            <div className="flex flex-col gap-2">
              {themeFilterValues.map(t => (
                <Checkbox key={t} label={t} checked={advFilters.themes.includes(t)} onChange={() => toggleTheme(t)} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-primary mb-2">Channel</h4>
            <div className="flex flex-col gap-2">
              {channelFilterValues.map(c => (
                <Checkbox key={c} label={c} checked={advFilters.channels.includes(c)} onChange={() => toggleChannel(c)} />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function CampaignCard({ campaign }: { campaign: PeerCampaign }) {
  const perfVariant = campaign.performanceVsAvg >= 150 ? 'success' : campaign.performanceVsAvg >= 100 ? 'success' : 'default';
  const perfLabel = `${campaign.performanceVsAvg > 100 ? '+' : ''}${(campaign.performanceVsAvg - 100).toFixed(0)}% vs avg`;

  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Chip label={campaign.theme} variant="info" />
            {campaign.isFavorite && <Star size={13} className="text-accent fill-accent" />}
          </div>
          <h3 className="text-[16px] leading-[22px] font-semibold text-primary mb-1">{campaign.title}</h3>
          <Link to={`/peers/${campaign.orgId}`} className="text-[13px] text-secondary hover:text-primary no-underline">
            From {campaign.orgName}
          </Link>
        </div>
        <Chip label={perfLabel} variant={perfVariant} />
      </div>

      {/* Top message */}
      <div className="mb-3 px-3 py-2.5 bg-surface-muted border-l-2 border-border-default">
        <p className="text-[13px] text-primary italic leading-relaxed line-clamp-3">"{campaign.topMessage}"</p>
      </div>

      {/* Notable tactic */}
      <div className="mb-3">
        <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">Notable tactic</p>
        <p className="text-[13px] text-secondary leading-relaxed line-clamp-2">{campaign.notableTactic}</p>
      </div>

      {/* Outcome */}
      <div className="mb-3">
        <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">Outcome</p>
        <p className="text-[13px] text-secondary leading-relaxed line-clamp-2">{campaign.outcome}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {campaign.channels.slice(0, 3).map(ch => (
            <span key={ch} className="text-[12px] text-muted">{ch}</span>
          ))}
          {campaign.channels.length > 3 && <span className="text-[12px] text-muted">+{campaign.channels.length - 3}</span>}
        </div>
        <div className="text-[12px] text-muted">{campaign.dateRange}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, sublabel }: { label: string; value: string; icon: React.ReactNode; sublabel?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-muted">{icon}</span>
        <p className="text-[12px] font-medium text-muted uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-[32px] leading-[36px] font-semibold text-primary">{value}</p>
      {sublabel && <p className="text-[13px] text-muted mt-1">{sublabel}</p>}
    </div>
  );
}
