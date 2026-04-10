import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, SelectInput, Checkbox } from '../components/ui';
import { OnboardingStepper } from '../components/onboarding/OnboardingStepper';
import { Search, Building2, ArrowRight, ArrowLeft, CheckCircle, Database, Mail, Send, Calendar, FileText } from 'lucide-react';

const steps = [
  { label: 'Welcome' },
  { label: 'Profile' },
  { label: 'Organization' },
  { label: 'Goals' },
  { label: 'Integrations' },
  { label: 'Team' },
];

// Mock org search results
const mockOrgResults = [
  { name: 'Rivergate Community Alliance', location: 'New York, NY', type: 'Mid-size nonprofit', ein: '13-4567890' },
  { name: 'Rivergate Youth Services', location: 'Newark, NJ', type: 'Small nonprofit', ein: '22-1234567' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Step states
  const [profile, setProfile] = useState({ firstName: '', lastName: '', role: '', email: '' });
  const [orgSearch, setOrgSearch] = useState('');
  const [orgSearchSubmitted, setOrgSearchSubmitted] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [manualOrg, setManualOrg] = useState(false);
  const [orgDetails, setOrgDetails] = useState({ name: '', location: '', type: '', mission: '', revenue: '' });
  const [goals, setGoals] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState([
    { name: '', email: '', role: '' },
  ]);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else navigate('/dashboard?tour=true');
  };
  const back = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const goalOptions = [
    'Increase recurring donor retention',
    'Track policy changes',
    'Learn from peer campaigns in similar cities',
    'Improve donor engagement and stewardship',
    'Strengthen corporate and foundation partnerships',
    'Build a data-driven fundraising strategy',
  ];

  const integrationOptions = [
    { id: 'salesforce', name: 'Salesforce CRM', icon: <Database size={20} />, desc: 'Sync donor records and giving history' },
    { id: 'google', name: 'Google Workspace', icon: <Mail size={20} />, desc: 'Connect email and calendar data' },
    { id: 'mailchimp', name: 'Mailchimp', icon: <Send size={20} />, desc: 'Import email engagement metrics' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar size={20} />, desc: 'Surface meeting insights automatically' },
    { id: 'docs', name: 'Document uploads', icon: <FileText size={20} />, desc: 'Upload annual reports, donor lists, or grant docs' },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12">
            <div className="w-14 h-14 bg-accent rounded-md flex items-center justify-center mb-6">
              <span className="text-2xl font-bold font-serif text-primary">E</span>
            </div>
            <h1 className="text-[36px] leading-[44px] font-semibold font-serif text-primary mb-3">
              Welcome to Ekko
            </h1>
            <p className="text-base text-secondary mb-2">
              Intelligence for organizations that serve the public good.
            </p>
            <p className="text-sm text-muted mb-8 max-w-md">
              Ekko brings together your donor relationships, policy landscape, and peer insights
              into one clear, actionable workspace. Let's get your organization set up.
            </p>
            <Button size="lg" onClick={next}>
              Create your account <ArrowRight size={16} className="ml-2" />
            </Button>
            <p className="text-[13px] text-muted mt-6">
              Already have an account? <button className="underline text-primary font-medium">Sign in</button>
            </p>
          </div>
        );

      case 1: // Profile
        return (
          <div className="max-w-md mx-auto py-8">
            <h2 className="text-[22px] leading-[30px] font-semibold text-primary mb-1">Complete your profile</h2>
            <p className="text-sm text-secondary mb-6">Tell us about yourself so we can personalize your experience.</p>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="First name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="Sofia" />
                <TextInput label="Last name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Reyes" />
              </div>
              <TextInput label="Work email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="sofia@rivergate.org" />
              <SelectInput
                label="Your role"
                options={[
                  { value: 'executive', label: 'Executive Director' },
                  { value: 'development', label: 'Development / Fundraising' },
                  { value: 'programs', label: 'Programs' },
                  { value: 'communications', label: 'Communications' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'other', label: 'Other' },
                ]}
                placeholder="Select your role"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
          </div>
        );

      case 2: // Organization
        return (
          <div className="max-w-lg mx-auto py-8">
            <h2 className="text-[22px] leading-[30px] font-semibold text-primary mb-1">Find your organization</h2>
            <p className="text-sm text-secondary mb-6">Search by name or EIN. We'll prefill what we can.</p>

            {!manualOrg ? (
              <>
                <div className="relative mb-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={orgSearch}
                    onChange={(e) => { setOrgSearch(e.target.value); setOrgSearchSubmitted(false); setSelectedOrg(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && orgSearch.length > 1) setOrgSearchSubmitted(true); }}
                    placeholder="Search by organization name or EIN..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface border border-border-subtle rounded-sm outline-none focus:border-border-default"
                  />
                </div>

                {!orgSearchSubmitted && orgSearch.length < 2 && (
                  <div className="text-center py-8">
                    <Building2 size={32} className="mx-auto text-muted mb-3" />
                    <p className="text-sm text-muted">Enter at least 2 characters to search</p>
                  </div>
                )}

                {orgSearch.length >= 2 && !orgSearchSubmitted && (
                  <Button variant="secondary" className="w-full" onClick={() => setOrgSearchSubmitted(true)}>
                    Search
                  </Button>
                )}

                {orgSearchSubmitted && (
                  <div className="space-y-2">
                    {mockOrgResults.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase())).map((org) => (
                      <button
                        key={org.ein}
                        onClick={() => setSelectedOrg(org.ein)}
                        className={`w-full text-left p-4 border rounded-sm transition-colors cursor-pointer
                          ${selectedOrg === org.ein
                            ? 'border-accent bg-accent-soft/30'
                            : 'border-border-subtle hover:border-border-default bg-surface'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary">{org.name}</p>
                            <p className="text-[13px] text-secondary mt-0.5">{org.location} &middot; {org.type}</p>
                          </div>
                          {selectedOrg === org.ein && <CheckCircle size={18} className="text-success flex-shrink-0" />}
                        </div>
                        <p className="text-[12px] text-muted mt-1">EIN: {org.ein}</p>
                      </button>
                    ))}
                    <div className="pt-3 border-t border-border-subtle mt-4">
                      <button
                        onClick={() => setManualOrg(true)}
                        className="text-sm text-secondary hover:text-primary underline cursor-pointer"
                      >
                        Don't see your organization? Enter details manually
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <button onClick={() => setManualOrg(false)} className="text-[13px] text-secondary hover:text-primary underline cursor-pointer">
                    &larr; Back to search
                  </button>
                </div>
                <div className="p-4 bg-info-soft border border-info/20 rounded-sm mb-6">
                  <p className="text-sm text-info">
                    <strong>Organization not found.</strong> No problem — enter your details below and we'll set up your workspace.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <TextInput label="Organization name" value={orgDetails.name} onChange={(e) => setOrgDetails({ ...orgDetails, name: e.target.value })} placeholder="Rivergate Community Alliance" />
                  <TextInput label="Headquarters" value={orgDetails.location} onChange={(e) => setOrgDetails({ ...orgDetails, location: e.target.value })} placeholder="New York, NY" />
                  <SelectInput
                    label="Organization type"
                    options={[
                      { value: 'nonprofit', label: 'Nonprofit' },
                      { value: 'foundation', label: 'Foundation' },
                      { value: 'civic', label: 'Civic organization' },
                      { value: 'government', label: 'Government agency' },
                    ]}
                    placeholder="Select type"
                    value={orgDetails.type}
                    onChange={(e) => setOrgDetails({ ...orgDetails, type: e.target.value })}
                  />
                  <TextInput label="Mission area" value={orgDetails.mission} onChange={(e) => setOrgDetails({ ...orgDetails, mission: e.target.value })} placeholder="Housing stability and community development" />
                  <SelectInput
                    label="Annual revenue range"
                    options={[
                      { value: 'under-1m', label: 'Under $1M' },
                      { value: '1m-5m', label: '$1M–$5M' },
                      { value: '5m-10m', label: '$5M–$10M' },
                      { value: '10m-25m', label: '$10M–$25M' },
                      { value: '25m-plus', label: '$25M+' },
                    ]}
                    placeholder="Select range"
                    value={orgDetails.revenue}
                    onChange={(e) => setOrgDetails({ ...orgDetails, revenue: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 3: // Goals
        return (
          <div className="max-w-lg mx-auto py-8">
            <h2 className="text-[22px] leading-[30px] font-semibold text-primary mb-1">What are your goals?</h2>
            <p className="text-sm text-secondary mb-6">Select the priorities that matter most. We'll tailor your dashboard to match.</p>
            <div className="flex flex-col gap-3">
              {goalOptions.map((goal) => (
                <Checkbox
                  key={goal}
                  label={goal}
                  checked={goals.includes(goal)}
                  onChange={(checked) =>
                    setGoals(checked ? [...goals, goal] : goals.filter((g) => g !== goal))
                  }
                />
              ))}
            </div>
          </div>
        );

      case 4: // Integrations
        return (
          <div className="max-w-lg mx-auto py-8">
            <h2 className="text-[22px] leading-[30px] font-semibold text-primary mb-1">Connect your tools</h2>
            <p className="text-sm text-secondary mb-6">
              Integrations help Ekko deliver richer insights. You can skip this and connect later.
            </p>
            <div className="flex flex-col gap-3">
              {integrationOptions.map((int) => (
                <button
                  key={int.id}
                  onClick={() =>
                    setIntegrations(
                      integrations.includes(int.id)
                        ? integrations.filter((i) => i !== int.id)
                        : [...integrations, int.id]
                    )
                  }
                  className={`flex items-center gap-4 p-4 border rounded-sm transition-colors text-left cursor-pointer
                    ${integrations.includes(int.id)
                      ? 'border-accent bg-accent-soft/30'
                      : 'border-border-subtle hover:border-border-default bg-surface'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0
                    ${integrations.includes(int.id) ? 'bg-accent' : 'bg-surface-muted'}`}>
                    {int.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">{int.name}</p>
                    <p className="text-[13px] text-muted">{int.desc}</p>
                  </div>
                  {integrations.includes(int.id) && <CheckCircle size={18} className="text-success flex-shrink-0" />}
                </button>
              ))}
            </div>
            <button onClick={next} className="text-[13px] text-muted hover:text-secondary underline mt-4 cursor-pointer">
              Skip for now
            </button>
          </div>
        );

      case 5: // Team
        return (
          <div className="max-w-lg mx-auto py-8">
            <h2 className="text-[22px] leading-[30px] font-semibold text-primary mb-1">Invite your team</h2>
            <p className="text-sm text-secondary mb-6">
              Add team members who will use Ekko. You can manage roles later in Settings.
            </p>
            <div className="flex flex-col gap-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="p-4 border border-border-subtle rounded-sm bg-surface">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <TextInput
                      label="Name"
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...teamMembers];
                        updated[idx].name = e.target.value;
                        setTeamMembers(updated);
                      }}
                      placeholder="Full name"
                    />
                    <SelectInput
                      label="Role"
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'member', label: 'Member' },
                        { value: 'viewer', label: 'Viewer' },
                      ]}
                      placeholder="Select role"
                      value={member.role}
                      onChange={(e) => {
                        const updated = [...teamMembers];
                        updated[idx].role = e.target.value;
                        setTeamMembers(updated);
                      }}
                    />
                  </div>
                  <TextInput
                    label="Email"
                    value={member.email}
                    onChange={(e) => {
                      const updated = [...teamMembers];
                      updated[idx].email = e.target.value;
                      setTeamMembers(updated);
                    }}
                    placeholder="name@org.com"
                  />
                </div>
              ))}
              <button
                onClick={() => setTeamMembers([...teamMembers, { name: '', email: '', role: '' }])}
                className="text-sm text-secondary hover:text-primary underline cursor-pointer"
              >
                + Add another team member
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="h-14 bg-surface border-b border-border-subtle flex items-center px-6">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-[15px] font-bold text-primary leading-none">E</span>
          </div>
          <span className="text-[18px] font-semibold font-serif text-primary tracking-tight">Ekko</span>
        </div>
        <div className="flex-1 max-w-2xl">
          <OnboardingStepper steps={steps} currentStep={currentStep} />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-8">
        {renderStep()}
      </div>

      {/* Footer nav */}
      {currentStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle">
          <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-muted">Step {currentStep + 1} of {steps.length}</span>
              <Button onClick={next}>
                {currentStep === steps.length - 1 ? 'Launch your dashboard' : 'Continue'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
