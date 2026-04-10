import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { organization } from '../data/organization';
import { dashboardAlerts } from '../data/alerts';
import { donors } from '../data/donors';
import { policies } from '../data/policies';
import { benchmarkData } from '../data/peers';
import { kpiMetrics, priorityTasks, recentActivity, fundraisingTrend } from '../data/dashboardMetrics';
import { ProgressBar, Chip, KPI, BarChart } from '../components/ui';
import { SpotlightTour } from '../components/tour/SpotlightTour';
import {
  AlertCircle, AlertTriangle, Info, CheckCircle, ArrowUpRight, Sparkles,
  MapPin, Building2, Gift, Mail, Users as UsersIcon, FileText,
  Megaphone, TrendingUp,
} from 'lucide-react';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (searchParams.get('tour') === 'true') {
      setShowTour(true);
      searchParams.delete('tour');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const priorityDonors = donors.filter(d => d.risk === 'High' || d.stage === 'Growing').slice(0, 4);
  const criticalPolicies = policies.filter(p => p.impactLevel === 'High risk' || p.impactLevel === 'High opportunity').slice(0, 3);

  return (
    <>
      {showTour && <SpotlightTour onClose={() => setShowTour(false)} />}

      {/* Welcome heading */}
      <div className="mb-8" id="dashboard-welcome">
        <p className="text-[13px] font-medium text-muted uppercase tracking-wider mb-1">
          Friday, April 10
        </p>
        <h1 className="text-[36px] leading-[44px] font-semibold font-serif text-primary">
          Good morning, Sofia
        </h1>
        <p className="text-base text-secondary mt-1">
          Here's what needs your attention at {organization.name}.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiMetrics.map(m => (
          <KPI
            key={m.id}
            label={m.label}
            value={m.value}
            delta={m.delta}
            deltaLabel={m.deltaLabel}
            trend={m.trend}
          />
        ))}
      </div>

      {/* Priority tasks (mission control) */}
      <div className="bg-surface border border-border-subtle rounded-md mb-6">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-primary" />
            <h2 className="text-[15px] font-semibold text-primary">Priority tasks</h2>
            <span className="text-[12px] text-muted">{priorityTasks.length}</span>
          </div>
          <button className="text-[13px] text-secondary hover:text-primary underline">View all</button>
        </div>
        <div className="divide-y divide-border-subtle">
          {priorityTasks.slice(0, 4).map(task => <TaskRow key={task.id} task={task} />)}
        </div>
      </div>

      {/* Top row: Fundraising trend + Setup checklist */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8 bg-surface border border-border-subtle rounded-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-primary">Fundraising trend</h2>
              <p className="text-[13px] text-muted mt-0.5">Last 6 months \u2014 actual vs. target</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-muted uppercase tracking-wider">YTD raised</p>
              <p className="text-[22px] font-semibold text-primary">
                ${(fundraisingTrend.reduce((sum, m) => sum + m.raised, 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <div className="mt-2">
            <BarChart data={fundraisingTrend.map(m => ({ label: m.month, value: m.raised, target: m.target }))} height={180} format={(n) => `$${(n / 1000).toFixed(0)}K`} />
          </div>
        </div>

        <div className="col-span-4 bg-surface border border-border-subtle rounded-md p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-primary">Setup progress</h3>
            <span className="text-[13px] text-muted">{organization.setupCompletion}%</span>
          </div>
          <ProgressBar value={organization.setupCompletion} showPercent={false} />
          <div className="mt-4 flex flex-col gap-2">
            <ChecklistItem done label="Verify organization details" />
            <ChecklistItem done label="Connect Salesforce CRM" />
            <ChecklistItem done label="Set fundraising goals" />
            <ChecklistItem label="Connect calendar" />
            <ChecklistItem label="Invite remaining team" />
          </div>
        </div>
      </div>

      {/* Recent signals */}
      <section className="mb-6">
        <SectionHeading
          title="Recent signals"
          subtitle="What's changed in the last 7 days across your accounts and policy feed"
        />
        <div className="grid grid-cols-2 gap-3">
          {dashboardAlerts.slice(0, 4).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* Three-column row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Priority People */}
        <section className="col-span-4" id="dashboard-people">
          <SectionHeading title="Priority people" link="/people/donors" />
          <div className="bg-surface border border-border-subtle rounded-md divide-y divide-border-subtle">
            {priorityDonors.map((donor) => (
              <Link
                key={donor.id}
                to={`/people/donors/${donor.id}`}
                className="flex items-start justify-between gap-3 p-4 hover:bg-surface-muted/30 transition-colors no-underline"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">{donor.name}</p>
                  <p className="text-[13px] text-secondary truncate">{donor.persona}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Chip
                      variant={donor.risk === 'High' ? 'danger' : donor.risk === 'Medium' ? 'warning' : 'success'}
                      label={`${donor.risk} risk`}
                    />
                    <span className="text-[12px] text-muted">{donor.stage}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-muted mt-0.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Policy radar */}
        <section className="col-span-4" id="dashboard-policy">
          <SectionHeading title="Policy radar" link="/policy" />
          <div className="bg-surface border border-border-subtle rounded-md divide-y divide-border-subtle">
            {criticalPolicies.map((policy) => (
              <Link
                key={policy.id}
                to={`/policy/${policy.id}`}
                className="flex items-start gap-3 p-4 hover:bg-surface-muted/30 transition-colors no-underline"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary line-clamp-2">{policy.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Chip
                      variant={policy.impactLevel.includes('risk') ? 'danger' : 'success'}
                      label={policy.impactLevel}
                    />
                    <span className="text-[12px] text-muted">{policy.jurisdiction}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Peer benchmark */}
        <section className="col-span-4" id="dashboard-peers">
          <SectionHeading title="Peer benchmarks" link="/peers" />
          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <BenchmarkRow
              label="Email open rate"
              yours={benchmarkData.emailOpenRate.yours}
              peer={benchmarkData.emailOpenRate.peerAverage}
              suffix="%"
            />
            <BenchmarkRow
              label="Donation conversion"
              yours={benchmarkData.donationConversion.yours}
              peer={benchmarkData.donationConversion.peerAverage}
              suffix="%"
            />
            <BenchmarkRow
              label="Donor retention"
              yours={benchmarkData.donorRetention.yours}
              peer={benchmarkData.donorRetention.peerAverage}
              suffix="%"
            />
          </div>
        </section>
      </div>

      {/* Recent activity feed */}
      <section className="mb-6">
        <SectionHeading title="Recent activity" subtitle="Cross-feature signals from across your workspace" />
        <div className="bg-surface border border-border-subtle rounded-md">
          <div className="divide-y divide-border-subtle">
            {recentActivity.map(item => <ActivityRow key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* Org summary footer */}
      <div className="bg-surface border border-border-subtle rounded-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-accent-soft border border-border-subtle rounded-sm flex items-center justify-center flex-shrink-0">
              <Building2 size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-muted uppercase tracking-wider">Your organization</p>
              <h2 className="text-[22px] leading-[30px] font-semibold text-primary">{organization.name}</h2>
              <p className="text-sm text-secondary">{organization.missionArea}</p>
            </div>
          </div>
          <Link to="/settings" className="text-[13px] text-secondary hover:text-primary underline">
            Edit
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
          <OrgStat label="Headquarters" value={organization.headquarters} icon={<MapPin size={13} />} />
          <OrgStat label="Focus areas" value={organization.geographicFocus.join(', ')} />
          <OrgStat label="Staff" value={`${organization.staffCount} people`} />
          <OrgStat label="Revenue" value={organization.revenueRange} />
        </div>
      </div>
    </>
  );
}

function SectionHeading({ title, subtitle, link }: { title: string; subtitle?: string; link?: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-[15px] font-semibold text-primary">{title}</h2>
        {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="text-[13px] text-secondary hover:text-primary underline whitespace-nowrap">
          View all
        </Link>
      )}
    </div>
  );
}

function ChecklistItem({ label, done = false }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0
        ${done ? 'bg-accent border-border-default' : 'border-border-subtle bg-surface'}`}>
        {done && <CheckCircle size={11} className="text-primary" strokeWidth={2.5} />}
      </div>
      <span className={`text-[13px] ${done ? 'text-muted line-through' : 'text-primary'}`}>
        {label}
      </span>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const iconMap: any = {
    danger: <AlertCircle size={16} className="text-danger" />,
    warning: <AlertTriangle size={16} className="text-warning" />,
    info: <Info size={16} className="text-info" />,
    success: <CheckCircle size={16} className="text-success" />,
  };
  const dotColor: any = {
    danger: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
    success: 'bg-success',
  };
  return (
    <Link
      to={alert.actionLink || '#'}
      className="flex items-start gap-3 p-4 bg-surface border border-border-subtle rounded-md hover:border-border-default transition-colors no-underline"
    >
      <div className={`w-1 self-stretch rounded-full ${dotColor[alert.type]} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          {iconMap[alert.type]}
          <p className="text-sm font-medium text-primary line-clamp-1">{alert.title}</p>
        </div>
        <p className="text-[13px] text-secondary line-clamp-2 ml-6">{alert.description}</p>
      </div>
    </Link>
  );
}

function BenchmarkRow({ label, yours, peer, suffix }: { label: string; yours: number; peer: number; suffix?: string }) {
  const diff = yours - peer;
  const ahead = diff >= 0;
  return (
    <div className="py-3 first:pt-0 last:pb-0 border-b border-border-subtle last:border-0">
      <div className="flex items-end justify-between mb-1">
        <span className="text-[13px] text-secondary">{label}</span>
        <span className={`text-[12px] font-medium ${ahead ? 'text-success' : 'text-danger'}`}>
          {ahead ? '+' : ''}{diff.toFixed(1)}{suffix} vs. peers
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-semibold text-primary leading-none">{yours}{suffix}</span>
        <span className="text-[13px] text-muted">peer avg {peer}{suffix}</span>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: any }) {
  const priorityColor =
    task.priority === 'urgent' ? 'bg-danger' :
    task.priority === 'high' ? 'bg-warning' :
    'bg-info';
  const sourceLabel: string =
    task.source === 'people' ? 'People' :
    task.source === 'policy' ? 'Policy' :
    task.source === 'peers' ? 'Peers' :
    'System';
  const sourceVariant: 'info' | 'warning' | 'default' =
    task.source === 'people' ? 'info' :
    task.source === 'policy' ? 'warning' :
    'default';
  return (
    <Link to={task.link} className="flex items-start gap-3 p-4 hover:bg-surface-muted/30 no-underline">
      <div className={`w-1.5 h-1.5 rounded-full ${priorityColor} mt-2 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-0.5">
          <p className="text-sm font-medium text-primary">{task.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{task.dueLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Chip label={sourceLabel} variant={sourceVariant} />
          <span className="text-[13px] text-secondary line-clamp-1">{task.context}</span>
        </div>
      </div>
      <ArrowUpRight size={13} className="text-muted mt-1 flex-shrink-0" />
    </Link>
  );
}

function ActivityRow({ item }: { item: any }) {
  const iconMap: any = {
    gift: <Gift size={13} />,
    meeting: <UsersIcon size={13} />,
    email: <Mail size={13} />,
    policy: <FileText size={13} />,
    peer: <Megaphone size={13} />,
    team: <TrendingUp size={13} />,
  };
  const date = new Date(item.timestamp);
  const now = new Date('2026-04-10T10:00:00');
  const diffH = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  const timeAgo = diffH < 1 ? 'just now' : diffH < 24 ? `${diffH}h ago` : `${Math.floor(diffH / 24)}d ago`;

  return (
    <Link to={item.link || '#'} className="flex items-start gap-3 p-4 hover:bg-surface-muted/30 no-underline">
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0
        ${item.type === 'gift' ? 'bg-accent-soft border-accent text-primary' : 'bg-surface-muted border-border-subtle text-secondary'}`}>
        {iconMap[item.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-0.5">
          <p className="text-sm font-medium text-primary">{item.title}</p>
          <span className="text-[12px] text-muted whitespace-nowrap">{timeAgo}</span>
        </div>
        <p className="text-[13px] text-secondary line-clamp-1">{item.description}</p>
        <p className="text-[11px] text-muted mt-0.5">via {item.actor}</p>
      </div>
    </Link>
  );
}

function OrgStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-primary flex items-center gap-1">
        {icon}
        {value}
      </p>
    </div>
  );
}
