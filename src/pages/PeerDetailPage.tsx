import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { peerOrgs } from '../data/peers';
import { peerCampaigns } from '../data/campaigns';
import { actionsForEntity, ActionItem } from '../data/actions';
import { notesForEntity } from '../data/notes';
import { isPeerTracked, savedCampaigns } from '../data/workspace';
import {
  Button, Chip, KPI, BarComparison, useToast,
  TaskCard, FollowUpComposer, ActionDrawer, InternalNotePreview,
} from '../components/ui';
import { useRole } from '../lib/RoleContext';
import {
  ArrowLeft, Building, MapPin, Users, ExternalLink, Lock, Star, CheckCircle2,
  DollarSign, ArrowUpRight, Plus, Bookmark,
} from 'lucide-react';

export function PeerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const peer = peerOrgs.find(p => p.id === id);
  const peerCamps = peerCampaigns.filter(c => c.orgId === id);
  const toast = useToast();
  const { hasCapability } = useRole();
  const canAssign = hasCapability('assignActions');
  const [tracked, setTracked] = useState(id ? isPeerTracked(id) : false);
  const [savedCampaignIds, setSavedCampaignIds] = useState<string[]>(
    () => (id ? savedCampaigns.filter(c => c.peerId === id).map(c => c.theme) : [])
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const linkedActions = useMemo(() => (id ? actionsForEntity('peer', id) : []), [id]);
  const peerNotes = useMemo(() => (id ? notesForEntity('peer', id) : []), [id]);

  const toggleSavedCampaign = (theme: string) => {
    setSavedCampaignIds((prev) => {
      const next = prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme];
      toast.show({
        type: prev.includes(theme) ? 'info' : 'success',
        title: prev.includes(theme) ? 'Campaign unsaved' : 'Campaign saved',
        description: theme,
      });
      return next;
    });
  };

  if (!peer) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Peer organization not found.</p>
        <Link to="/peers" className="text-primary underline mt-2 inline-block">Back to peers</Link>
      </div>
    );
  }

  // Mock benchmark data — yours vs this peer
  const benchmarks = [
    { label: 'Email open rate', yours: 31, peer: parseFloat(peer.benchmarkStat.value) || 30, top: 36, suffix: '%' },
    { label: 'Donor retention', yours: 64, peer: 62, top: 72, suffix: '%' },
    { label: 'Conversion rate', yours: 3.8, peer: 4.2, top: 5.1, suffix: '%' },
  ];

  const topCampaignPerf = peerCamps.length > 0
    ? Math.max(...peerCamps.map(c => c.performanceVsAvg))
    : 0;

  const optInVariant: Record<string, 'success' | 'warning' | 'default'> = {
    'Opted in': 'success',
    'Pending': 'warning',
    'Not opted in': 'default',
  };

  return (
    <>
      <Link to="/peers" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to peers
      </Link>

      {/* Header — condensed */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between gap-6 mb-5">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
              <Building size={24} className="text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary">{peer.name}</h1>
              <p className="text-sm text-secondary mt-1">{peer.missionArea}</p>
              <div className="flex items-center gap-2 mt-2">
                <Chip label={peer.optInStatus} variant={optInVariant[peer.optInStatus]} />
                <Chip label={peer.orgSize.split(' (')[0]} variant="default" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                const next = !tracked;
                setTracked(next);
                toast.show({
                  type: next ? 'success' : 'info',
                  title: next ? 'Now tracking' : 'Stopped tracking',
                  description: peer.name,
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border rounded-sm
                transition-colors duration-150 ease-out
                ${tracked
                  ? 'bg-accent-soft border-accent text-primary'
                  : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'}`}
            >
              <Star size={13} className={tracked ? 'fill-accent text-primary' : ''} />
              {tracked ? 'Tracking' : 'Track'}
            </button>
            <Button variant="secondary"><ExternalLink size={14} className="mr-2" />Public profile</Button>
            <Button onClick={() => setComposerOpen(true)} disabled={!canAssign}>
              <Plus size={14} className="mr-1.5" /> Action
            </Button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-4 gap-6 pt-5 border-t border-border-subtle">
          <MetaItem icon={<MapPin size={12} />} label="Geography" value={peer.geography} />
          <MetaItem icon={<Users size={12} />} label="Staff" value={peer.orgSize} />
          <MetaItem icon={<DollarSign size={12} />} label="Revenue" value={peer.revenueBand} />
          <MetaItem icon={<Building size={12} />} label="Type" value="Nonprofit" />
        </div>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          {/* Linked actions */}
          {linkedActions.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-primary">Active follow-ups</h2>
                  <Chip
                    label={`${linkedActions.filter((a) => a.status !== 'completed').length} active`}
                    variant="default"
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setComposerOpen(true)} disabled={!canAssign}>
                  <Plus size={13} className="mr-1" /> New
                </Button>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {linkedActions.map((a) => (
                  <TaskCard
                    key={a.id}
                    action={a}
                    canEdit={canAssign}
                    onStatusChange={() => toast.show({ type: 'info', title: 'Status updated' })}
                    onOwnerChange={() => toast.show({ type: 'success', title: 'Task reassigned' })}
                    onOpenDrawer={(action) => {
                      setDrawerAction(action);
                      setDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comparison KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <KPI
              label="Their best metric"
              value={peer.benchmarkStat.value}
              delta={4.2}
              deltaLabel={peer.benchmarkStat.label.toLowerCase()}
              trend={[28, 29, 30, 31, 32, 33, 34, 33, 34, 34]}
            />
            <KPI
              label="Campaigns shared"
              value={peerCamps.length.toString()}
              deltaLabel={peerCamps.length === 0 ? 'none shared' : 'last 6 months'}
              trend={peerCamps.length > 0 ? [1, 1, 2, 2, 2, 3, 3, peerCamps.length, peerCamps.length, peerCamps.length] : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
            />
            <KPI
              label="Top campaign performance"
              value={topCampaignPerf > 0 ? `+${topCampaignPerf - 100}%` : '—'}
              deltaLabel={topCampaignPerf > 0 ? 'vs. sector average' : 'no data shared'}
              delta={topCampaignPerf > 100 ? topCampaignPerf - 100 : undefined}
            />
          </div>

          {/* Side-by-side comparison */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">You vs. {peer.name.split(' ')[0]}</h2>
              <p className="text-[13px] text-muted mt-0.5">Anonymized benchmark comparison</p>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {benchmarks.map(b => (
                <BarComparison
                  key={b.label}
                  label={b.label}
                  yourValue={b.yours}
                  peerValue={b.peer}
                  topValue={b.top}
                  suffix={b.suffix}
                />
              ))}
            </div>
          </div>

          {/* Their recent campaigns */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Recent campaigns</h2>
                <p className="text-[13px] text-muted mt-0.5">
                  {peerCamps.length > 0
                    ? `${peerCamps.length} shared by this org`
                    : 'No campaign data shared'}
                </p>
              </div>
              <Link to="/peers/campaigns" className="text-[13px] text-secondary hover:text-primary underline">
                Full library
              </Link>
            </div>
            <div className="divide-y divide-border-subtle">
              {peerCamps.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted">No campaign data shared.</div>
              ) : (
                peerCamps.map((c) => {
                  const isSaved = savedCampaignIds.includes(c.theme);
                  return (
                    <div key={c.id} className="group p-5 hover:bg-surface-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Chip label={c.theme} variant="info" />
                            <span className="text-[12px] text-muted">{c.dateRange}</span>
                          </div>
                          <p className="text-sm font-semibold text-primary">{c.title}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleSavedCampaign(c.theme)}
                            className={`inline-flex items-center gap-1 px-2 py-1 text-[12px] font-medium border rounded-sm
                              transition-colors duration-150 ease-out
                              ${isSaved
                                ? 'bg-accent-soft border-accent text-primary'
                                : 'bg-surface border-border-subtle text-secondary hover:border-border-default hover:text-primary'}`}
                          >
                            <Bookmark size={11} className={isSaved ? 'fill-accent' : ''} />
                            {isSaved ? 'Saved' : 'Save'}
                          </button>
                          <Chip
                            label={`${c.performanceVsAvg > 100 ? '+' : ''}${(c.performanceVsAvg - 100).toFixed(0)}% vs avg`}
                            variant={c.performanceVsAvg >= 100 ? 'success' : 'default'}
                          />
                        </div>
                      </div>
                      <p className="text-[13px] text-secondary leading-relaxed italic">"{c.topMessage}"</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Why they're a peer */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Why they're a peer</h3>
            </div>
            <div className="p-5 flex flex-col gap-2.5">
              <PeerReason label="Similar mission area" />
              <PeerReason label="Comparable size and revenue" />
              <PeerReason label="Same metro region" />
              <PeerReason label="Active in last 90 days" />
            </div>
          </div>

          {/* Data sharing */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
              <Lock size={14} className="text-secondary" />
              <h3 className="text-[14px] font-semibold text-primary">Data sharing</h3>
            </div>
            <div className="p-5">
              <Chip label={peer.optInStatus} variant={optInVariant[peer.optInStatus]} />
              <p className="text-[13px] text-secondary mt-3 leading-relaxed">
                {peer.optInStatus === 'Opted in'
                  ? 'This organization shares anonymized benchmark and campaign data with peer orgs.'
                  : peer.optInStatus === 'Pending'
                  ? 'This organization has been invited to share data but has not yet opted in.'
                  : 'This organization has not opted in to data sharing. Comparisons use public data only.'}
              </p>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Recent activity</h3>
            </div>
            <div className="divide-y divide-border-subtle">
              {peerCamps.slice(0, 2).map(c => (
                <div key={c.id} className="flex items-start gap-3 px-5 py-3">
                  <ArrowUpRight size={12} className="text-muted mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-primary leading-tight">{c.title}</p>
                    <p className="text-[11px] text-muted mt-0.5">{c.dateRange}</p>
                  </div>
                </div>
              ))}
              {peerCamps.length === 0 && (
                <p className="px-5 py-4 text-[13px] text-muted">No recent activity shared.</p>
              )}
            </div>
          </div>

          {/* Internal notes */}
          {peerNotes.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-3 border-b border-border-subtle">
                <h3 className="text-[14px] font-semibold text-primary">Team notes</h3>
              </div>
              <div className="px-5 divide-y divide-border-subtle">
                {peerNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultEntity={{ type: 'peer', id: peer.id, label: peer.name, link: `/peers/${peer.id}` }}
        defaultTitle={`Review ${peer.name}'s recent campaign work`}
        defaultContext={`Triggered from ${peer.name}'s peer detail.`}
        onCreate={(payload) => {
          toast.show({
            type: 'success',
            title: 'Action created',
            description: payload.title,
          });
        }}
      />
      <ActionDrawer
        action={drawerAction}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        canEdit={canAssign}
      />
    </>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-[13px] text-primary">{value}</p>
    </div>
  );
}

function PeerReason({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 size={14} className="text-success flex-shrink-0" />
      <span className="text-[13px] text-primary">{label}</span>
    </div>
  );
}
