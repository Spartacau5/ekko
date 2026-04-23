// Phase 4.5 — Day 0 Policy detail.
// Day 0 has no tracked policies, so there are no real detail pages to land on
// from inside the app. Direct URLs still resolve, but render a foundational
// preview: the policy summary, jurisdiction/topic chips, and a strong "start
// tracking" CTA. Full stakeholder maps, alerts, watchlist groups, actions, and
// notes are locked behind setup.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Bell } from 'lucide-react';
import { policies } from '../../data/policies';
import {
  DataMissingCallout,
  Chip,
  EducationalEmptyState,
} from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PolicyDetailDay0Page() {
  const { id } = useParams<{ id: string }>();
  const policy = policies.find((p) => p.id === id);

  if (!policy) {
    return (
      <EducationalEmptyState
        eyebrow="Policy"
        title="No policies tracked yet."
        description="On Day 0, Ekko doesn't track any policies until you pick which topics matter to your organization. Head back to the Policy page to start."
        primary={{ label: 'Pick tracked topics', to: '/policy' }}
        icon={<Bell size={15} />}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="space-y-6"
    >
      <Link
        to="/policy"
        className="inline-flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary no-underline"
      >
        <ArrowLeft size={13} /> Back to Policy
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Chip variant="info" label="Sample policy" />
          <Chip variant="default" label={policy.jurisdiction} />
          <Chip variant="default" label={policy.topic} />
          <span className="text-[11px] text-muted">Preview only — start tracking to receive live updates</span>
        </div>
        <h1 className="text-[28px] font-serif font-semibold text-primary leading-tight">{policy.title}</h1>
        <p className="text-[14px] text-secondary mt-3 leading-relaxed max-w-3xl">{policy.summary}</p>

        <div className="flex items-center gap-4 mt-5 text-[12px] text-secondary flex-wrap">
          <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {policy.jurisdiction}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={12} /> Effective {policy.effectiveDate}</span>
        </div>

        <div className="mt-5 pt-5 border-t border-border-subtle">
          <Link
            to="/policy"
            className="inline-flex items-center gap-1.5 bg-brand text-white border border-brand px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-brand-hover transition-colors duration-150 no-underline"
          >
            <Bell size={12} /> Start tracking this topic
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <div className="space-y-4">
          <DataMissingCallout
            title="Stakeholder alignment locked"
            body="Once tracking is on, Ekko maps which coalitions, councilmembers, and opposition groups are aligned for or against this policy."
            ctaLabel="Start tracking"
            ctaTo="/policy"
          />
          <DataMissingCallout
            title="Live timeline locked"
            body="Hearings, amendments, votes, and media coverage will appear here as they happen, scoped to your tracked topics."
            ctaLabel="Start tracking"
            ctaTo="/policy"
          />
          <DataMissingCallout
            title="Recommended actions locked"
            body="Ekko suggests testimonies, donor outreach, and coalition asks tied to each policy moment."
            ctaLabel="Start tracking"
            ctaTo="/policy"
          />
        </div>

        <aside className="space-y-4">
          <DataMissingCallout
            title="Watchlists locked"
            body="Group related policies into shared, named watchlists so the team is on the same page."
            ctaLabel="Invite team"
            ctaTo="/settings"
          />
          <DataMissingCallout
            title="Internal notes locked"
            body="Once teammates are invited, you can leave shared notes on every policy."
            ctaLabel="Invite team"
            ctaTo="/settings"
          />
        </aside>
      </div>
    </motion.div>
  );
}
