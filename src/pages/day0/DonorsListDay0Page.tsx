// Phase 4.5 — Day 0 Donors list.
// Light, sample-driven, oriented toward "import your real CRM data". No saved
// views, no bulk actions, no filter modal. The point of the page is to show
// the user what a donor record will look like once they connect Salesforce,
// and to make connecting feel like the obvious next step.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Mail, Phone } from 'lucide-react';
import { useMaturity } from '../../lib/MaturityContext';
import {
  donorsForMaturity,
  integrationsForMaturity,
  previewsForSurface,
} from '../../data/maturity';
import {
  ConnectionPromptCard,
  ValuePreviewCard,
  EducationalEmptyState,
  Chip,
} from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function DonorsListDay0Page() {
  const { activeMaturity } = useMaturity();
  const donors = donorsForMaturity(activeMaturity);
  const integrations = integrationsForMaturity(activeMaturity);
  const peoplePreviews = previewsForSurface('people');
  const salesforce = integrations.find((i) => i.id === 'salesforce')!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="space-y-6"
    >
      <EducationalEmptyState
        eyebrow="Day 0 — People"
        title="Sample donors are loaded so you can see how People works."
        description="Connect Salesforce to replace these placeholders with your real donor records. Once imported, you'll get full giving history, engagement timelines, persona insights, and at-risk detection."
        bullets={[
          'Each donor gets a giving timeline assembled from CRM, email, and meeting data',
          'Risk scoring flags donors who are quietly disengaging before they lapse',
          'Suggested next steps are tailored to each donor\u2019s persona and stage',
        ]}
        primary={{ label: 'Connect Salesforce', to: '/settings' }}
        secondary={{ label: 'See sample donors below', onClick: () => {
          const el = document.getElementById('sample-donors');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } }}
        icon={<Database size={15} />}
      />

      {/* Connection prompt — single, prominent */}
      <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4">
        <ConnectionPromptCard integration={salesforce} />
        <div className="bg-surface border border-border-subtle rounded-md p-5">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider">What unlocks</p>
          <h3 className="text-[15px] font-semibold text-primary mt-1">Once you connect Salesforce</h3>
          <ul className="mt-3 space-y-2">
            <UnlockBullet text="1,200+ donor records imported with gift history" />
            <UnlockBullet text="Risk model runs nightly — flagged donors appear here" />
            <UnlockBullet text="Saved views, bulk actions, and segments become available" />
            <UnlockBullet text="Full filter set (donor type, stage, owner, geography)" />
          </ul>
        </div>
      </section>

      {/* Sample donor list */}
      <section id="sample-donors">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Sample data</p>
            <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
              {donors.length} sample donors
            </h2>
            <p className="text-[12px] text-secondary mt-1">Click any donor to see how a connected profile feels.</p>
          </div>
          <Chip variant="info" label="Sample" />
        </div>

        <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-muted/40 border-b border-border-subtle">
              <tr className="text-left">
                <th className="px-4 py-2.5 font-medium text-muted text-[11px] uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 font-medium text-muted text-[11px] uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 font-medium text-muted text-[11px] uppercase tracking-wider">Persona</th>
                <th className="px-4 py-2.5 font-medium text-muted text-[11px] uppercase tracking-wider">Contact</th>
                <th className="px-4 py-2.5 w-10" aria-label="Open" />
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d.id} className="border-b border-border-subtle last:border-b-0 hover:bg-surface-muted/30 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <Link to={`/people/donors/${d.id}`} className="text-primary font-medium no-underline hover:underline">
                      {d.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-secondary">{d.donorType}</td>
                  <td className="px-4 py-3 text-secondary">{d.persona}</td>
                  <td className="px-4 py-3 text-muted">
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="inline-flex items-center gap-1"><Mail size={11} /> {d.email}</span>
                      <span className="inline-flex items-center gap-1"><Phone size={11} /> {d.phone}</span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <Link to={`/people/donors/${d.id}`} className="text-muted hover:text-primary inline-flex">
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Value previews */}
      <section>
        <p className="text-[11px] font-medium text-muted uppercase tracking-wider">What you'll unlock</p>
        <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight mt-1">
          Once your CRM is connected
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {peoplePreviews.map((p) => (
            <ValuePreviewCard
              key={p.id}
              title={p.title}
              description={p.description}
              unlockedBy={p.unlockedBy}
              exampleStat={p.exampleStat}
            />
          ))}
        </div>
      </section>
    </motion.div>
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
