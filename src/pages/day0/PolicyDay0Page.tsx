// Phase 4.5 — Day 0 Policy.
// On Day 0 there are no tracked policies yet — the page is a setup workspace
// for choosing tracked topics. Lead with an EducationalEmptyState, then drop
// the TrackedTopicsSetupCard. Show a small set of value previews so users
// understand what tracked policies will become.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import {
  PageHeader,
  TrackedTopicsSetupCard,
  ValuePreviewCard,
  EducationalEmptyState,
  useToast,
} from '../../components/ui';
import { previewsForSurface } from '../../data/maturity';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PolicyDay0Page() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const policyPreviews = previewsForSurface('policy');

  function handleSubmit(topicIds: string[]) {
    setSubmitted(true);
    toast.show({
      type: 'success',
      title: `Tracking ${topicIds.length} topic${topicIds.length === 1 ? '' : 's'}`,
      description: 'Ekko will start surfacing policy signals matching your selection.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <PageHeader
        title="Policy"
        subtitle="Pick what to track and Ekko will start delivering signals"
        serif
      />

      <div className="space-y-6 mt-6">
        <EducationalEmptyState
          eyebrow="Day 0 — Policy"
          title="Tell Ekko which policy topics matter to you."
          description="Once you pick topics, jurisdictions, and bills to track, Ekko will start delivering hearings, amendments, votes, and stakeholder movements as they happen — to the right teammate, in the right surface."
          bullets={[
            'Real-time alerts on bills moving through your tracked topics',
            'Stakeholder alignment maps showing supporters, opposition, and undecideds',
            'Recommended advocacy actions tied to each policy moment',
            'Shareable watchlists so the team is on the same page',
          ]}
          primary={{ label: 'Pick topics below', onClick: () => {} }}
          secondary={{ label: 'Skip for now', to: '/dashboard' }}
          icon={<Bell size={15} />}
        />

        <TrackedTopicsSetupCard onSubmit={submitted ? undefined : handleSubmit} />

        {submitted && (
          <div className="bg-success-soft border border-success/30 rounded-md p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-surface border border-success/30 flex items-center justify-center flex-shrink-0">
              <Bell size={13} className="text-success" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-primary">Tracking started</p>
              <p className="text-[12px] text-secondary mt-0.5">
                Ekko is indexing your selected topics. Switch to <span className="font-mono">Day X</span> in
                the maturity switcher above to see what your watchlist will look like once policy signals
                start landing.
              </p>
            </div>
          </div>
        )}

        {/* Value previews */}
        <section>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">What you'll unlock</p>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
            Once tracking is on
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {policyPreviews.map((p) => (
              <ValuePreviewCard
                key={p.id}
                title={p.title}
                description={p.description}
                unlockedBy={p.unlockedBy}
                exampleStat={p.exampleStat}
              />
            ))}
            <ValuePreviewCard
              title="Jurisdiction routing"
              description="Federal, state, city, and regional bills filtered to the geographies you operate in."
              unlockedBy="Pick tracked policy topics"
            />
            <ValuePreviewCard
              title="Compliance windows"
              description="Effective-date countdowns and audit checklists for the policies that touch your operations."
              unlockedBy="Pick tracked policy topics"
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
}
