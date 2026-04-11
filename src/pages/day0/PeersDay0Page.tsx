// Phase 4.5 — Day 0 Peers.
// On Day 0, peer benchmarking is opt-in. The page leads with a trust + value
// explanation, a primary opt-in CTA, and a small set of teaser benchmark
// previews so users see what comparisons feel like before committing.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Building, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { peerOrgsForMaturity, previewsForSurface } from '../../data/maturity';
import { useMaturity } from '../../lib/MaturityContext';
import {
  PageHeader,
  EducationalEmptyState,
  BenchmarkPreviewCard,
  ValuePreviewCard,
  Chip,
  useToast,
} from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PeersDay0Page() {
  const { activeMaturity } = useMaturity();
  const toast = useToast();
  const [optedIn, setOptedIn] = useState(false);
  const samplePeers = peerOrgsForMaturity(activeMaturity);
  const peerPreviews = previewsForSurface('peers');

  function handleOptIn() {
    setOptedIn(true);
    toast.show({
      type: 'success',
      title: 'Opted in to benchmarking',
      description: 'Ekko will start comparing your aggregated metrics against similar nonprofits.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <PageHeader
        title="Peers"
        subtitle="Anonymous benchmarks against nonprofits like yours"
        serif
      />

      <div className="space-y-6 mt-6">
        <EducationalEmptyState
          eyebrow="Day 0 — Peers"
          title="See how your work compares to nonprofits like yours."
          description="Ekko's benchmark network shares aggregated, anonymized metrics across hundreds of nonprofits. You opt in once, and you get comparisons on retention, conversion, engagement, channel mix, and campaign performance — without ever exposing your individual donor data."
          bullets={[
            'Only aggregated, anonymized metrics are shared — never individual records',
            'Compare against orgs in the same mission area, geography, and revenue band',
            'See which campaigns and channels are outperforming sector averages',
            'Opt out at any time from Settings → Benchmarking',
          ]}
          primary={optedIn ? undefined : { label: 'Opt in to benchmarking', onClick: handleOptIn }}
          secondary={{ label: 'See what unlocks below', onClick: () => {
            const el = document.getElementById('benchmark-previews');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } }}
          icon={<ShieldCheck size={15} />}
        />

        {optedIn && (
          <div className="bg-success-soft border border-success/30 rounded-md p-4 flex items-start gap-3">
            <ShieldCheck size={15} className="text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-primary">You&apos;re opted in.</p>
              <p className="text-[12px] text-secondary mt-0.5">
                Switch to <span className="font-mono">Day X</span> in the maturity switcher above to see
                what your fully populated peer comparisons look like.
              </p>
            </div>
          </div>
        )}

        {/* Sample peer orgs (small set) */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Sample peers</p>
              <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
                A few orgs in your bucket
              </h2>
              <p className="text-[12px] text-secondary mt-1">
                We&apos;ve loaded {samplePeers.length} sample peer organizations to show you the format.
              </p>
            </div>
            <Chip variant="info" label="Sample" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {samplePeers.map((peer) => (
              <Link
                key={peer.id}
                to={`/peers/${peer.id}`}
                className="block bg-surface border border-border-subtle rounded-md p-5 hover:bg-surface-muted/30 transition-colors duration-150 no-underline"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
                    <Building size={15} className="text-secondary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-primary">{peer.name}</p>
                    <p className="text-[12px] text-muted">{peer.geography} · {peer.orgSize}</p>
                    <p className="text-[12px] text-secondary mt-2 leading-snug">{peer.missionArea}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Benchmark previews */}
        <section id="benchmark-previews">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Sample benchmarks</p>
              <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
                What comparison feels like
              </h2>
              <p className="text-[12px] text-secondary mt-1">
                These are blurred placeholders. Real numbers populate as soon as you opt in.
              </p>
            </div>
            <Lock size={13} className="text-muted" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <BenchmarkPreviewCard
              label="Email open rate"
              yourValue="32"
              peerAverage="29"
              topQuartile="38"
              unit="%"
            />
            <BenchmarkPreviewCard
              label="Donor retention"
              yourValue="58"
              peerAverage="61"
              topQuartile="71"
              unit="%"
            />
            <BenchmarkPreviewCard
              label="Donation conversion"
              yourValue="3.4"
              peerAverage="3.8"
              topQuartile="5.2"
              unit="%"
            />
          </div>
        </section>

        {/* Value previews */}
        <section>
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">What unlocks</p>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
            Once benchmarking is on
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {peerPreviews.map((p) => (
              <ValuePreviewCard
                key={p.id}
                title={p.title}
                description={p.description}
                unlockedBy={p.unlockedBy}
                exampleStat={p.exampleStat}
              />
            ))}
            <ValuePreviewCard
              title="Channel mix intelligence"
              description="See which combinations of email, direct mail, social, and events are working for peers."
              unlockedBy="Opt in to benchmarking"
              icon={<Sparkles size={13} />}
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
}
