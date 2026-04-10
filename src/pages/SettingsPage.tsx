import React, { useState } from 'react';
import { organization, teamMembers } from '../data/organization';
import { Button, Chip, PageHeader, Tabs } from '../components/ui';
import { Database, Mail, Send, Calendar, FileText, Plus } from 'lucide-react';

const settingsTabs = [
  { id: 'organization', label: 'Organization' },
  { id: 'team', label: 'Team & roles' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'privacy', label: 'Privacy & consent' },
  { id: 'benchmarking', label: 'Benchmarking' },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('organization');

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your organization, team, and integrations" serif />

      <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'organization' && <OrganizationTab />}
        {activeTab === 'team' && <TeamTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'privacy' && <PrivacyTab />}
        {activeTab === 'benchmarking' && <BenchmarkingTab />}
      </div>
    </>
  );
}

function SettingCard({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md mb-4">
      <div className="px-6 py-4 border-b border-border-subtle flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-primary">{title}</h3>
          {description && <p className="text-[13px] text-muted mt-0.5">{description}</p>}
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
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <div className="col-span-2 text-sm text-primary">{value}</div>
    </div>
  );
}

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
            {organization.goals.map((g) => <span key={g}>&middot; {g}</span>)}
          </div>
        }
      />
    </SettingCard>
  );
}

function TeamTab() {
  return (
    <SettingCard
      title="Team members"
      description="Manage who has access to your Ekko workspace"
      action={<Button size="sm"><Plus size={14} className="mr-1.5" />Invite</Button>}
    >
      <div className="flex flex-col">
        {teamMembers.map((member) => (
          <div key={member.email} className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-soft border border-border-subtle flex items-center justify-center">
                <span className="text-[13px] font-medium text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{member.name}</p>
                <p className="text-[13px] text-muted">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Chip label={member.role} variant="default" />
              <button className="text-[13px] text-secondary hover:text-primary underline">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </SettingCard>
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

function PrivacyTab() {
  const [shareAggregated, setShareAggregated] = useState(true);
  const [shareCampaigns, setShareCampaigns] = useState(true);
  const [shareDonor, setShareDonor] = useState(false);

  return (
    <>
      <SettingCard title="Data sharing" description="Control what your organization contributes to peer benchmarks">
        <div className="flex flex-col gap-4">
          <ToggleRow
            label="Share aggregated benchmark metrics"
            description="Anonymized fundraising performance data used to compute peer averages. No identifying information."
            value={shareAggregated}
            onChange={setShareAggregated}
          />
          <ToggleRow
            label="Share campaign themes and channels"
            description="High-level campaign information to power campaign intelligence cards. No content or copy is shared."
            value={shareCampaigns}
            onChange={setShareCampaigns}
          />
          <ToggleRow
            label="Share individual donor data"
            description="Not recommended. Donor records remain in your workspace by default."
            value={shareDonor}
            onChange={setShareDonor}
          />
        </div>
      </SettingCard>

      <SettingCard title="Data retention" description="How long Ekko keeps your information">
        <FieldRow label="Donor records" value="Retained for the life of your account" />
        <FieldRow label="Activity logs" value="Retained for 24 months" />
        <FieldRow label="Deleted records" value="Permanently purged after 30 days" />
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

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-[13px] text-muted mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-6 rounded-full border transition-colors flex-shrink-0
          ${value ? 'bg-accent border-border-default' : 'bg-surface-muted border-border-subtle'}`}
      >
        <span
          className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-surface border border-border-default transition-all
            ${value ? 'left-[18px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}
