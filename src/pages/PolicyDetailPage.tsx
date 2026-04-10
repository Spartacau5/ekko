import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { policies, Stakeholder } from '../data/policies';
import { watchlist } from '../data/watchlist';
import { actionsForEntity, ActionItem } from '../data/actions';
import { notesForEntity } from '../data/notes';
import { watchlistGroups } from '../data/workspace';
import {
  Button, Chip, WatchlistToggle, useToast,
  TaskCard, FollowUpComposer, ActionDrawer, InternalNotePreview, ScopeBadge,
} from '../components/ui';
import { useRole } from '../lib/RoleContext';
import { roleMeta } from '../data/team';
import {
  ArrowLeft, Clock, MapPin, AlertCircle, Users, Sparkles, ExternalLink, Bell, Plus, Folder,
} from 'lucide-react';

export function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const policy = policies.find((p) => p.id === id);
  const watchItem = watchlist.find((w) => w.policyId === id);
  const [isWatching, setIsWatching] = useState(!!watchItem);
  const [composerOpen, setComposerOpen] = useState(false);
  const [drawerAction, setDrawerAction] = useState<ActionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();
  const { hasCapability, activeRole } = useRole();
  const canAssign = hasCapability('assignActions');

  const linkedActions = useMemo(() => (id ? actionsForEntity('policy', id) : []), [id]);
  const linkedNotes = useMemo(() => (id ? notesForEntity('policy', id) : []), [id]);
  const memberWatchlists = useMemo(
    () => (id ? watchlistGroups.filter((g) => g.policyIds.includes(id)) : []),
    [id]
  );

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Policy not found.</p>
        <Link to="/policy" className="text-primary underline mt-2 inline-block">Back to policy</Link>
      </div>
    );
  }

  const isOpportunity = policy.impactLevel.toLowerCase().includes('opportunity');
  const isRisk = policy.impactLevel.toLowerCase().includes('risk');
  const impactVariant = isOpportunity ? 'success' : isRisk ? 'danger' : 'warning';

  // Compute alignment metrics
  const supportive = policy.stakeholders.filter(s => s.stance === 'supportive' || s.stance === 'strong ally').length;
  const mixed = policy.stakeholders.filter(s => s.stance === 'mixed' || s.stance === 'uncertain').length;
  const opposed = policy.stakeholders.filter(s => s.stance === 'opposed').length;
  const total = policy.stakeholders.length;
  const alignmentPct = total > 0 ? Math.round((supportive / total) * 100) : 0;

  return (
    <>
      <Link to="/policy" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to policy
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Chip label={policy.jurisdiction} variant="info" />
              <Chip label={policy.topic} variant="default" />
              <Chip label={policy.status} variant="default" />
              <Chip label={policy.impactLevel} variant={impactVariant} />
            </div>
            <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary mb-2">{policy.title}</h1>
            <p className="text-base text-secondary leading-relaxed max-w-3xl">{policy.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <WatchlistToggle
                watching={isWatching}
                onToggle={() => {
                  const next = !isWatching;
                  setIsWatching(next);
                  toast.show({
                    type: next ? 'success' : 'info',
                    title: next ? 'Added to watchlist' : 'Removed from watchlist',
                    description: policy.title,
                  });
                }}
              />
              <Button variant="secondary"><ExternalLink size={14} className="mr-2" />Source</Button>
            </div>
            <Button
              onClick={() => setComposerOpen(true)}
              disabled={!canAssign}
            >
              <Plus size={14} className="mr-1.5" />
              Assign action
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-5 border-t border-border-subtle">
          <DetailItem icon={<Clock size={13} />} label="Effective" value={policy.effectiveDate} />
          <DetailItem icon={<MapPin size={13} />} label="Jurisdiction" value={policy.jurisdiction} />
          <DetailItem icon={<AlertCircle size={13} />} label="Status" value={policy.status} />
          <DetailItem icon={<Users size={13} />} label="Teams affected" value={policy.teams.join(', ')} />
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Open actions on this policy */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <h2 className="text-[15px] font-semibold text-primary">Active follow-ups</h2>
                <Chip
                  label={`${linkedActions.filter(a => a.status !== 'completed').length} active`}
                  variant={linkedActions.some(a => a.priority === 'urgent') ? 'danger' : 'default'}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComposerOpen(true)}
                disabled={!canAssign}
              >
                <Plus size={13} className="mr-1" /> New action
              </Button>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {linkedActions.length === 0 ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-[13px] text-secondary">
                    No follow-ups assigned yet. {!canAssign && `${roleMeta[activeRole].label} can view but cannot assign on this policy.`}
                  </p>
                </div>
              ) : (
                linkedActions.map((a) => (
                  <TaskCard
                    key={a.id}
                    action={a}
                    canEdit={canAssign}
                    onStatusChange={(actionId, next) => {
                      toast.show({
                        type: next === 'completed' ? 'success' : 'info',
                        title:
                          next === 'completed' ? 'Task completed' :
                          next === 'in_progress' ? 'Task started' : 'Task reopened',
                      });
                    }}
                    onOwnerChange={() => {
                      toast.show({ type: 'success', title: 'Task reassigned' });
                    }}
                    onOpenDrawer={(action) => {
                      setDrawerAction(action);
                      setDrawerOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Policy timeline</h2>
              <p className="text-[13px] text-muted mt-0.5">Recent changes, hearings, and milestones</p>
            </div>
            <div className="px-5 py-2">
              {policy.timeline.map((event, idx) => (
                <PolicyTimelineEvent key={idx} event={event} isLast={idx === policy.timeline.length - 1} />
              ))}
            </div>
          </div>

          {/* Stakeholder map */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Stakeholder map</h2>
              <p className="text-[13px] text-muted mt-0.5">Who supports, opposes, or is uncertain</p>
            </div>

            {/* Alignment bar */}
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-primary">Stakeholder alignment</span>
                <span className="text-[13px] text-muted">{supportive} of {total} aligned</span>
              </div>
              <div className="flex gap-1 h-2 rounded-sm overflow-hidden">
                {Array.from({ length: supportive }).map((_, i) => (
                  <div key={`s${i}`} className="flex-1 bg-success" />
                ))}
                {Array.from({ length: mixed }).map((_, i) => (
                  <div key={`m${i}`} className="flex-1 bg-warning" />
                ))}
                {Array.from({ length: opposed }).map((_, i) => (
                  <div key={`o${i}`} className="flex-1 bg-danger" />
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2 text-[12px] text-muted">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-success rounded-sm" />Supportive ({supportive})</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-warning rounded-sm" />Mixed ({mixed})</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-danger rounded-sm" />Opposed ({opposed})</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {policy.stakeholders.map((s) => (
                <StakeholderRow key={s.name} stakeholder={s} />
              ))}
            </div>
          </div>

          {/* Internal discussion / notes */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Internal discussion</h2>
                <p className="text-[13px] text-muted mt-0.5">Notes from the team</p>
              </div>
              <Button variant="ghost" size="sm">
                <Plus size={13} className="mr-1" /> Note
              </Button>
            </div>
            <div className="px-5 divide-y divide-border-subtle">
              {linkedNotes.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[13px] text-secondary">No notes on this policy yet.</p>
                </div>
              ) : (
                linkedNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)
              )}
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Recommended action */}
          <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
            <div className="px-5 py-4 bg-accent-soft/40 border-b border-border-subtle flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h3 className="text-[14px] font-semibold text-primary">Recommended action</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-primary leading-relaxed mb-4">{policy.recommendedAction}</p>
              <Button
                size="sm"
                className="w-full justify-center"
                onClick={() => setComposerOpen(true)}
                disabled={!canAssign}
              >
                Turn into follow-up
              </Button>
              {!canAssign && (
                <p className="text-[11px] text-muted mt-2 text-center">
                  {roleMeta[activeRole].label}s can view but not assign on this policy.
                </p>
              )}
            </div>
          </div>

          {/* Impact panel */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Impact assessment</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <ImpactRow label="Opportunity / risk" value={policy.impactLevel} variant={impactVariant} />
              <ImpactRow label="Urgency" value={policy.effectiveDate === 'Immediate' ? 'Immediate' : 'Near-term'} />
              <ImpactRow label="Stakeholder alignment" value={`${alignmentPct}% (${supportive}/${total})`} />
              <ImpactRow label="Mission relevance" value="High — directly affects core programs" />
            </div>
          </div>

          {/* Watchlist info */}
          {watchItem && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
                <Bell size={14} className="text-accent" />
                <h3 className="text-[14px] font-semibold text-primary">On watchlist</h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="text-[12px] text-muted">
                  Added by <span className="text-primary font-medium">{watchItem.addedBy}</span> on{' '}
                  {new Date(watchItem.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {watchItem.notes && (
                  <p className="text-[13px] text-secondary italic leading-relaxed">"{watchItem.notes}"</p>
                )}
                <div className="flex items-center justify-between text-[12px] text-muted pt-2 border-t border-border-subtle">
                  <span>{watchItem.alertCount} alerts received</span>
                  <span>Last alert {watchItem.lastAlertDate ? new Date(watchItem.lastAlertDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Member watchlists */}
          {memberWatchlists.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-md">
              <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
                <Folder size={14} className="text-secondary" />
                <h3 className="text-[14px] font-semibold text-primary">Member of watchlists</h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                {memberWatchlists.map((wl) => (
                  <div key={wl.id} className="flex items-start justify-between gap-3 pb-3 border-b border-border-subtle last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-primary">{wl.name}</p>
                      <p className="text-[12px] text-muted leading-snug">{wl.description}</p>
                    </div>
                    <ScopeBadge scope={wl.shareLevel} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Teams to notify</h3>
            </div>
            <div className="p-5 flex flex-wrap gap-2">
              {policy.teams.map((team) => (
                <Chip key={team} label={team} variant="default" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultEntity={{ type: 'policy', id: policy.id, label: policy.title, link: `/policy/${policy.id}` }}
        defaultTitle={policy.recommendedAction}
        defaultContext={`Linked to ${policy.title}. ${policy.summary}`}
        onCreate={(payload) => {
          toast.show({
            type: 'success',
            title: 'Action assigned',
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

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm text-primary">{value}</p>
    </div>
  );
}

function ImpactRow({ label, value, variant }: { label: string; value: string; variant?: any }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      {variant ? <Chip label={value} variant={variant} /> : <p className="text-sm text-primary">{value}</p>}
    </div>
  );
}

function StakeholderRow({ stakeholder }: { stakeholder: Stakeholder }) {
  const variantMap: any = {
    supportive: 'success',
    'strong ally': 'success',
    mixed: 'warning',
    uncertain: 'warning',
    opposed: 'danger',
  };
  // Mock influence (low/medium/high) based on name
  const influence = stakeholder.name.includes('Council') || stakeholder.name.includes('Mayor') ? 'High' : stakeholder.name.includes('Coalition') || stakeholder.name.includes('Agency') ? 'Medium' : 'Medium';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0 first:pt-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
          <Users size={15} className="text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{stakeholder.name}</p>
          <p className="text-[12px] text-muted">Influence: {influence}</p>
        </div>
      </div>
      <Chip label={stakeholder.stance} variant={variantMap[stakeholder.stance] || 'default'} />
    </div>
  );
}

function PolicyTimelineEvent({ event, isLast }: { event: any; isLast: boolean }) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex gap-4 py-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface ring-1 ring-border-default mt-1.5" />
        {!isLast && <div className="flex-1 w-px bg-border-subtle min-h-4 mt-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-primary">{event.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{formattedDate}</span>
        </div>
        {event.description && (
          <p className="text-[13px] text-secondary mt-0.5">{event.description}</p>
        )}
      </div>
    </div>
  );
}

