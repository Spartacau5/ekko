// Day 0 Campaigns.
// Matches the Day X "Campaigns" shell. Since campaign intel depends on
// benchmarking being on, the setup panel is an opt-in CTA plus a preview
// grid of sample cards.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { peerCampaigns } from '../../data/campaigns';
import { useToast } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function CampaignsDay0Page() {
  const toast = useToast();
  const previewCampaigns = peerCampaigns.filter((c) => c.source === 'Peer organizations').slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <div className="mb-6">
        <h1 className="page-title">Campaigns</h1>
        <p className="text-[14px] text-secondary mt-1.5 max-w-2xl">
          Check what campaigns similar organizations are hosting and your previous campaigns.
        </p>
      </div>

      <section className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
              Unlock campaign intelligence
            </h2>
            <p className="text-[13px] text-secondary mt-1 leading-relaxed max-w-2xl">
              Opt in to benchmarking and Ekko pulls in anonymized campaign performance from peer orgs —
              themes, messaging, channels, and results. Your own campaign history appears here too so you
              can compare what works across the sector with what's worked for you.
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 mb-5">
          <Bullet text="See which messaging themes outperform sector averages" />
          <Bullet text="Borrow channel-mix strategies from top-performing peer campaigns" />
          <Bullet text="Track your own campaign history side-by-side with peers" />
        </ul>

        <button
          type="button"
          onClick={() =>
            toast.show({
              type: 'success',
              title: 'Opted in to benchmarking',
              description: 'Campaign intelligence will populate shortly.',
            })
          }
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium bg-accent text-primary border border-border-default rounded-sm hover:bg-accent-hover transition-colors"
        >
          <ShieldCheck size={13} /> Opt in to benchmarking
        </button>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[13px] font-semibold text-primary">Sample campaigns</p>
          <span className="inline-flex items-center px-1.5 h-[20px] text-[11px] font-medium border border-info/35 bg-info-soft text-info rounded-sm">
            Preview
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {previewCampaigns.map((c) => (
            <Link
              key={c.id}
              to={`/peers/campaigns/${c.id}`}
              className="block bg-surface border border-border-subtle rounded-md p-5 hover:border-border-default transition-colors no-underline"
            >
              <h3 className="text-[15px] font-semibold text-primary leading-snug mb-1">{c.title}</h3>
              <p className="text-[13px] text-secondary mb-3">{c.orgName}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.channels.slice(0, 3).map((ch) => (
                  <span
                    key={ch}
                    className="inline-flex items-center px-2 h-[22px] text-[11px] font-medium leading-none bg-surface-muted text-secondary border border-border-subtle rounded-full"
                  >
                    {ch}
                  </span>
                ))}
              </div>
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
