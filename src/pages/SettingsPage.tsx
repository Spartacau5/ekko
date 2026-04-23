import React, { useState } from 'react';
import { useMaturity } from '../lib/MaturityContext';
import { SettingsDay0Page } from './day0/SettingsDay0Page';
import { organization } from '../data/organization';
import { teamMembers, roleMeta, Role } from '../data/team';
import { notificationPrefs } from '../data/workspace';
import { Button, Chip, PageHeader, Tabs, Avatar, PermissionMatrix, ScopeBadge } from '../components/ui';
import { useRole } from '../lib/RoleContext';
import {
  Database, Mail, Send, Calendar, FileText, Plus, Sparkles, Bell,
} from 'lucide-react';

const settingsTabs = [
  { id: 'organization', label: 'Organization' },
  { id: 'team', label: 'Team & roles' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'governance', label: 'Governance & privacy' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'benchmarking', label: 'Benchmarking' },
];

export function SettingsPage() {
  const { activeMaturity } = useMaturity();
  if (activeMaturity === 'day0') return <SettingsDay0Page />;
  return <SettingsDayXPage />;
}

function SettingsDayXPage() {
  const [activeTab, setActiveTab] = useState('organization');

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your organization, team, permissions, and governance"
        serif
      />

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'organization' && <OrganizationTab />}
        {activeTab === 'team' && <TeamAndRolesTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'governance' && <GovernancePrivacyTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'benchmarking' && <BenchmarkingTab />}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared scaffolding
// ─────────────────────────────────────────────────────────────────────────────

function SettingCard({ eyebrow, title, description, children, action }: { eyebrow?: string; title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md mb-4">
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-muted/25 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
          <h3 className="text-[15px] font-semibold text-primary tracking-tight">{title}</h3>
          {description && <p className="text-[12px] text-muted mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-border-subtle last:border-0">
      <span className="eyebrow-plain mt-0.5">{label}</span>
      <div className="col-span-2 text-[13px] text-primary">{value}</div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-[13px] text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={`relative w-10 h-6 rounded-full border transition-colors flex-shrink-0
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default focus-visible:ring-offset-2 focus-visible:ring-offset-page
          ${value ? 'bg-brand border-brand' : 'bg-surface-muted border-border-subtle'}`}
      >
        <span
          className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-surface border border-border-default transition-all
            ${value ? 'left-[18px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

function OrganizationTab() {
  return (
    <SettingCard
      title="Organization details"
      description="Core information about your nonprofit"
      action={<Button variant="secondary" size="sm">Edit</Button>}
    >
      <FieldRow label="Name" value={organization.name} />
      <FieldRow label="Type" value={organization.type} />
      <FieldRow label="Mission area" value={organization.missionArea} />
      <FieldRow label="Headquarters" value={organization.headquarters} />
      <FieldRow label="Geographic focus" value={organization.geographicFocus.join(', ')} />
      <FieldRow label="Staff count" value={`${organization.staffCount} people`} />
      <FieldRow label="Revenue range" value={organization.revenueRange} />
      <FieldRow
        label="Goals"
        value={
          <div className="flex flex-col gap-1">
            {organization.goals.map((g) => <span key={g}>· {g}</span>)}
          </div>
        }
      />
    </SettingCard>
  );
}

function TeamAndRolesTab() {
  const { activeRole } = useRole();
  const meta = roleMeta[activeRole];
  return (
    <>
      <SettingCard
        title="Team members"
        description="Five active members across the primary nonprofit roles"
        action={<Button size="sm"><Plus size={14} className="mr-1.5" />Invite</Button>}
      >
        <div className="flex flex-col">
          {teamMembers.map((member) => {
            const m = roleMeta[member.role];
            return (
              <div key={member.email} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar member={member} size="md" />
                  <div>
                    <p className="text-sm font-medium text-primary">{member.name}</p>
                    <p className="text-[13px] text-muted">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-primary">{member.title}</p>
                    <p className="text-[11px] text-muted">{m.short}</p>
                  </div>
                  <Chip label={m.short} variant="default" />
                  <button className="text-[13px] text-secondary hover:text-primary underline">Manage</button>
                </div>
              </div>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard
        title="Capability matrix"
        description={`What each role can do — column for ${meta.label} is highlighted`}
      >
        <PermissionMatrix highlightedRole={activeRole} editable />
        <p className="text-[12px] text-muted mt-3">
          Use the role switcher in the top nav to compare another role's column without leaving this page.
        </p>
      </SettingCard>

      <SettingCard
        title="Role definitions"
        description="How Ekko frames each role's job-to-be-done"
      >
        <div className="grid grid-cols-2 gap-4">
          {(['executive', 'fundraising', 'policy', 'program', 'operations'] as Role[]).map((r) => (
            <div
              key={r}
              className={`p-4 border rounded-sm
                ${r === activeRole ? 'border-border-default bg-accent-soft/30' : 'border-border-subtle'}`}
            >
              <p className="text-[13px] font-semibold text-primary">{roleMeta[r].label}</p>
              <p className="text-[12px] text-muted mt-0.5">{roleMeta[r].description}</p>
              <p className="text-[12px] text-secondary mt-2">{roleMeta[r].focus}</p>
            </div>
          ))}
        </div>
      </SettingCard>
    </>
  );
}

function IntegrationsTab() {
  const integrations = [
    { id: 'salesforce', name: 'Salesforce CRM', icon: <Database size={20} />, status: 'connected', desc: 'Donor records and giving history sync' },
    { id: 'google', name: 'Google Workspace', icon: <Mail size={20} />, status: 'connected', desc: 'Gmail and contacts sync' },
    { id: 'mailchimp', name: 'Mailchimp', icon: <Send size={20} />, status: 'connected', desc: 'Email engagement metrics' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} />, status: 'disconnected', desc: 'Surface meeting insights automatically' },
    { id: 'docs', name: 'Document uploads', icon: <FileText size={20} />, status: 'disconnected', desc: 'Upload annual reports and grant docs' },
  ];

  return (
    <SettingCard title="Connected tools" description="Connect external systems to enrich your Ekko workspace">
      <div className="flex flex-col gap-3">
        {integrations.map((int) => (
          <div key={int.id} className="flex items-center gap-4 p-4 border border-border-subtle rounded-sm">
            <div className="w-11 h-11 rounded-sm bg-surface-muted flex items-center justify-center flex-shrink-0">
              {int.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-primary">{int.name}</p>
                {int.status === 'connected' && (
                  <Chip label="Connected" variant="success" />
                )}
              </div>
              <p className="text-[13px] text-muted">{int.desc}</p>
            </div>
            <Button variant={int.status === 'connected' ? 'secondary' : 'primary'} size="sm">
              {int.status === 'connected' ? 'Manage' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </SettingCard>
  );
}

function GovernancePrivacyTab() {
  const [shareAggregated, setShareAggregated] = useState(true);
  const [shareCampaigns, setShareCampaigns] = useState(true);
  const [shareDonor, setShareDonor] = useState(false);
  const [allowExports, setAllowExports] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [autoSummaries, setAutoSummaries] = useState(true);
  const [autoSuggestions, setAutoSuggestions] = useState(true);
  const [allowDraftEmails, setAllowDraftEmails] = useState(true);
  const [trainOnTeam, setTrainOnTeam] = useState(false);

  return (
    <>
      <SettingCard
        title="Visibility & sharing"
        description="How notes, watchlists, and saved views are scoped — and what is shared with peers"
      >
        <div className="flex flex-col gap-3 mb-5">
          <VisibilityRow label="Internal notes" scope="team" description="Team-only across donors, policies, and peers." />
          <VisibilityRow label="Saved donor views" scope="team" description="Creator chooses team or private at save time." />
          <VisibilityRow label="Policy watchlists" scope="team" description="3 named watchlists, editable by Policy and Operations." />
          <VisibilityRow label="Tracked peer organizations" scope="team" description="Members can mark a tracked peer as private." />
        </div>

        <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2 pt-3 border-t border-border-subtle">
          Peer benchmark sharing
        </p>
        <div className="flex flex-col gap-1">
          <ToggleRow
            label="Share aggregated benchmark metrics"
            description="Anonymized fundraising performance — no identifying information."
            value={shareAggregated}
            onChange={setShareAggregated}
          />
          <ToggleRow
            label="Share campaign themes and channels"
            description="Powers peer campaign cards. No content or copy is shared."
            value={shareCampaigns}
            onChange={setShareCampaigns}
          />
          <ToggleRow
            label="Share individual donor data"
            description="Strongly discouraged. Donor records remain in your workspace by default."
            value={shareDonor}
            onChange={setShareDonor}
          />
        </div>
      </SettingCard>

      <SettingCard
        title="Exports & approvals"
        description="How data leaves the workspace"
      >
        <div className="flex flex-col gap-1">
          <ToggleRow
            label="Allow CSV exports"
            description="When off, only members with the export capability can download data."
            value={allowExports}
            onChange={setAllowExports}
          />
          <ToggleRow
            label="Require admin approval for new integrations"
            description="Operations & admin must approve any new outbound integration."
            value={requireApproval}
            onChange={setRequireApproval}
          />
        </div>
      </SettingCard>

      <SettingCard
        title="AI features"
        description="Each affordance is opt-in and scoped to this workspace"
      >
        <div className="bg-info-soft border border-info/20 rounded-sm p-3 mb-4 flex items-start gap-2">
          <Sparkles size={14} className="text-info mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-secondary leading-relaxed">
            Donor records never leave your workspace and are never used to train external models. AI inference is scoped per request and stateless across sessions.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <ToggleRow
            label="Auto-summarize donor activity"
            description="Generates a one-paragraph summary on the donor detail page."
            value={autoSummaries}
            onChange={setAutoSummaries}
          />
          <ToggleRow
            label="Suggested next actions"
            description="Surface recommended follow-ups on donor and policy detail pages."
            value={autoSuggestions}
            onChange={setAutoSuggestions}
          />
          <ToggleRow
            label="Allow AI to draft emails for review"
            description="Drafts never send automatically — they always open in the composer for approval."
            value={allowDraftEmails}
            onChange={setAllowDraftEmails}
          />
          <ToggleRow
            label="Use anonymized team activity to improve Ekko"
            description="Off by default. When on, only aggregated, de-identified usage helps tune defaults."
            value={trainOnTeam}
            onChange={setTrainOnTeam}
          />
        </div>
      </SettingCard>

      <SettingCard
        title="Data retention"
        description="How long Ekko keeps your information"
      >
        <FieldRow label="Donor records" value="Retained for the life of your account" />
        <FieldRow label="Activity logs" value="Retained for 24 months" />
        <FieldRow label="Deleted records" value="Permanently purged after 30 days" />
      </SettingCard>
    </>
  );
}

function VisibilityRow({ label, scope, description }: { label: string; scope: 'team' | 'private' | 'shared'; description: string }) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 border border-border-subtle rounded-sm">
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-[12px] text-muted mt-0.5">{description}</p>
      </div>
      <ScopeBadge scope={scope} />
    </div>
  );
}

function NotificationsTab() {
  const { activeRole } = useRole();
  const meta = roleMeta[activeRole];

  // Group prefs by category for the matrix
  const categories = Array.from(new Set(notificationPrefs.map((p) => p.category)));
  const channels: ('In-app' | 'Email' | 'Daily digest')[] = ['In-app', 'Email', 'Daily digest'];

  return (
    <>
      <div className="bg-accent-soft/40 border border-border-subtle rounded-md p-4 mb-4 flex items-start gap-3">
        <Bell size={16} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-primary">Notification defaults shown for {meta.label}</p>
          <p className="text-[13px] text-secondary">
            Each role gets a sensible starting point. Members can override individual rows.
          </p>
        </div>
      </div>

      <SettingCard
        title="Notification preferences"
        description="What lands where for the active role"
      >
        <div className="border border-border-subtle rounded-sm overflow-hidden">
          <div className="grid items-center bg-surface-muted/50 border-b border-border-subtle"
            style={{ gridTemplateColumns: '1.6fr repeat(3, 1fr)' }}>
            <div className="px-4 py-3 text-[12px] font-medium text-muted uppercase tracking-wider">Category</div>
            {channels.map((c) => (
              <div key={c} className="px-2 py-3 text-center text-[12px] font-semibold text-secondary uppercase tracking-wider">{c}</div>
            ))}
          </div>
          {categories.map((cat, i) => (
            <div
              key={cat}
              className={`grid items-center ${i < categories.length - 1 ? 'border-b border-border-subtle' : ''}`}
              style={{ gridTemplateColumns: '1.6fr repeat(3, 1fr)' }}
            >
              <div className="px-4 py-3 text-[13px] text-primary">{cat}</div>
              {channels.map((c) => {
                const pref = notificationPrefs.find((p) => p.category === cat && p.channel === c);
                const enabled = !!pref?.enabledForRoles.includes(activeRole);
                return (
                  <div key={c} className="px-2 py-3 flex justify-center">
                    <span className={`inline-flex w-8 h-5 rounded-full border items-center
                      ${enabled
                        ? 'bg-brand border-brand justify-end pr-0.5'
                        : 'bg-surface-muted border-border-subtle justify-start pl-0.5'}`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-surface border border-border-default" />
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">
          Toggling individual rows is read-only in this prototype. Defaults shown match the active role.
        </p>
      </SettingCard>
    </>
  );
}

function BenchmarkingTab() {
  return (
    <SettingCard
      title="Benchmark cohort"
      description="Choose which peer organizations Ekko uses for comparison"
    >
      <div className="space-y-4">
        <FieldRow label="Cohort type" value="Mission-aligned mid-size nonprofits in NYC metro area" />
        <FieldRow label="Geographic scope" value="New York City, Brooklyn, Queens, Bronx" />
        <FieldRow label="Revenue range" value="$3M–$15M" />
        <FieldRow label="Cohort size" value="8 organizations" />
        <FieldRow
          label="Refresh frequency"
          value={
            <div className="flex items-center gap-2">
              Weekly
              <Chip label="Auto" variant="default" />
            </div>
          }
        />
      </div>
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <Button variant="secondary" size="sm">Customize cohort</Button>
      </div>
    </SettingCard>
  );
}
