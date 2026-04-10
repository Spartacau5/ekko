import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { policies } from '../data/policies';
import { Button, Chip } from '../components/ui';
import { ArrowLeft, Clock, MapPin, AlertCircle, Users, Sparkles, ExternalLink } from 'lucide-react';

export function PolicyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const policy = policies.find((p) => p.id === id);

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

  return (
    <>
      <Link to="/policy" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to policy
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Chip label={policy.jurisdiction} variant="info" />
              <Chip label={policy.topic} variant="default" />
              <Chip label={policy.status} variant="default" />
              <Chip label={policy.impactLevel} variant={impactVariant} />
            </div>
            <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary mb-2">{policy.title}</h1>
            <p className="text-base text-secondary leading-relaxed max-w-3xl">{policy.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button variant="secondary"><ExternalLink size={14} className="mr-2" />Source</Button>
            <Button>Add to brief</Button>
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
        {/* Timeline */}
        <div className="col-span-8">
          <div className="bg-surface border border-border-subtle rounded-md mb-6">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Policy timeline</h2>
              <p className="text-[13px] text-muted mt-0.5">Recent changes, hearings, and milestones</p>
            </div>
            <div className="px-5 py-2">
              {policy.timeline.map((event, idx) => (
                <PolicyTimelineEvent
                  key={idx}
                  event={event}
                  isLast={idx === policy.timeline.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">Stakeholder map</h2>
              <p className="text-[13px] text-muted mt-0.5">Who supports, opposes, or is uncertain</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {policy.stakeholders.map((s) => (
                <StakeholderRow key={s.name} stakeholder={s} />
              ))}
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
              <Button size="sm" className="w-full justify-center">Assign to team</Button>
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
              <ImpactRow label="Stakeholder alignment" value={`${policy.stakeholders.filter(s => s.stance === 'supportive' || s.stance === 'strong ally').length}/${policy.stakeholders.length} aligned`} />
            </div>
          </div>

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

function StakeholderRow({ stakeholder }: { stakeholder: any }) {
  const variantMap: any = {
    supportive: 'success',
    'strong ally': 'success',
    mixed: 'warning',
    uncertain: 'warning',
    opposed: 'danger',
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
          <Users size={15} className="text-secondary" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary">{stakeholder.name}</p>
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
