import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { organization } from '../data/organization';
import { dashboardAlerts } from '../data/alerts';
import { donors } from '../data/donors';
import { policies } from '../data/policies';
import { benchmarkData } from '../data/peers';
import { kpiMetrics, priorityTasks, recentActivity, fundraisingTrend } from '../data/dashboardMetrics';
import { ProgressBar, Chip, BarChart } from '../components/ui';
import { SpotlightTour } from '../components/tour/SpotlightTour';
import {
  AlertCircle, AlertTriangle, Info, CheckCircle, ArrowUpRight, Sparkles,
  MapPin, Building2, Gift, Mail, Users as UsersIcon, FileText,
  Megaphone, TrendingUp, Clock, Bell,
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

  const urgentTasks = priorityTasks.filter(t => t.priority === 'urgent');
  const tasksThisWeek = priorityTasks.filter(t => t.dueLabel.includes('days') || t.dueLabel.includes('week'));

  // KPI → surface link mapping
  const kpiLinks: Record<string, string> = {
    'active-donors': '/people/donors',
    'lifetime-revenue': '/people/accounts',
    'tracked-policies': '/policy',
    'avg-engagement': '/peers',
  };

  return (
    <>
      {showTour && <SpotlightTour onClose={() => setShowTour(false)} />}

      {/* Welcome heading */}
      <div className="mb-6" id="dashboard-welcome">
        <p className="text-[13px] font-medium text-muted uppercase tracking-wider mb-1">
          Friday, April 10
        </p>
        <h1 className="text-[36px] leading-[44px] font-semibold font-serif text-primary">
          Good morning, Sofia
        </h1>
        <p className="text-base text-secondary mt-1">
          {urgentTasks.length > 0
            ? `${urgentTasks.length} urgent ${urgentTasks.length === 1 ? 'task' : 'tasks'} and ${tasksThisWeek.length - urgentTasks.length} more this week.`
            : `Here's what needs your attention at ${organization.name}.`}
        </p>
      </div>

      {/* Hero: Priority tasks + today-at-a-glance */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Priority tasks — hero card */}
        <div className="col-span-8 bg-surface border border-border-default rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-muted/30">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h2 className="text-[15px] font-semibold text-primary">Priority tasks</h2>
              <Chip
                label={`${urgentTasks.length} urgent`}
                variant={urgentTasks.length > 0 ? 'danger' : 'default'}
              />
            </div>
            <button className="text-[13px] text-secondary hover:text-primary underline">
              View all {priorityTasks.length}
            </button>
          </div>
          <div className="divide-y divide-border-subtle">
            {priorityTasks.slice(0, 5).map(task => <TaskRow key={task.id} task={task} />)}
          </div>
        </div>

        {/* Today at a glance */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-primary flex items-center gap-2">
                <Clock size={14} /> Today at a glance
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <GlanceRow
                label="Urgent tasks"
                value={urgentTasks.length.toString()}
                accent={urgentTasks.length > 0 ? 'danger' : undefined}
              />
              <GlanceRow
                label="Policy alerts"
                value="3"
                sublabel="unread"
                accent="warning"
                link="/policy/watchlist"
              />
              <GlanceRow
                label="Upcoming meetings"
                value="2"
                sublabel="this week"
              />
              <GlanceRow
                label="Gifts received"
                value="$12.4K"
                sublabel="last 7 days"
                accent="success"
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-surface border border-border-subtle rounded-md p-5">
            <h3 className="text-[14px] font-semibold text-primary mb-3">Quick links</h3>
            <div className="flex flex-col gap-1.5">
              <QuickLink to="/people/donors" label="Donors" count={donors.length} icon={<UsersIcon size={12} />} />
              <QuickLink to="/policy/watchlist" label="Policy watchlist" count={4} icon={<Bell size={12} />} />
              <QuickLink to="/peers/campaigns" label="Campaign library" count={10} icon={<Megaphone size={12} />} />
              <QuickLink to="/settings" label="Settings" icon={<FileText size={12} />} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip — clickable, linked to surfaces */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpiMetrics.map(m => (
          <Link key={m.id} to={kpiLinks[m.id] || '/'} className="no-underline group">
            <div className="bg-surface border border-border-subtle rounded-md p-5 group-hover:border-border-default transition-colors h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-muted uppercase tracking-wider">{m.label}</p>
                <ArrowUpRight size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-end justify-between gap-3 mb-2">
                <p className="text-[32px] leading-[36px] font-semibold text-primary">{m.value}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {m.delta >= 0 ? (
                  <TrendingUp size={13} className="text-success" />
                ) : (
                  <AlertCircle size={13} className="text-danger" />
                )}
                <span className={`text-[13px] font-medium ${m.delta >= 0 ? 'text-success' : 'text-danger'}`}>
                  {m.delta >= 0 ? '+' : ''}{m.delta.toFixed(1)}%
                </span>
                <span className="text-[13px] text-muted">{m.deltaLabel}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent signals (alerts) */}
      <section className="mb-6">
        <SectionHeading
          title="Recent signals"
          subtitle="What's changed across your accounts, policy feed, and peer network"
        />
        <div className="grid grid-cols-2 gap-3">
          {dashboardAlerts.slice(0, 4).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* Fundraising trend + setup */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8 bg-surface border border-border-subtle rounded-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-primary">Fundraising trend</h2>
              <p className="text-[13px] text-muted mt-0.5">Last 6 months — actual vs. target</p>
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

      {/* Three-column row: People / Policy / Peers */}
      <div className="grid grid-cols-12 gap-6 mb-6">
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

      {/* Recent activity */}
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
  const iconMap: Record<string, React.ReactNode> = {
    danger: <AlertCircle size={16} className="text-danger" />,
    warning: <AlertTriangle size={16} className="text-warning" />,
    info: <Info size={16} className="text-info" />,
    success: <CheckCircle size={16} className="text-success" />,
  };
  const dotColor: Record<string, string> = {
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
  const priorityDot =
    task.priority === 'urgent' ? 'bg-danger border-danger' :
    task.priority === 'high' ? 'bg-warning border-warning' :
    'bg-info border-info';
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
    <Link to={task.link} className="group flex items-start gap-4 px-5 py-4 hover:bg-surface-muted/30 no-underline transition-colors">
      <div className="pt-1.5 flex-shrink-0">
        <div className={`w-2 h-2 rounded-full ${priorityDot}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <p className="text-sm font-semibold text-primary">{task.title}</p>
          <span className={`text-[12px] font-medium whitespace-nowrap ${task.priority === 'urgent' ? 'text-danger' : 'text-muted'}`}>
            {task.dueLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Chip label={sourceLabel} variant={sourceVariant} />
          <span className="text-[13px] text-secondary line-clamp-1">{task.context}</span>
        </div>
      </div>
      <ArrowUpRight size={14} className="text-muted group-hover:text-primary mt-1 flex-shrink-0 transition-colors" />
    </Link>
  );
}

function GlanceRow({ label, value, sublabel, accent, link }: { label: string; value: string; sublabel?: string; accent?: 'danger' | 'warning' | 'success'; link?: string }) {
  const valueClass =
    accent === 'danger' ? 'text-danger' :
    accent === 'warning' ? 'text-warning' :
    accent === 'success' ? 'text-success' :
    'text-primary';
  const content = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[13px] text-secondary">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`text-[18px] font-semibold ${valueClass}`}>{value}</span>
        {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
      </div>
    </div>
  );
  if (link) {
    return (
      <Link to={link} className="no-underline hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }
  return content;
}

function QuickLink({ to, label, count, icon }: { to: string; label: string; count?: number; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 px-2 py-1.5 -mx-2 rounded-sm hover:bg-surface-muted transition-colors no-underline"
    >
      <span className="flex items-center gap-2 text-[13px] text-primary">
        <span className="text-muted">{icon}</span>
        {label}
      </span>
      {count !== undefined && <span className="text-[12px] text-muted">{count}</span>}
    </Link>
  );
}

function ActivityRow({ item }: { item: any }) {
  const iconMap: Record<string, React.ReactNode> = {
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
