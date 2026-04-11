// Phase 4.5 — Day 0 Dashboard.
// An activation workspace, not mission control. The page leads with a
// state-aware hero, a compact maturity-stats strip, the setup-progress card,
// integration prompts, a small starter insight, and value previews of what
// each surface unlocks. The "Switch to Day X" affordance is intentionally
// prominent so the comparison is one click away.

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Sprout,
  Users as UsersIcon,
  FileText,
  Building2,
  ArrowRight,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import { useRole } from '../../lib/RoleContext';
import { useMaturity } from '../../lib/MaturityContext';
import { roleMeta } from '../../data/team';
import {
  profileFor,
  setupTasksForMaturity,
  integrationsForMaturity,
  previewsForSurface,
  day0Glance,
  donorsForMaturity,
  connectedCount,
} from '../../data/maturity';
import {
  SetupProgressCard,
  ValuePreviewCard,
  ConnectionPromptCard,
  DemoPathCard,
  MaturityComparisonStrip,
} from '../../components/ui';
import { getDemoFlow } from '../../data/demoFlows';
import { motionDurations, motionEasings } from '../../lib/motion';

export function DashboardDay0Page() {
  const { activeRole, activeMember } = useRole();
  const { activeMaturity, setActiveMaturity } = useMaturity();
  const profile = profileFor(activeMaturity);
  const tasks = setupTasksForMaturity(activeMaturity);
  const integrations = integrationsForMaturity(activeMaturity);
  const peopleSeed = donorsForMaturity(activeMaturity);

  const dashPreviews = useMemo(() => previewsForSurface('dashboard'), []);
  const peoplePreviews = useMemo(() => previewsForSurface('people').slice(0, 2), []);
  const policyPreviews = useMemo(() => previewsForSurface('policy').slice(0, 2), []);
  const peersPreviews = useMemo(() => previewsForSurface('peers').slice(0, 2), []);

  const greeting = `Welcome, ${activeMember.name.split(' ')[0]}`;
  const glance = day0Glance[activeRole];
  const conn = connectedCount(activeMaturity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
      className="space-y-8"
    >
      {/* Hero — state-aware welcome */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
        className="bg-surface border border-border-default rounded-md p-7 md:p-9 relative overflow-hidden"
      >
        {/* Soft accent wash on the right edge */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-success-soft/40 to-transparent pointer-events-none" />

        <div className="relative">
          {/* State row — maturity, role, days */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <p className="eyebrow">
              <Sprout size={10} className="text-success mr-0.5" /> Day 0 · Setup mode
            </p>
            <span className="text-border-subtle">·</span>
            <span className="text-[12px] text-secondary">Previewing as <span className="text-primary font-medium">{roleMeta[activeRole].label}</span></span>
            <span className="text-border-subtle">·</span>
            <span className="text-[12px] text-secondary inline-flex items-center gap-1"><Calendar size={11} /> {profile.daysInProduct}</span>
          </div>

          <h1 className="display-title">
            {greeting}.
          </h1>
          <p className="text-[18px] text-secondary mt-3 leading-snug font-serif italic max-w-2xl">
            {glance.headline}.
          </p>
          <p className="text-[14px] text-secondary mt-3 leading-relaxed max-w-2xl">
            {glance.body}
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 bg-accent text-primary border border-border-default px-4 py-2 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors duration-150 no-underline"
            >
              Continue setup <ArrowRight size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setActiveMaturity('dayX')}
              className="inline-flex items-center gap-1.5 bg-surface text-primary border border-border-default px-4 py-2 text-[13px] font-semibold rounded-sm hover:bg-surface-muted transition-colors duration-150"
            >
              <Sparkles size={12} className="text-accent-hover" /> See this dashboard in Day X
            </button>
          </div>
        </div>
      </motion.section>

      {/* Phase 5 polish: shared Day 0 → Day X comparison strip replaces the
          old single-state stats strip. Same metrics, but both maturity states
          are readable at once and a presenter can flip between them in place. */}
      <MaturityComparisonStrip />

      {/* Setup progress + connect grid */}
      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6">
        <SetupProgressCard
          percent={profile.setupCompletion}
          tasks={tasks}
          daysInProduct={profile.daysInProduct}
        />

        <section className="bg-surface border border-border-subtle rounded-md p-6">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="eyebrow mb-2">Connect data</p>
              <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight tracking-tight">
                {conn.connected} of {conn.total} sources connected
              </h2>
              <p className="text-[12px] text-secondary mt-1.5 leading-snug max-w-sm">
                Each source unlocks more of Ekko&apos;s intelligence. Start with Salesforce — it powers the most valuable signals.
              </p>
            </div>
            <Link to="/settings" className="text-[12px] font-medium text-secondary hover:text-primary whitespace-nowrap mt-1 no-underline border-b border-transparent hover:border-primary/40 pb-px">
              Manage all →
            </Link>
          </div>
          <div className="space-y-2.5">
            {integrations.slice(0, 3).map((i) => (
              <ConnectionPromptCard key={i.id} integration={i} compact />
            ))}
          </div>
        </section>
      </div>

      {/* Single starter insight, kept lightweight */}
      <section>
        <SectionHeading
          eyebrow="Starter insight"
          title="A peek at what Ekko already knows"
          description={`Even before connecting your CRM, ${peopleSeed.length} sample donors are loaded so you can see how the workspace feels.`}
        />
        <div className="bg-surface border border-border-subtle rounded-md p-5 mt-3">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-sm bg-accent-soft border border-accent/40 flex items-center justify-center">
              <Lightbulb size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-primary">{peopleSeed.length} sample donors loaded</p>
              <p className="text-[12px] text-secondary mt-0.5">Connect Salesforce to replace these with your real records.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {peopleSeed.map((d) => (
              <Link
                key={d.id}
                to={`/people/donors/${d.id}`}
                className="block bg-surface-muted/40 border border-border-subtle rounded-sm p-3 hover:bg-surface-muted/70 transition-colors duration-150 no-underline group"
              >
                <p className="text-[13px] font-semibold text-primary group-hover:underline">{d.name}</p>
                <p className="text-[11px] text-muted mt-0.5">{d.donorType}</p>
                <p className="text-[11px] text-secondary mt-1.5 italic">Sample data</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What unlocks — three-column tour */}
      <section>
        <SectionHeading
          eyebrow="What you'll unlock"
          title="The full Ekko, once setup is complete"
          description="Three surfaces light up as you connect data and pick what to track."
        />

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <SurfacePreviewColumn
            title="People"
            icon={<UsersIcon size={14} />}
            description="Donors, groups, and accounts with full engagement history."
            link="/people/donors"
            previews={peoplePreviews}
          />
          <SurfacePreviewColumn
            title="Policy"
            icon={<FileText size={14} />}
            description="Live alerts on the bills, jurisdictions, and topics you care about."
            link="/policy"
            previews={policyPreviews}
          />
          <SurfacePreviewColumn
            title="Peers"
            icon={<Building2 size={14} />}
            description="Anonymous benchmarks against nonprofits like yours."
            link="/peers"
            previews={peersPreviews}
          />
        </div>
      </section>

      {/* Per-role preview */}
      <section>
        <SectionHeading
          eyebrow={`For ${roleMeta[activeRole].label}`}
          title="How your dashboard will adapt"
          description={roleMeta[activeRole].focus}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {dashPreviews.map((p) => (
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

      {/* Phase 5: guided walkthroughs anchor for Day 0.
          One full DemoPathCard for the activation flow + a compact link out to
          the four Day X flows so demo viewers can jump straight in. */}
      <section>
        <SectionHeading
          eyebrow="For presenters &amp; reviewers"
          title="Walk through Day 0 step by step"
          description="Run the activation flow as a guided walkthrough — Ekko will navigate you from setup through first value with a step strip at the bottom of the screen."
        />
        <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 mt-4">
          {(() => {
            const activation = getDemoFlow('day0-activation');
            return activation ? <DemoPathCard flow={activation} /> : null;
          })()}
          <div className="bg-surface border border-border-default rounded-md p-5 flex flex-col">
            <p className="eyebrow mb-2">After setup</p>
            <h3 className="text-[15px] font-semibold text-primary leading-tight tracking-tight">Four Day X walkthroughs are waiting</h3>
            <p className="text-[12px] text-secondary mt-1.5 leading-relaxed flex-1">
              Fundraising, Policy, Peer, and Executive walkthroughs all live on the Day X dashboard. They show how the same product becomes load-bearing once data, topics, and people are connected.
            </p>
            <button
              type="button"
              onClick={() => setActiveMaturity('dayX')}
              className="mt-4 inline-flex items-center gap-1.5 bg-accent text-primary border border-border-default px-4 py-2 text-[13px] font-semibold rounded-sm hover:bg-accent-hover transition-colors duration-150 self-start"
            >
              Switch to Day X dashboard <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="text-[22px] font-serif font-semibold text-primary leading-tight tracking-tight">{title}</h2>
      {description && <p className="text-[13px] text-secondary mt-1.5 leading-relaxed">{description}</p>}
    </div>
  );
}

function SurfacePreviewColumn({
  title,
  icon,
  description,
  link,
  previews,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  link: string;
  previews: ReturnType<typeof previewsForSurface>;
}) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="text-[15px] font-semibold text-primary">{title}</h3>
        </div>
        <Link to={link} className="text-[11px] text-muted hover:text-primary no-underline">
          Open →
        </Link>
      </div>
      <p className="text-[12px] text-secondary mt-1 mb-4 leading-snug">{description}</p>
      <div className="space-y-3">
        {previews.map((p) => (
          <ValuePreviewCard
            key={p.id}
            title={p.title}
            description={p.description}
            unlockedBy={p.unlockedBy}
            exampleStat={p.exampleStat}
          />
        ))}
      </div>
    </div>
  );
}
