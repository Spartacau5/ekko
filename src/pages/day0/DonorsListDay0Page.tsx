// Day 0 Donors list.
// Mirrors the Day X shell: "Donors" title, zeroed stats strip, and a single
// setup panel where the user connects a CRM (Salesforce) to populate the table.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Mail, Phone, Plus } from 'lucide-react';
import { useMaturity } from '../../lib/MaturityContext';
import {
  donorsForMaturity,
  integrationsForMaturity,
} from '../../data/maturity';
import { ConnectionPromptCard } from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

export function DonorsListDay0Page() {
  const { activeMaturity } = useMaturity();
  const sampleDonors = donorsForMaturity(activeMaturity);
  const integrations = integrationsForMaturity(activeMaturity);
  const salesforce = integrations.find((i) => i.id === 'salesforce')!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Day0StatCard label="Total Donors" value="0" />
        <Day0StatCard label="Inactive Donors" value="0" />
        <Day0StatCard label="Lapsed Donors" value="0" />
        <Day0StatCard label="New Donors" value="0" sublabel="Last 7 days" />
      </div>

      <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 mb-6">
        <ConnectionPromptCard integration={salesforce} />
        <div className="bg-surface border border-border-subtle rounded-md p-5">
          <div className="flex items-center gap-2 mb-1">
            <Database size={14} className="text-secondary" />
            <h3 className="text-[15px] font-semibold text-primary">Once Salesforce is connected</h3>
          </div>
          <p className="text-[12px] text-muted mb-3 leading-relaxed">
            Ekko imports your donor records and starts running the risk model overnight. Filters, bulk
            actions, and detailed profiles all light up once data lands.
          </p>
          <ul className="space-y-2">
            <UnlockBullet text="Donor records imported with giving history" />
            <UnlockBullet text="Relationship state (Active / At-risk / Lapsed / Inactive) computed" />
            <UnlockBullet text="Risk model flags donors before they lapse" />
            <UnlockBullet text="Search, filters, and bulk actions unlock automatically" />
          </ul>
        </div>
      </section>

      <section id="sample-donors" className="bg-surface border border-border-subtle rounded-md">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-surface-muted/30">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-primary">Sample donors</p>
            <span className="inline-flex items-center px-1.5 h-[20px] text-[11px] font-medium border border-info/35 bg-info-soft text-info rounded-sm">
              Preview
            </span>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-surface-muted/50 border border-border-subtle rounded-sm text-muted cursor-not-allowed"
          >
            <Plus size={12} /> Add Donor
          </button>
        </div>

        <table className="w-full text-[13px]">
          <thead className="border-b border-border-subtle bg-surface-muted/20">
            <tr className="text-left">
              <th className="px-5 py-2.5 font-semibold text-muted text-[11px] uppercase tracking-wider">Name</th>
              <th className="px-5 py-2.5 font-semibold text-muted text-[11px] uppercase tracking-wider">Type</th>
              <th className="px-5 py-2.5 font-semibold text-muted text-[11px] uppercase tracking-wider">Persona</th>
              <th className="px-5 py-2.5 font-semibold text-muted text-[11px] uppercase tracking-wider">Contact</th>
              <th className="w-10" aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {sampleDonors.map((d) => (
              <tr
                key={d.id}
                className="border-b border-border-subtle last:border-b-0 hover:bg-surface-muted/30 transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    to={`/people/donors/${d.id}`}
                    className="text-primary font-medium no-underline hover:underline underline-offset-2 decoration-border-default"
                  >
                    {d.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-secondary">{d.donorType}</td>
                <td className="px-5 py-3 text-secondary">{d.persona}</td>
                <td className="px-5 py-3 text-muted">
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
        <div className="px-5 py-3 border-t border-border-subtle bg-surface-muted/30 text-[12px] text-muted">
          Showing {sampleDonors.length} sample donors — connect Salesforce to replace with real records.
        </div>
      </section>
    </motion.div>
  );
}

function Day0StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5 opacity-70">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <p className="text-[13px] font-medium text-secondary">{label}</p>
        {sublabel && <span className="text-[11px] text-muted">{sublabel}</span>}
      </div>
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
