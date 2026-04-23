// Day 0 Organizations list.
// Matches the Day X shell: title + subtitle, then a single setup panel
// that asks the user to opt in to benchmarking or find peers.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { peerOrgsForMaturity } from '../../data/maturity';
import { useMaturity } from '../../lib/MaturityContext';
import { useToast } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PeersDay0Page() {
  const { activeMaturity } = useMaturity();
  const toast = useToast();
  const [optedIn, setOptedIn] = useState(false);
  const samplePeers = peerOrgsForMaturity(activeMaturity);

  function handleOptIn() {
    setOptedIn(true);
    toast.show({
      type: 'success',
      title: 'Opted in to benchmarking',
      description: 'Ekko will start surfacing anonymized comparisons against similar orgs.',
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <div className="mb-6">
        <h1 className="page-title">Organizations</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Compare your performance against similar organizations to see where you stand.
        </p>
      </div>

      <section className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
              Find your peers
            </h2>
            <p className="text-[13px] text-secondary mt-1 leading-relaxed max-w-2xl">
              Opt in to benchmarking and Ekko will auto-match you with nonprofits in your mission area,
              region, and revenue band — then aggregate their anonymized performance data so you can see
              where you stand.
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 mb-5">
          <Bullet text="Only aggregated, anonymized metrics are shared — never individual records" />
          <Bullet text="Compare across retention, conversion, channel mix, and campaign performance" />
          <Bullet text="See which campaigns are outperforming sector averages for orgs like yours" />
          <Bullet text="Opt out any time from Settings → Benchmarking" />
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOptIn}
            disabled={optedIn}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium bg-brand text-white border border-brand rounded-sm hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShieldCheck size={13} /> {optedIn ? 'Opted in' : 'Opt in to benchmarking'}
          </button>
          <button
            type="button"
            onClick={() =>
              toast.show({ type: 'info', title: 'Peer finder', description: 'Manual peer search would open here.' })
            }
            className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium bg-surface border border-border-subtle rounded-sm hover:border-border-default transition-colors"
          >
            <Search size={13} /> Find peers manually
          </button>
        </div>
      </section>

      <section className="bg-surface border border-border-subtle rounded-md">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-primary">Sample peer organizations</p>
            <span className="inline-flex items-center px-1.5 h-[20px] text-[11px] font-medium border border-info/35 bg-info-soft text-info rounded-sm">
              Preview
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[12px] text-muted">
            <Sparkles size={12} /> Based on your mission profile
          </span>
        </div>
        <div className="divide-y divide-border-subtle">
          {samplePeers.map((peer) => (
            <Link
              key={peer.id}
              to={`/peers/${peer.id}`}
              className="flex items-center gap-3 px-5 py-4 hover:bg-surface-muted/30 no-underline"
            >
              <div className="w-9 h-9 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
                <Building size={14} className="text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-primary truncate">{peer.name}</p>
                <p className="text-[12px] text-muted truncate">{peer.geography} · {peer.orgSize.split(' (')[0]}</p>
              </div>
              <ArrowRight size={14} className="text-muted flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[13px] text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
      <span className="leading-snug">{text}</span>
    </li>
  );
}
