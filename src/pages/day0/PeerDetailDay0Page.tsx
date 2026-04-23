// Phase 4.5 — Day 0 Peer detail.
// Foundational header (org name, mission area, geography), a single
// blurred sample benchmark, and DataMissingCallouts on every other module.

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, MapPin, ShieldCheck } from 'lucide-react';
import { peerOrgs } from '../../data/peers';
import {
  Chip,
  BenchmarkPreviewCard,
  DataMissingCallout,
  EducationalEmptyState,
} from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PeerDetailDay0Page() {
  const { id } = useParams<{ id: string }>();
  const peer = peerOrgs.find((p) => p.id === id);

  if (!peer) {
    return (
      <EducationalEmptyState
        eyebrow="Peers"
        title="Peer not found"
        description="This peer organization isn't in the sample dataset. Head back to Peers to browse the seeded list."
        primary={{ label: 'Back to Peers', to: '/peers' }}
        icon={<Building size={15} />}
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
        to="/peers"
        className="inline-flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary no-underline"
      >
        <ArrowLeft size={13} /> Back to Peers
      </Link>

      <header className="bg-surface border border-border-subtle rounded-md p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Chip variant="info" label="Sample peer" />
          <Chip variant="default" label={peer.geography} />
          <span className="text-[11px] text-muted">Preview only — opt in to benchmarking for live data</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
            <Building size={20} className="text-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-serif font-semibold text-primary leading-tight">{peer.name}</h1>
            <p className="text-[14px] text-secondary mt-1">{peer.missionArea}</p>
            <div className="flex items-center gap-4 mt-3 text-[12px] text-secondary flex-wrap">
              <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {peer.geography}</span>
              <span className="inline-flex items-center gap-1.5">{peer.orgSize}</span>
              <span className="inline-flex items-center gap-1.5">{peer.revenueBand}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border-subtle">
          <Link
            to="/peers"
            className="inline-flex items-center gap-1.5 bg-brand text-white border border-brand px-4 py-2 text-[13px] font-medium rounded-sm hover:bg-brand-hover transition-colors duration-150 no-underline"
          >
            <ShieldCheck size={12} /> Opt in to benchmarking
          </Link>
        </div>
      </header>

      {/* One sample benchmark */}
      <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <div className="space-y-4">
          <section>
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">Sample benchmark</p>
            <BenchmarkPreviewCard
              label={peer.benchmarkStat.label}
              yourValue="—"
              peerAverage={peer.benchmarkStat.value}
              topQuartile="—"
            />
          </section>

          <DataMissingCallout
            title="Full benchmark dashboard locked"
            body="Once benchmarking is on, you'll see side-by-side comparisons across retention, conversion, channel mix, and engagement vs the peer average and top quartile."
            ctaLabel="Opt in to benchmarking"
            ctaTo="/peers"
          />

          <DataMissingCallout
            title="Campaign intelligence locked"
            body="Browse the messaging, channel mix, and themes from this org's recent campaigns once they're shared into the network."
            ctaLabel="Opt in to benchmarking"
            ctaTo="/peers"
          />
        </div>

        <aside className="space-y-4">
          <DataMissingCallout
            title="Tracking and saved campaigns locked"
            body="Once your team is set up, you can track peers, save their best campaigns, and add notes for the team."
            ctaLabel="Invite team"
            ctaTo="/settings"
          />
          <DataMissingCallout
            title="Recommended actions locked"
            body="Ekko suggests campaigns to test, donors to outreach, and benchmarks to chase based on what's working for peers."
            ctaLabel="Opt in to benchmarking"
            ctaTo="/peers"
          />
        </aside>
      </div>
    </motion.div>
  );
}
