import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bell, BellRing, Plus, Sparkles } from 'lucide-react';
import { policies, Stakeholder, Policy } from '../data/policies';
import { donors } from '../data/donors';
import { notesForEntity } from '../data/notes';
import { useToast, InternalNotePreview, Button, ComposeNoteModal, FollowUpComposer } from '../components/ui';
import { useRecent } from '../lib/RecentContext';
import { usePolicyRead } from '../lib/PolicyReadContext';
import { usePolicyFollow } from '../lib/PolicyFollowContext';
import { useMaturity } from '../lib/MaturityContext';
import { useActions } from '../lib/ActionContext';
import { useRole } from '../lib/RoleContext';
import { PolicyDetailDay0Page } from './day0/PolicyDetailDay0Page';

export function PolicyDetailPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <PolicyDetailDay0Page />;
  return <PolicyDetailDayXPage />;
}

function PolicyDetailDayXPage() {
  const { id } = useParams<{ id: string }>();
  const policy = policies.find((p) => p.id === id);
  const { trackVisit } = useRecent();
  const { markRead } = usePolicyRead();
  const { isFollowing, toggleFollowing } = usePolicyFollow();
  const { activeMember } = useRole();
  const { addAction } = useActions();
  const toast = useToast();
  const [composerOpen, setComposerOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    if (policy) {
      trackVisit({ type: 'policy', id: policy.id, label: policy.title, path: `/policy/${policy.id}` });
      markRead(policy.id);
    }
  }, [policy?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkedNotes = useMemo(() => (id ? notesForEntity('policy', id) : []), [id]);

  if (!policy) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Policy not found.</p>
        <Link to="/policy" className="text-primary underline mt-2 inline-block">Back to policy</Link>
      </div>
    );
  }

  const isHighRisk = policy.impactLevel === 'High risk';

  // Collapse mixed + uncertain into a single Uncertain bucket per the new design.
  const supportive = policy.stakeholders.filter((s) => s.stance === 'supportive' || s.stance === 'strong ally');
  const uncertain = policy.stakeholders.filter((s) => s.stance === 'mixed' || s.stance === 'uncertain');
  const opposed = policy.stakeholders.filter((s) => s.stance === 'opposed');
  const total = policy.stakeholders.length;

  const relatedDonorRows = (policy.relatedDonors ?? [])
    .map((link) => {
      const donor = donors.find((d) => d.id === link.donorId);
      return donor ? { donor, strength: link.strength } : null;
    })
    .filter((x): x is { donor: typeof donors[number]; strength: 'Strong' | 'Medium' | 'Low' } => x !== null);

  const relatedPolicies = (policy.relatedPolicyIds ?? [])
    .map((pid) => policies.find((p) => p.id === pid))
    .filter((p): p is Policy => Boolean(p));

  return (
    <>
      <Link to="/policy" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4 no-underline">
        <ArrowLeft size={14} /> Back to policy
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isHighRisk && (
              <span className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full bg-danger-soft text-danger border-danger/30">
                High Risk
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              const next = toggleFollowing(policy.id);
              toast.show({
                type: next ? 'success' : 'info',
                title: next ? 'Notifications on' : 'Notifications off',
                description: next
                  ? `You'll be alerted when ${policy.title} changes status, gets amended, or has a new hearing.`
                  : `You'll no longer receive updates for ${policy.title}.`,
              });
            }}
            className={`inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium border rounded-sm transition-colors
              ${isFollowing(policy.id)
                ? 'bg-accent-soft text-primary border-accent/50'
                : 'bg-surface text-secondary border-border-subtle hover:border-border-default hover:text-primary'
              }`}
          >
            {isFollowing(policy.id) ? <BellRing size={12} /> : <Bell size={12} />}
            {isFollowing(policy.id) ? 'Following' : 'Notify me'}
          </button>
        </div>
        <h1 className="page-title mb-2">{policy.title}</h1>
        <p className="text-[14px] text-secondary leading-relaxed max-w-3xl">{policy.summary}</p>

        <div className="grid grid-cols-4 gap-6 mt-6 pt-5 border-t border-border-subtle">
          <DetailStat label="Effective" value={policy.effectiveDate} />
          <DetailStat label="Jurisdiction" value={policy.jurisdiction} />
          <DetailStat label="Status" value={policy.status} />
          <DetailStat label="Opportunity & Risk" value={policy.impactLevel} />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          <Section
            title="Policy Timeline"
            subtitle="Recent changes, hearings, and milestones"
          >
            <div className="px-5 py-2">
              {policy.timeline.map((event, idx) => (
                <TimelineEvent key={idx} event={event} isLast={idx === policy.timeline.length - 1} />
              ))}
            </div>
          </Section>

          <Section
            title="Stakeholder Map"
            subtitle="Who supports, opposes, or is uncertain"
          >
            <div className="px-5 pt-5">
              <div className="flex gap-1 h-2 rounded-sm overflow-hidden bg-surface-muted">
                {supportive.length > 0 && (
                  <div className="bg-success" style={{ flex: supportive.length }} />
                )}
                {uncertain.length > 0 && (
                  <div className="bg-warning" style={{ flex: uncertain.length }} />
                )}
                {opposed.length > 0 && (
                  <div className="bg-danger" style={{ flex: opposed.length }} />
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-[12px] text-muted">
                <span className="flex items-center gap-1.5"><Swatch color="success" />Supportive ({supportive.length})</span>
                <span className="flex items-center gap-1.5"><Swatch color="warning" />Uncertain ({uncertain.length})</span>
                <span className="flex items-center gap-1.5"><Swatch color="danger" />Opposed ({opposed.length})</span>
              </div>
            </div>
            <div className="p-5 flex flex-col">
              {policy.stakeholders.map((s) => (
                <StakeholderRow key={s.name} stakeholder={s} />
              ))}
              {total === 0 && <p className="text-[13px] text-muted">No stakeholders mapped yet.</p>}
            </div>
          </Section>

          <Section
            title="Internal Discussion"
            subtitle="Notes from the team"
            action={
              <Button variant="ghost" size="sm" onClick={() => setNoteOpen(true)}>
                <Plus size={13} className="mr-1" /> Add Note
              </Button>
            }
          >
            <div className="px-5 divide-y divide-border-subtle">
              {linkedNotes.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[13px] text-secondary">No notes on this policy yet.</p>
                </div>
              ) : (
                linkedNotes.map((n) => <InternalNotePreview key={n.id} note={n} />)
              )}
            </div>
          </Section>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="relative bg-surface border border-border-subtle rounded-md overflow-hidden">
            <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-primary" />
                <h3 className="text-[15px] font-semibold text-primary tracking-tight">Recommended Action</h3>
              </div>
              <p className="text-[13px] text-primary leading-relaxed mb-4">{policy.recommendedAction}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setComposerOpen(true)}
              >
                Assign to Team
              </Button>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Related Donors</h3>
            </div>
            <div className="px-5 divide-y divide-border-subtle">
              {relatedDonorRows.length === 0 ? (
                <p className="text-[13px] text-muted py-4">No related donors yet.</p>
              ) : (
                relatedDonorRows.map(({ donor, strength }) => (
                  <Link
                    key={donor.id}
                    to={`/people/donors/${donor.id}`}
                    className="flex items-center justify-between gap-3 py-3 no-underline group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-surface-muted border border-border-subtle flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-primary truncate group-hover:underline underline-offset-2 decoration-border-default">
                          {donor.name}
                        </p>
                        <p className="text-[11px] text-muted">{strength}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Related Policy</h3>
            </div>
            <div className="px-5 divide-y divide-border-subtle">
              {relatedPolicies.length === 0 ? (
                <p className="text-[13px] text-muted py-4">No related policies yet.</p>
              ) : (
                relatedPolicies.map((rp) => {
                  const isOpp = rp.impactLevel.toLowerCase().includes('opportunity');
                  const isRisk = rp.impactLevel.toLowerCase().includes('risk');
                  const dotColor = isOpp ? 'bg-success' : isRisk ? 'bg-danger' : 'bg-warning';
                  return (
                    <Link
                      key={rp.id}
                      to={`/policy/${rp.id}`}
                      className="block py-3 no-underline group"
                    >
                      <p className="text-[13px] font-medium text-primary group-hover:underline underline-offset-2 decoration-border-default mb-1 line-clamp-2">
                        {rp.title}
                      </p>
                      <p className="text-[11px] text-muted flex items-center gap-1.5">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} /> {rp.status}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <FollowUpComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        defaultTitle={policy.recommendedAction}
        defaultContext={`Linked to policy: ${policy.title}. ${policy.summary}`}
        defaultEntity={{ type: 'policy', id: policy.id, label: policy.title, link: `/policy/${policy.id}` }}
        onCreate={(payload) => {
          addAction(
            {
              ...payload,
              entity:
                payload.entity ?? {
                  type: 'policy',
                  id: policy.id,
                  label: policy.title,
                  link: `/policy/${policy.id}`,
                },
            },
            activeMember.id,
            ['executive', 'policy'],
          );
          toast.show({ type: 'success', title: 'Assigned to team', description: payload.title });
        }}
      />

      <ComposeNoteModal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        entityLabel={policy.title}
        onSubmit={(body) => {
          toast.show({ type: 'success', title: 'Note added', description: body.slice(0, 60) });
          setNoteOpen(false);
        }}
      />
    </>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md">
      <div className="px-5 py-4 border-b border-border-subtle flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-primary tracking-tight">{title}</h2>
          {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow-plain mb-1.5">{label}</p>
      <p className="text-[13px] text-primary">{value}</p>
    </div>
  );
}

function Swatch({ color }: { color: 'success' | 'warning' | 'danger' }) {
  const bg = color === 'success' ? 'bg-success' : color === 'warning' ? 'bg-warning' : 'bg-danger';
  return <span className={`inline-block w-2 h-2 rounded-sm ${bg}`} />;
}

function StakeholderRow({ stakeholder }: { stakeholder: Stakeholder }) {
  const isSupportive = stakeholder.stance === 'supportive' || stakeholder.stance === 'strong ally';
  const isOpposed = stakeholder.stance === 'opposed';
  const variant = isSupportive ? 'success' : isOpposed ? 'danger' : 'warning';
  const label = isSupportive ? 'Supportive' : isOpposed ? 'Opposed' : 'Uncertain';
  const influence =
    stakeholder.name.includes('Council') || stakeholder.name.includes('Mayor')
      ? 'High'
      : stakeholder.name.includes('Network') || stakeholder.name.includes('Board')
      ? 'Low'
      : 'Medium';
  const chipStyle =
    variant === 'success'
      ? 'bg-success-soft text-success border-success/30'
      : variant === 'danger'
      ? 'bg-danger-soft text-danger border-danger/30'
      : 'bg-warning-soft text-warning border-warning/30';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0 first:pt-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-primary truncate">{stakeholder.name}</p>
          <p className="text-[11px] text-muted">Influence: {influence}</p>
        </div>
      </div>
      <span
        className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full ${chipStyle}`}
      >
        {label}
      </span>
    </div>
  );
}

function TimelineEvent({ event, isLast }: { event: { date: string; title: string; description?: string }; isLast: boolean }) {
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <div className="flex gap-4 py-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
        {!isLast && <div className="flex-1 w-px bg-border-subtle min-h-4 mt-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-semibold text-primary">{event.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{formattedDate}</span>
        </div>
        {event.description && (
          <p className="text-[12px] text-secondary mt-0.5">
            {event.description}{' '}
            <button className="text-primary underline underline-offset-2">Source</button>
          </p>
        )}
      </div>
    </div>
  );
}
