// Phase 4.5 — Day 0 Settings.
// Setup-oriented. The page reframes Settings as a guided "set up your
// workspace" hub: setup progress at the top, then Organization profile,
// Integrations, Team invites, Goals, and Benchmarking opt-in. Permissions,
// governance, and audit logs are de-emphasized (still present, but folded
// behind a "More controls" link).

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Database, Users as UsersIcon, Target, ShieldCheck, Settings2 } from 'lucide-react';
import { useMaturity } from '../../lib/MaturityContext';
import { organization } from '../../data/organization';
import {
  profileFor,
  setupTasksForMaturity,
  integrationsForMaturity,
  connectedCount,
} from '../../data/maturity';
import {
  PageHeader,
  Tabs,
  SetupProgressCard,
  ConnectionPromptCard,
  Banner,
  TextInput,
  Checkbox,
  Chip,
  EducationalEmptyState,
  Button,
} from '../../components/ui';
import { motionDurations, motionEasings } from '../../lib/motion';

const day0Tabs = [
  { id: 'overview', label: 'Setup overview' },
  { id: 'organization', label: 'Organization' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'team', label: 'Team & invites' },
  { id: 'goals', label: 'Goals' },
  { id: 'benchmarking', label: 'Benchmarking opt-in' },
];

export function SettingsDay0Page() {
  const [activeTab, setActiveTab] = useState('overview');
  const { activeMaturity } = useMaturity();
  const profile = profileFor(activeMaturity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
    >
      <PageHeader
        title="Settings"
        subtitle="Set up your workspace — each step unlocks more of Ekko"
        serif
      />

      <div className="mb-6">
        <Banner
          type="info"
          title={`You\u2019re in Day 0 setup mode (${profile.setupCompletion}% complete)`}
          description="Switch to Day X in the maturity switcher above to preview the full Settings page once your workspace is mature."
        />
      </div>

      <Tabs tabs={day0Tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6 space-y-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'organization' && <OrganizationTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'goals' && <GoalsTab />}
        {activeTab === 'benchmarking' && <BenchmarkingTab />}
      </div>
    </motion.div>
  );
}

function OverviewTab() {
  const { activeMaturity } = useMaturity();
  const profile = profileFor(activeMaturity);
  const tasks = setupTasksForMaturity(activeMaturity);
  return (
    <SetupProgressCard
      percent={profile.setupCompletion}
      tasks={tasks}
      daysInProduct={profile.daysInProduct}
    />
  );
}

function OrganizationTab() {
  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center">
          <Building2 size={15} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">Organization profile</h2>
          <p className="text-[12px] text-secondary mt-1">This is what Ekko uses to tailor signals, peer matches, and policy filtering.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Organization name" value={organization.name} />
        <Field label="Type" value={organization.type} />
        <Field label="Mission area" value={organization.missionArea} />
        <Field label="Headquarters" value={organization.headquarters} />
        <Field label="Geographic focus" value={organization.geographicFocus.join(', ')} />
        <Field label="Staff" value={`${organization.staffCount} people`} />
      </div>

      <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-between">
        <Chip variant="success" label="Confirmed" />
        <Button variant="secondary" size="sm">Edit profile</Button>
      </div>
    </section>
  );
}

function IntegrationsTab() {
  const { activeMaturity } = useMaturity();
  const integrations = integrationsForMaturity(activeMaturity);
  const conn = connectedCount(activeMaturity);

  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center">
            <Database size={15} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
              Connect your data
            </h2>
            <p className="text-[12px] text-secondary mt-1">
              Each integration unlocks a different part of Ekko. Salesforce is the most valuable starting point.
            </p>
          </div>
        </div>
        <Chip variant="default" label={`${conn.connected} of ${conn.total} connected`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {integrations.map((i) => (
          <ConnectionPromptCard key={i.id} integration={i} />
        ))}
      </div>
    </section>
  );
}

function TeamTab() {
  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center">
          <UsersIcon size={15} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
            Invite your team
          </h2>
          <p className="text-[12px] text-secondary mt-1">
            2 of 8 seats used. Each role lands on a different version of the dashboard once invited.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <InviteRow placeholder="teammate@org.com" suggestedRole="Fundraising Lead" />
        <InviteRow placeholder="teammate@org.com" suggestedRole="Policy Lead" />
        <InviteRow placeholder="teammate@org.com" suggestedRole="Operations" />
      </div>

      <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-between">
        <p className="text-[12px] text-muted">Invites are free during setup.</p>
        <Button variant="primary" size="sm">Send invites</Button>
      </div>
    </section>
  );
}

function GoalsTab() {
  const { activeMaturity } = useMaturity();
  const profile = profileFor(activeMaturity);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const options = [
    { id: 'retention', label: 'Increase recurring donor retention', helper: 'Ekko will surface at-risk donors weekly.' },
    { id: 'policy', label: 'Track policy changes that affect our mission', helper: 'Live alerts on hearings, amendments, and votes.' },
    { id: 'peers', label: 'Learn from peer organizations', helper: 'Anonymous benchmarks and campaign intelligence.' },
    { id: 'compliance', label: 'Stay ahead of compliance deadlines', helper: 'Effective-date countdowns and audit checklists.' },
    { id: 'team', label: 'Coordinate the team across surfaces', helper: 'Assigned actions, shared notes, and watchlists.' },
  ];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (profile.goalsDefined) {
    return (
      <EducationalEmptyState
        eyebrow="Goals"
        title="Your goals are already set."
        description="In Day X, your goals are wired to dashboards and weekly summaries. You can update them at any time."
        primary={{ label: 'Switch to Day X to see goals in action', to: '/dashboard' }}
        icon={<Target size={15} />}
      />
    );
  }

  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center">
          <Target size={15} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
            Define 2–3 organizational goals
          </h2>
          <p className="text-[12px] text-secondary mt-1">
            Ekko uses these to tailor recommendations, dashboards, and weekly summaries.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`p-3 rounded-sm border transition-colors duration-150
              ${selected.has(opt.id)
                ? 'border-border-default bg-accent-soft/40'
                : 'border-border-subtle bg-surface hover:bg-surface-muted/40'}`}
          >
            <Checkbox
              checked={selected.has(opt.id)}
              onChange={() => toggle(opt.id)}
              label={opt.label}
              description={opt.helper}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-border-subtle flex items-center justify-between">
        <p className="text-[12px] text-muted">{selected.size} selected · pick 2–3 to start</p>
        <Button variant="primary" size="sm" disabled={selected.size === 0}>Save goals</Button>
      </div>
    </section>
  );
}

function BenchmarkingTab() {
  const [optedIn, setOptedIn] = useState(false);
  return (
    <section className="bg-surface border border-border-subtle rounded-md p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center">
          <ShieldCheck size={15} className="text-secondary" />
        </div>
        <div>
          <h2 className="text-[18px] font-serif font-semibold text-primary leading-tight">
            Peer benchmarking opt-in
          </h2>
          <p className="text-[12px] text-secondary mt-1">
            Aggregated and anonymized only. Individual donor records, contact details, and gift amounts are
            never shared into the network.
          </p>
        </div>
      </div>

      <ul className="space-y-2 mb-5">
        <Bullet text="What's shared: aggregated metrics like retention, conversion, channel mix" />
        <Bullet text="What's not shared: individual donors, gifts, contact details, or notes" />
        <Bullet text="What you get: anonymous comparisons against orgs in your bucket" />
        <Bullet text="You can opt out at any time" />
      </ul>

      <div className="flex items-center justify-between border-t border-border-subtle pt-5">
        {optedIn ? (
          <Chip variant="success" label="Opted in" />
        ) : (
          <Chip variant="default" label="Not opted in" />
        )}
        <Button
          variant={optedIn ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setOptedIn((v) => !v)}
        >
          {optedIn ? 'Opt out' : 'Opt in to benchmarking'}
        </Button>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wider">{label}</p>
      <p className="text-[13px] text-primary mt-0.5">{value}</p>
    </div>
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

function InviteRow({ placeholder, suggestedRole }: { placeholder: string; suggestedRole: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,200px)] gap-2 items-center bg-surface-muted/40 border border-border-subtle rounded-sm p-2">
      <TextInput placeholder={placeholder} />
      <div className="flex items-center gap-2">
        <Settings2 size={11} className="text-muted" />
        <span className="text-[12px] text-secondary truncate">{suggestedRole}</span>
      </div>
    </div>
  );
}
