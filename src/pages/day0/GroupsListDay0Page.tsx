// Day 0 Groups list.
// Mirrors the Day X shell: "Groups" title, zeroed stats strip (Total + Lifetime),
// and a setup panel that leans on the Salesforce connection. Sample preview table
// shows what a group card looks like once donors are loaded.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Plus } from 'lucide-react';
import { useMaturity } from '../../lib/MaturityContext';
import { integrationsForMaturity } from '../../data/maturity';
import { donorGroups } from '../../data/groups';
import { ConnectionPromptCard } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function GroupsListDay0Page() {
  const { activeMaturity } = useMaturity();
  const integrations = integrationsForMaturity(activeMaturity);
  const salesforce = integrations.find((i) => i.id === 'salesforce')!;
  const sample = donorGroups.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <div className="mb-6">
        <h1 className="page-title">Groups</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Check and edit all groups in one place.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Day0StatCard label="Total Groups" value="0" />
        <div className="col-span-2">
          <Day0StatCard label="Lifetime Giving" value="$0" />
        </div>
      </div>

      <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 mb-6">
        <ConnectionPromptCard integration={salesforce} />
        <div className="bg-surface border border-border-subtle rounded-md p-5">
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-secondary" />
            <h3 className="text-[15px] font-semibold text-primary">Once Salesforce is connected</h3>
          </div>
          <p className="text-[12px] text-muted mb-3 leading-relaxed">
            Groups let you segment donors by behavior, campaign, event, or persona. You can email a
            group, track lifetime giving per segment, and compare engagement trends over time.
          </p>
          <ul className="space-y-2">
            <UnlockBullet text="Auto-generated segments (lapsed, major, sustainers)" />
            <UnlockBullet text="Manual groups you build from the donor list" />
            <UnlockBullet text="Giving summary charts and engagement scores per group" />
            <UnlockBullet text="Recommended actions tailored to each group" />
          </ul>
        </div>
      </section>

      <section className="bg-surface border border-border-subtle rounded-md">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-primary">Sample groups</p>
            <span className="inline-flex items-center px-1.5 h-[20px] text-[11px] font-medium border border-info/35 bg-info-soft text-info rounded-sm">
              Preview
            </span>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-surface-muted/50 border border-border-subtle rounded-sm text-muted cursor-not-allowed"
          >
            <Plus size={12} /> Add Group
          </button>
        </div>

        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-2.5 border-b border-border-subtle bg-surface-muted/20">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Group</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Donor Count</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Donation</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Engagement</span>
          <span />
        </div>

        {sample.map((g) => {
          const donation =
            g.totalLifetime >= 1_000_000
              ? `$${(g.totalLifetime / 1_000_000).toFixed(2)}M`
              : `$${g.totalLifetime.toLocaleString()}`;
          const engagement = g.engagementScore >= 70 ? 'High' : g.engagementScore >= 50 ? 'Medium' : 'Low';
          return (
            <div
              key={g.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-muted/30 transition-colors"
            >
              <Link
                to={`/people/groups/${g.id}`}
                className="text-[13px] font-medium text-primary no-underline hover:underline underline-offset-2 decoration-border-default truncate"
              >
                {g.name}
              </Link>
              <span className="text-[13px] text-secondary tabular-nums">{g.memberCount}</span>
              <span className="text-[13px] text-secondary tabular-nums">{donation}</span>
              <span className="text-[13px] text-secondary">{engagement}</span>
              <Link to={`/people/groups/${g.id}`} className="text-muted hover:text-primary inline-flex justify-end">
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}

        <div className="px-5 py-3 border-t border-border-subtle bg-surface-muted/30 text-[12px] text-muted">
          Showing {sample.length} sample groups — connect Salesforce to build real segments from your donor list.
        </div>
      </section>
    </motion.div>
  );
}

function Day0StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5 opacity-70">
      <p className="text-[13px] font-medium text-secondary mb-3">{label}</p>
      <p className="metric-display text-primary">{value}</p>
    </div>
  );
}

function UnlockBullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
      <span className="leading-snug">{text}</span>
    </li>
  );
}
