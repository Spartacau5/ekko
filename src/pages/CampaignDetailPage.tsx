import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Calendar, Megaphone, Target, TrendingUp, Users } from 'lucide-react';
import { peerCampaigns } from '../data/campaigns';

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const campaign = peerCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Campaign not found.</p>
        <Link to="/peers/campaigns" className="text-primary underline mt-2 inline-block">
          Back to campaigns
        </Link>
      </div>
    );
  }

  const perfVariant =
    campaign.performanceVsAvg > 100
      ? 'success'
      : campaign.performanceVsAvg >= 80
      ? 'warning'
      : 'muted';
  const perfStyle =
    perfVariant === 'success'
      ? 'bg-success-soft text-success border-success/30'
      : perfVariant === 'warning'
      ? 'bg-warning-soft text-warning border-warning/30'
      : 'bg-surface-muted text-secondary border-border-subtle';

  const sourceLabel =
    campaign.source === 'Our campaigns' ? 'Our campaign' : 'Peer campaign';

  return (
    <>
      <Link
        to="/peers/campaigns"
        className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4 no-underline"
      >
        <ArrowLeft size={14} /> Back to campaigns
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none bg-surface-muted text-secondary border border-border-subtle rounded-full">
              {sourceLabel}
            </span>
            <span className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none bg-surface-muted text-primary border border-border-subtle rounded-full">
              {campaign.theme}
            </span>
            <span className={`inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none border rounded-full ${perfStyle}`}>
              {campaign.performanceVsAvg > 100 ? '+' : ''}
              {(campaign.performanceVsAvg - 100).toFixed(0)}% vs sector avg
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default"
          >
            <Bookmark size={12} /> Save
          </button>
        </div>
        <h1 className="page-title">{campaign.title}</h1>
        <p className="text-[13px] text-secondary mt-1">
          {campaign.source === 'Our campaigns' ? 'From ' : 'From '}
          {campaign.source === 'Our campaigns' ? (
            <span className="text-primary font-medium">{campaign.orgName}</span>
          ) : (
            <Link to={`/peers/${campaign.orgId}`} className="text-primary font-medium hover:underline no-underline">
              {campaign.orgName}
            </Link>
          )}
        </p>

        <div className="grid grid-cols-4 gap-6 mt-5 pt-5 border-t border-border-subtle">
          <DetailStat icon={<Calendar size={12} />} label="Duration" value={`${campaign.duration} · ${campaign.dateRange}`} />
          <DetailStat icon={<Users size={12} />} label="Audience" value={campaign.audienceDescription} />
          <DetailStat icon={<TrendingUp size={12} />} label="Reach" value={campaign.estimatedReach.toLocaleString()} />
          <DetailStat icon={<Megaphone size={12} />} label="Channels" value={campaign.channels.join(', ')} />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          <Section title="Top message" icon={<Megaphone size={13} />}>
            <blockquote className="border-l-2 border-accent pl-4 text-[14px] text-primary italic leading-relaxed">
              "{campaign.topMessage}"
            </blockquote>
          </Section>

          <Section title="Notable tactic" icon={<Target size={13} />}>
            <p className="text-[13px] text-primary leading-relaxed">{campaign.notableTactic}</p>
          </Section>

          <Section title="Outcome" icon={<TrendingUp size={13} />}>
            <p className="text-[13px] text-primary leading-relaxed">{campaign.outcome}</p>
          </Section>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Channels used</h3>
            </div>
            <div className="p-5 flex flex-wrap gap-1.5">
              {campaign.channels.map((ch) => (
                <span
                  key={ch}
                  className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none bg-surface-muted text-primary border border-border-subtle rounded-full"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-[15px] font-semibold text-primary tracking-tight">Quick facts</h3>
            </div>
            <div className="p-5 flex flex-col gap-3 text-[13px]">
              <InfoRow label="Theme" value={campaign.theme} />
              <InfoRow
                label="Performance"
                value={`${campaign.performanceVsAvg > 100 ? '+' : ''}${(
                  campaign.performanceVsAvg - 100
                ).toFixed(0)}% vs sector`}
              />
              <InfoRow label="Estimated reach" value={campaign.estimatedReach.toLocaleString()} />
              <InfoRow label="Source" value={sourceLabel} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface border border-border-subtle rounded-md">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
        <span className="text-muted">{icon}</span>
        <h2 className="text-[15px] font-semibold text-primary tracking-tight">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow-plain mb-1.5 flex items-center gap-1.5">
        <span className="text-muted">{icon}</span>
        {label}
      </p>
      <p className="text-[13px] text-primary">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="text-primary font-medium text-right">{value}</span>
    </div>
  );
}
