// Phase 4.5 — Day 0 Donor detail.
// Foundational profile only. Header with sample data tag, basic contact info,
// a short three-event timeline, and DataMissingCallouts on each module that
// would normally be powered by integrations.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Calendar, Sparkles } from 'lucide-react';
import { donors } from '../../data/donors';
import { DataMissingCallout, Chip, EmptyState } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function DonorDetailDay0Page() {
  const { id } = useParams<{ id: string }>();
  const donor = donors.find((d) => d.id === id);

  if (!donor) {
    return (
      <EmptyState
        title="Donor not found"
        description="This donor doesn\u2019t exist in the sample dataset."
        action={{ label: 'Back to donors', onClick: () => window.history.back() }}
      />
    );
  }

  // Day 0 keeps only 3 timeline events to feel light.
  const previewTimeline = donor.timeline.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="space-y-6"
    >
      <Link
        to="/people/donors"
        className="inline-flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary no-underline"
      >
        <ArrowLeft size={13} /> Back to donors
      </Link>

      {/* Header */}
      <header className="bg-surface border border-border-subtle rounded-md p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Chip variant="info" label="Sample data" />
              <span className="text-[11px] text-muted">Day 0 — placeholder profile</span>
            </div>
            <h1 className="text-[32px] font-serif font-semibold text-primary leading-tight">{donor.name}</h1>
            <p className="text-[14px] text-secondary mt-1">{donor.donorType} · {donor.persona}</p>
            <div className="flex items-center gap-4 mt-4 text-[12px] text-secondary flex-wrap">
              <span className="inline-flex items-center gap-1.5"><Mail size={12} /> {donor.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone size={12} /> {donor.phone}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> Sample timeline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <div className="space-y-6">
          {/* Mini timeline */}
          <section className="bg-surface border border-border-subtle rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Recent activity</p>
                <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
                  Sample timeline
                </h2>
              </div>
              <Chip variant="default" label={`${previewTimeline.length} events`} />
            </div>
            <ol className="space-y-3 border-l border-border-subtle pl-4 relative">
              {previewTimeline.map((event, i) => (
                <li key={i} className="relative">
                  <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface border border-border-default" />
                  <p className="text-[12px] text-muted">{event.date}</p>
                  <p className="text-[13px] font-medium text-primary mt-0.5">{event.title}</p>
                  {event.description && (
                    <p className="text-[12px] text-secondary mt-0.5 leading-snug">{event.description}</p>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-5 pt-4 border-t border-border-subtle">
              <DataMissingCallout
                title="Full engagement timeline locked"
                body="Connect Salesforce, Google, and Mailchimp to see every gift, meeting, email open, and event interaction here."
                ctaLabel="Connect data sources"
                ctaTo="/settings"
              />
            </div>
          </section>

          {/* Suggested next step (placeholder, not real) */}
          <section className="bg-surface border border-border-subtle rounded-md p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-7 h-7 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Suggested next step</p>
                <h3 className="text-[15px] font-semibold text-primary mt-0.5">Will appear here</h3>
              </div>
            </div>
            <DataMissingCallout
              title="Suggestions arrive once your CRM is connected"
              body="Ekko's recommendation model uses gift cadence, persona, and engagement to suggest the right outreach for each donor."
              ctaLabel="Connect Salesforce"
              ctaTo="/settings"
            />
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <section className="bg-surface border border-border-subtle rounded-md p-5">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Profile</p>
            <dl className="mt-3 space-y-2.5 text-[12px]">
              <Field label="Type" value={donor.donorType} />
              <Field label="Persona" value={donor.persona} />
              <Field label="Account owner" value={donor.accountOwner} />
              <Field label="Stage" value={donor.stage} />
            </dl>
          </section>

          <section className="bg-surface border border-border-subtle rounded-md p-5">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Locked on Day 0</p>
            <ul className="mt-3 space-y-2 text-[12px]">
              <LockedItem text="Lifetime giving total" />
              <LockedItem text="Risk score and persona insight" />
              <LockedItem text="Group memberships" />
              <LockedItem text="Internal team notes" />
              <LockedItem text="Linked policies and peer insights" />
            </ul>
          </section>

          <section>
            <DataMissingCallout
              title="Internal notes locked"
              body="Once teammates are invited and roles are assigned, you can leave shared notes on every donor profile."
              ctaLabel="Invite team"
              ctaTo="/settings"
            />
          </section>
        </aside>
      </div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-primary font-medium text-right">{value}</dd>
    </div>
  );
}

function LockedItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-secondary">
      <span className="w-1 h-1 rounded-full bg-muted mt-1.5 flex-shrink-0" />
      <span className="leading-snug">{text}</span>
    </li>
  );
}
