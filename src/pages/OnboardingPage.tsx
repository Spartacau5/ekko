import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRole } from '../lib/RoleContext';
import { motionDurations, motionEasings } from '../lib/motion';
import { AuthShell } from '../components/onboarding/AuthShell';
import { SignUpStep } from '../components/onboarding/SignUpStep';
import { SignInStep } from '../components/onboarding/SignInStep';
import { StepShell } from '../components/onboarding/StepShell';
import {
  ProfileStep,
  ProfileState,
  ProfileErrors,
  validateProfile,
  mapOnboardingRoleToAppRole,
} from '../components/onboarding/ProfileStep';
import { OrganizationStep, OrgState } from '../components/onboarding/OrganizationStep';
import { AddOrgModal, OrgManualDetails } from '../components/onboarding/AddOrgModal';
import {
  GoalsStep,
  GoalsState,
  validateGoalOther,
  isGoalsStepComplete,
} from '../components/onboarding/GoalsStep';
import { ToolsStep, ToolsState, ToolId, emptyToolsState } from '../components/onboarding/ToolsStep';
import { DocUploadModal } from '../components/onboarding/DocUploadModal';
import { RequestConnectionModal } from '../components/onboarding/RequestConnectionModal';
import { TeamStep, TeamMember, emptyMember } from '../components/onboarding/TeamStep';

type Screen = 'sign-up' | 'sign-in' | 1 | 2 | 3 | 4 | 5;

export function OnboardingPage() {
  const navigate = useNavigate();
  const { setActiveRole } = useRole();

  const [screen, setScreen] = useState<Screen>('sign-up');
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auth state
  const [auth, setAuth] = useState({ email: '', password: '' });

  // Profile (step 1)
  const [profile, setProfile] = useState<ProfileState>({ firstName: '', lastName: '', roleId: '' });
  const [profileShowErrors, setProfileShowErrors] = useState(false);
  const profileErrors: ProfileErrors = useMemo(() => validateProfile(profile), [profile]);

  // Organization (step 2)
  const [org, setOrg] = useState<OrgState>({ query: '', selectedId: null, manualEntryId: null });
  const [orgManualDetails, setOrgManualDetails] = useState<OrgManualDetails | null>(null);
  const [addOrgOpen, setAddOrgOpen] = useState(false);
  const step2Complete = org.selectedId !== null || org.manualEntryId !== null;

  // Goals (step 3)
  const [goals, setGoals] = useState<GoalsState>({ selected: [], otherText: '' });
  const [goalsShowErrors, setGoalsShowErrors] = useState(false);
  const goalsOtherError = goals.selected.includes('Other') ? validateGoalOther(goals.otherText) : undefined;
  const step3Complete = isGoalsStepComplete(goals);

  // Tools (step 4) — all optional; user can skip. Two modal surfaces.
  const [tools, setTools] = useState<ToolsState>(emptyToolsState);
  const [docUploadOpen, setDocUploadOpen] = useState(false);
  const [requestConnOpen, setRequestConnOpen] = useState(false);

  const toggleTool = (id: ToolId) => {
    setTools((prev) => ({
      ...prev,
      connected: { ...prev.connected, [id]: !prev.connected[id] },
    }));
  };

  // Team (step 5) — optional; starts with one empty row the user can fill.
  const [team, setTeam] = useState<TeamMember[]>(() => [emptyMember()]);

  const advanceTo = (next: Screen) => {
    const order: Screen[] = ['sign-up', 'sign-in', 1, 2, 3, 4, 5];
    const isForward = order.indexOf(next) > order.indexOf(screen);
    setDirection(isForward ? 1 : -1);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleContinueFromStep = (current: number) => {
    if (current === 1) {
      if (Object.keys(profileErrors).length > 0) {
        setProfileShowErrors(true);
        return;
      }
    }
    if (current === 3) {
      if (!step3Complete) {
        setGoalsShowErrors(true);
        return;
      }
    }
    if (current < 5) {
      advanceTo((current + 1) as Screen);
    } else {
      // Finish — set role and head to the role-specific dashboard
      setActiveRole(mapOnboardingRoleToAppRole(profile.roleId));
      navigate('/dashboard?tour=true');
    }
  };

  const handleBackFromStep = (current: number) => {
    if (current === 1) advanceTo('sign-up');
    else advanceTo((current - 1) as Screen);
  };

  const renderAuth = () => {
    if (screen === 'sign-up') {
      return (
        <AuthShell>
          <SignUpStep
            email={auth.email}
            password={auth.password}
            onChange={setAuth}
            onSubmit={() => advanceTo(1)}
            onSwitchToSignIn={() => advanceTo('sign-in')}
          />
        </AuthShell>
      );
    }
    return (
      <AuthShell>
        <SignInStep
          email={auth.email}
          password={auth.password}
          onChange={setAuth}
          onSubmit={() => navigate('/dashboard')}
          onSwitchToSignUp={() => advanceTo('sign-up')}
        />
      </AuthShell>
    );
  };

  const renderStep = () => {
    const step = screen as number;
    switch (step) {
      case 1:
        return (
          <StepShell
            currentStep={1}
            title="Complete your profile"
            subtitle="Tell us about yourself so we can personalize your experience."
            onBack={() => handleBackFromStep(1)}
            onContinue={() => handleContinueFromStep(1)}
            continueDisabled={Object.keys(profileErrors).length > 0}
            transitionDirection={direction}
            stepKey={1}
          >
            <ProfileStep
              profile={profile}
              onChange={(next) => {
                setProfile(next);
                if (profileShowErrors) setProfileShowErrors(false);
              }}
              errors={profileErrors}
              showErrors={profileShowErrors}
            />
          </StepShell>
        );
      case 2:
        return (
          <>
            <StepShell
              currentStep={2}
              title="Find your organization"
              subtitle="Search by name or EIN. We'll prefill what we can."
              onBack={() => handleBackFromStep(2)}
              onContinue={() => handleContinueFromStep(2)}
              continueDisabled={!step2Complete}
              transitionDirection={direction}
              stepKey={2}
            >
              <OrganizationStep
                state={org}
                onChange={setOrg}
                onOpenManualModal={() => setAddOrgOpen(true)}
                manualOrg={orgManualDetails ? {
                  name: orgManualDetails.name,
                  headquarters: orgManualDetails.headquarters,
                  type: orgManualDetails.type,
                  ein: orgManualDetails.ein,
                } : undefined}
              />
            </StepShell>
            <AddOrgModal
              open={addOrgOpen}
              onClose={() => setAddOrgOpen(false)}
              onSubmit={(details) => {
                setOrgManualDetails(details);
                setOrg({ query: '', selectedId: null, manualEntryId: 'manual' });
                setAddOrgOpen(false);
              }}
            />
          </>
        );
      case 3:
        return (
          <StepShell
            currentStep={3}
            title="What are your goals?"
            subtitle="Select the priorities that matter most. We'll tailor your dashboard to match."
            onBack={() => handleBackFromStep(3)}
            onContinue={() => handleContinueFromStep(3)}
            continueDisabled={!step3Complete}
            transitionDirection={direction}
            stepKey={3}
          >
            <GoalsStep
              state={goals}
              onChange={(next) => {
                setGoals(next);
                if (goalsShowErrors) setGoalsShowErrors(false);
              }}
              otherError={goalsShowErrors ? goalsOtherError : undefined}
            />
          </StepShell>
        );
      case 4:
        return (
          <>
            <StepShell
              currentStep={4}
              title="Connect your tools"
              subtitle="Integrations help Ekko deliver richer insights. You can skip this and connect later."
              onBack={() => handleBackFromStep(4)}
              onContinue={() => handleContinueFromStep(4)}
              transitionDirection={direction}
              stepKey={4}
            >
              <ToolsStep
                state={tools}
                onToggle={toggleTool}
                onOpenDocUpload={() => setDocUploadOpen(true)}
                onOpenRequestConnection={() => setRequestConnOpen(true)}
              />
            </StepShell>
            <DocUploadModal
              open={docUploadOpen}
              onClose={() => setDocUploadOpen(false)}
              onDone={() => {
                setTools((prev) => ({ ...prev, docsManaged: true }));
                setDocUploadOpen(false);
              }}
            />
            <RequestConnectionModal
              open={requestConnOpen}
              onClose={() => setRequestConnOpen(false)}
            />
          </>
        );
      case 5:
        return (
          <StepShell
            currentStep={5}
            title="Invite your team"
            subtitle="Add team members who will use Ekko. You can manage roles later in Settings."
            onBack={() => handleBackFromStep(5)}
            onContinue={() => handleContinueFromStep(5)}
            continueLabel="Finish"
            transitionDirection={direction}
            stepKey={5}
          >
            <TeamStep members={team} onChange={setTeam} />
          </StepShell>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={String(screen)}
        custom={direction}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
      >
        {typeof screen === 'number' ? renderStep() : renderAuth()}
      </motion.div>
    </AnimatePresence>
  );
}

