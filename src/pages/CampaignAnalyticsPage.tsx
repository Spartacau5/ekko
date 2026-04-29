// Campaign Analytics. Shown after Hannah schedules her advocacy campaign.
// Mirrors the structure of a fundraising-campaign analytics page but adapts
// every panel for an advocacy + cross-platform-content context: projected
// reach instead of donations, channel distribution instead of fund allocation,
// and an action-goals tracker instead of fund disbursement.

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Share2,
  MousePointerClick,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  Pencil,
  Megaphone,
  FileText,
  Users,
} from 'lucide-react';
import { teamMembers } from '../data/team';
import { policies } from '../data/policies';
import { Avatar } from '../components/ui/Avatar';
import { BarChart } from '../components/ui/BarChart';
import { Button } from '../components/ui/Button';

const POSTER_IMAGE = 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=1200&h=720&fit=crop&q=80';
const PROGRESS_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=360&fit=crop&q=80';

export function CampaignAnalyticsPage() {
  const author = teamMembers.find((m) => m.id === 'hannah-win');
  const policy = policies.find((p) => p.id === 'nyc-food-expansion');

  const stages = [
    { label: 'Total Views',  value: '28,400', icon: Eye,                tint: 'bg-brand text-white' },
    { label: 'Total Shares', value: '1,820',  icon: Share2,             tint: 'bg-accent text-white' },
    { label: 'Total Clicks', value: '4,210',  icon: MousePointerClick,  tint: 'bg-deep text-white' },
  ];

  // Projected impressions over the runway: April 30 → June 10 vote.
  const trends = [
    { label: 'Apr 30', value: 4200 },
    { label: 'May 4',  value: 5300 },
    { label: 'May 8',  value: 4900 },
    { label: 'May 12', value: 6100 },
    { label: 'May 16', value: 7400 },
    { label: 'May 24', value: 8100 },
    { label: 'Jun 02', value: 9200 },
    { label: 'Jun 10', value: 11500, target: 10000 },
  ];

  // Channel distribution — replaces "allocation plan".
  const channels = [
    { name: 'Instagram (primary)', reach: '18,500', share: '65%', tone: 'brand' as const, expanded: true,
      detail: 'Hero post + 2 talking-point stories. Cross-posted to Provide Food NYC profile and tagged @nyccouncil.' },
    { name: 'Facebook',            reach: '6,400',  share: '23%', tone: 'muted' as const },
    { name: 'LinkedIn',            reach: '3,500',  share: '12%', tone: 'muted' as const },
  ];

  // Send schedule — when each post fires.
  const schedule = [
    {
      date: 'Apr 30, 7:00 PM',
      title: 'Hero post · Instagram + Facebook',
      detail: 'Caption with policy talking points · Cross-posted to Provide Food NYC',
      channel: 'IG · FB',
      amount: 'Reach 18.5K',
    },
    {
      date: 'May 7, 9:00 AM',
      title: 'Story carousel · Instagram',
      detail: '3-frame story walking through the 85,000 stat and Brownsville map',
      channel: 'IG',
      amount: 'Reach 5.2K',
    },
  ];

  // Recent engagement table — populated with seed data so the demo has activity.
  const donations = [
    { id: '#E-2401', date: 'Apr 30', time: '7:14 PM', donor: 'Maya Patel',     channel: 'Instagram', message: 'Shared with caption: "Brownsville needs this."',  status: 'Engaged' },
    { id: '#E-2398', date: 'Apr 30', time: '7:08 PM', donor: 'Jordan Rivera',  channel: 'Instagram', message: 'Liked + saved',                                    status: 'Engaged' },
    { id: '#E-2395', date: 'Apr 30', time: '7:05 PM', donor: 'Daniel Cho',     channel: 'Facebook',  message: 'Reposted to NYC Food Coalition page',              status: 'Engaged' },
    { id: '#E-2390', date: 'Apr 30', time: '7:01 PM', donor: 'Priya Narang',   channel: 'LinkedIn',  message: 'Reshared with policy commentary',                  status: 'Pending' },
    { id: '#E-2386', date: 'Apr 30', time: '7:00 PM', donor: 'Sarah Chen',     channel: 'Instagram', message: 'Comment: "Will share at the RobinHood team mtg."', status: 'Engaged' },
  ];

  const goalsRows = [
    { label: 'Total reach',          value: '28,400', target: '50,000' },
    { label: 'Sent',                 value: '1' },
    { label: 'Pending',              value: '1' },
    { label: 'Last update',          value: 'Apr 30, 2026 · 7:14 PM' },
  ];

  const actionGoals = [
    { label: 'Testimony submissions', value: '128',   target: '500' },
    { label: 'Public-hearing RSVPs',  value: '42',    target: '200' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-primary mb-2 no-underline"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p className="eyebrow mb-1.5">Campaign analytics</p>
          <h1 className="page-title">Voices for Food Access</h1>
          <p className="text-[13px] text-muted mt-1.5">
            <Link to="/dashboard" className="hover:text-primary no-underline">Dashboard</Link>
            <span className="mx-1.5 text-border-subtle">/</span>
            <span>Campaigns</span>
            <span className="mx-1.5 text-border-subtle">/</span>
            <span className="text-primary">Voices for Food Access</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/campaigns/new?policy=nyc-food-expansion"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm border border-border-subtle text-[13px] font-medium text-primary hover:bg-surface-muted/60 hover:border-border-default/60 transition-colors no-underline"
          >
            <Pencil size={13} /> Edit campaign
          </Link>
          <Button variant="primary" size="md">View live preview</Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
        {/* LEFT — campaign content */}
        <div className="space-y-6">
          {/* Hero card */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="relative h-[280px] overflow-hidden">
              <img src={POSTER_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/65" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-white/95 backdrop-blur-sm">
                <Megaphone size={11} className="text-accent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Advocacy
                </span>
              </div>
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-soft text-success text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> Active · scheduled
              </div>
              <div className="absolute left-5 right-5 bottom-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent mb-1.5">
                  {policy?.title}
                </p>
                <p className="font-display text-[26px] leading-[1.1] tracking-tight">
                  Voices for Food Access: NYC Expansion Act
                </p>
              </div>
            </div>

            {/* Progress + stat tiles */}
            <div className="px-6 pt-5 pb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Setup progress
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-semibold tabular-nums text-primary">100%</span>
                  <span className="text-[12px] text-muted">complete</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden mb-5">
                <div className="h-full bg-brand" style={{ width: '100%' }} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatTile value="2" label="Posts queued" />
                <StatTile value="3" label="Cross-posts" />
                <StatTile value="41" label="Days to vote" />
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-5 pt-5 border-t border-border-subtle">
                <span className="text-[12px] text-muted">Tags</span>
                {['#FoodJusticeNYC', '#NYCFoodExpansionAct', '#ProvideFoodNYC', '#FoodAccess', '#CommunityAction'].map((t) => (
                  <span key={t} className="inline-flex items-center px-2 h-[22px] rounded-sm bg-brand-soft/60 text-brand text-[11px] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Story + Progress Updates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Story */}
            <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-6">
              <h2 className="card-title mb-3">Story</h2>
              <div className="text-[13px] leading-relaxed text-secondary space-y-3">
                <p>
                  The NYC Food Expansion Act is heading to a City Council vote on June 10. If it passes,
                  85,000 more New Yorkers in Brooklyn, Queens, and the Bronx gain access to emergency
                  food assistance — communities Provide Food NYC already serves through its Brownsville
                  and East New York kitchen partnerships.
                </p>
                <p>
                  This campaign turns the policy into a community-facing message across Instagram,
                  Facebook, and LinkedIn — with talking points pulled directly from the bill and a
                  call-to-action funneling supporters to written testimony and the public hearing.
                </p>
              </div>
              <div className="mt-4 rounded-sm overflow-hidden border border-border-subtle">
                <img src={PROGRESS_IMAGE} alt="" className="w-full h-[120px] object-cover" />
              </div>
            </section>

            {/* Progress updates */}
            <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-6">
              <h2 className="card-title mb-3">Progress updates</h2>
              <div className="space-y-3">
                <UpdateRow
                  date="Apr 30, 2026"
                  title="Campaign drafted by Hannah Win"
                  detail="Caption built from the linked policy's three talking points. Reworked with AI for friendly, medium tone."
                />
                <UpdateRow
                  date="Apr 30, 2026"
                  title="Scheduled for Apr 30 · 7:00 PM"
                  detail="Cross-post enabled for Facebook + LinkedIn. Hero post fires first; story carousel queued for May 7."
                  active
                />
                <UpdateRow
                  date="Jun 10, 2026"
                  title="Council floor vote"
                  detail="Public testimony closes 24 hours before. Final post in this series fires the morning of."
                  upcoming
                />
              </div>
            </section>
          </div>

          {/* Recent engagement table */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
              <h2 className="card-title">Recent engagement</h2>
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span>Sort by:</span>
                <button type="button" className="inline-flex items-center gap-1 h-7 px-2.5 rounded-sm border border-border-subtle text-primary text-[12px] hover:border-border-default">
                  Latest <ChevronRight size={11} className="rotate-90" />
                </button>
                <button type="button" className="text-brand hover:underline ml-1">See all</button>
              </div>
            </div>
            <table className="w-full text-[12.5px]">
              <thead className="bg-surface-muted/40 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                <tr>
                  <th className="text-left font-semibold px-6 py-2.5">Engagement ID</th>
                  <th className="text-left font-semibold px-3 py-2.5">Date &amp; time</th>
                  <th className="text-left font-semibold px-3 py-2.5">Supporter</th>
                  <th className="text-left font-semibold px-3 py-2.5">Channel</th>
                  <th className="text-left font-semibold px-3 py-2.5">Message</th>
                  <th className="text-left font-semibold px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium text-brand tabular-nums">{d.id}</td>
                    <td className="px-3 py-3 text-secondary tabular-nums">
                      <div>{d.date}</div>
                      <div className="text-[11px] text-muted">{d.time}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="inline-flex items-center gap-2">
                        <Avatar initials={initialsFor(d.donor)} size="xs" />
                        <span className="text-primary">{d.donor}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-secondary">{d.channel}</td>
                    <td className="px-3 py-3 text-secondary truncate max-w-[200px]">{d.message}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 h-[22px] rounded-full text-[11px] font-medium
                        ${d.status === 'Engaged'
                          ? 'bg-success-soft text-success'
                          : 'bg-warning-soft text-warning'}`}>
                        <CheckCircle2 size={10} /> {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* RIGHT — analytics panels */}
        <div className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          {/* KPI tiles row */}
          <div className="grid grid-cols-3 gap-2">
            {stages.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-surface border border-border-subtle rounded-md p-3 text-center">
                  <div className={`mx-auto mb-2 inline-flex items-center justify-center w-8 h-8 rounded-full ${s.tint}`}>
                    <Icon size={14} strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{s.label}</p>
                  <p className="text-[16px] font-semibold tabular-nums text-primary mt-0.5">{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* Engagement Trends chart */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Engagement trends</h2>
              <span className="inline-flex items-center gap-1 h-6 px-2 rounded-sm border border-border-subtle text-[11px] text-secondary">
                Apr 30 → Jun 10 <ChevronRight size={11} className="rotate-90 text-muted" />
              </span>
            </div>
            <BarChart
              data={trends}
              height={140}
              format={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString())}
            />
            <p className="text-[11.5px] text-muted mt-3 leading-snug">
              Projected daily impressions across the runway to the floor vote. Peak forecast is the
              morning of June 10.
            </p>
          </section>

          {/* Campaign info */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-5">
            <h2 className="card-title mb-4">Campaign info</h2>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Organizer</p>
            <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-border-subtle">
              <Avatar member={author ?? null} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-semibold text-primary">Provide Food NYC</span>
                  <BadgeCheck size={13} className="text-brand" />
                </div>
                <span className="text-[11.5px] text-muted">Hannah Win · Communications Director</span>
              </div>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Linked policy</p>
            <Link
              to={`/policy/${policy?.id}`}
              className="block rounded-sm border border-brand/20 bg-brand/[0.04] p-3 hover:border-brand/40 transition-colors no-underline"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={11} className="text-accent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                  Policy
                </span>
              </div>
              <p className="text-[13px] font-semibold text-primary">{policy?.title}</p>
              <p className="text-[11.5px] text-muted mt-0.5">Floor vote June 10 · {policy?.jurisdiction}</p>
            </Link>
          </section>

          {/* Distribution plan (replaces "Allocation Plan") */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-5">
            <h2 className="card-title mb-2">Distribution plan</h2>
            <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-border-subtle">
              <span className="text-[12px] text-muted">Reach goal</span>
              <span className="text-[18px] font-semibold tabular-nums text-primary">50,000</span>
            </div>
            <div className="space-y-3">
              {channels.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="inline-flex items-center gap-1.5 min-w-0">
                      <ChevronRight size={12} className={c.tone === 'brand' ? 'text-accent rotate-90' : 'text-muted'} />
                      <span className="text-[12.5px] font-medium text-primary truncate">{c.name}</span>
                    </div>
                    <span className="text-[12.5px] font-semibold tabular-nums text-primary shrink-0">{c.reach}</span>
                  </div>
                  {c.expanded && c.detail && (
                    <p className="text-[11.5px] text-muted leading-snug pl-5 mt-1.5">{c.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Send schedule (replaces "Fund Disbursement") */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-5">
            <h2 className="card-title mb-4">Send schedule</h2>
            <div className="space-y-4">
              {schedule.map((s, i) => (
                <div key={i} className={i > 0 ? 'pt-4 border-t border-border-subtle' : ''}>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="text-[12px] text-muted tabular-nums">{s.date}</span>
                    <span className="text-[12px] font-semibold text-brand">{s.amount}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <p className="text-[12.5px] font-semibold text-primary">{s.title}</p>
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-muted">{s.channel}</span>
                  </div>
                  <p className="text-[11.5px] text-muted leading-snug">{s.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Goals tracker (replaces "Fund Usage") */}
          <section className="bg-surface border border-border-subtle rounded-lg shadow-card p-5">
            <h2 className="card-title mb-4">Goals</h2>
            <div className="space-y-2.5 mb-4 pb-4 border-b border-border-subtle">
              {goalsRows.map((g) => (
                <div key={g.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-[12.5px] text-secondary">{g.label}</span>
                  <span className="text-[12.5px] font-semibold tabular-nums text-primary text-right">
                    {g.value}
                    {g.target && <span className="text-muted font-medium"> / {g.target}</span>}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted mb-2">Action goals</p>
            <div className="space-y-3">
              {actionGoals.map((g) => {
                const v = parseInt(g.value.replace(/,/g, ''), 10);
                const t = parseInt(g.target.replace(/,/g, ''), 10);
                const pct = Math.min(100, Math.round((v / t) * 100));
                return (
                  <div key={g.label}>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="inline-flex items-center gap-1.5 text-[12px] text-secondary">
                        {g.label === 'Testimony submissions' ? <FileText size={11} /> : <Users size={11} />}
                        {g.label}
                      </div>
                      <span className="text-[12px] font-semibold tabular-nums text-primary">
                        {g.value} <span className="text-muted font-medium">/ {g.target}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-sm bg-brand-soft/40 border border-brand/15 px-3 py-3 text-center">
      <p className="text-[20px] font-semibold tabular-nums text-primary leading-none">{value}</p>
      <p className="text-[11px] text-muted mt-1.5">{label}</p>
    </div>
  );
}

function UpdateRow({
  date,
  title,
  detail,
  active,
  upcoming,
}: {
  date: string;
  title: string;
  detail: string;
  active?: boolean;
  upcoming?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <span className={`w-2.5 h-2.5 rounded-full ${
          active ? 'bg-accent ring-4 ring-accent-soft'
          : upcoming ? 'bg-surface border-2 border-border-default/40'
          : 'bg-brand'
        }`} />
        <span className="flex-1 w-px bg-border-subtle mt-1" />
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
          <p className="text-[12.5px] font-semibold text-primary">{title}</p>
          {active && (
            <span className="inline-flex items-center px-1.5 h-[18px] rounded-sm bg-accent-soft text-accent text-[9.5px] font-semibold uppercase tracking-[0.08em]">
              Now
            </span>
          )}
          {upcoming && (
            <span className="inline-flex items-center px-1.5 h-[18px] rounded-sm bg-surface-muted/70 text-muted text-[9.5px] font-semibold uppercase tracking-[0.08em]">
              Upcoming
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-muted mb-1 inline-flex items-center gap-1">
          <Calendar size={10} /> {date}
        </p>
        <p className="text-[12px] text-secondary leading-snug">{detail}</p>
      </div>
    </div>
  );
}

function initialsFor(name: string): string {
  if (name === 'Anonym') return 'AN';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}
