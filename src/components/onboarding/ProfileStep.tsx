import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { AuthField } from './AuthField';
import { motionDurations, motionEasings } from '../../lib/motion';

export type OnboardingRoleId =
  | 'executive-director'
  | 'fundraising-coordinator'
  | 'communications-specialist'
  | 'program-manager'
  | 'operator'
  | 'other';

const roleImg = (file: string) => `/images/onboarding/roles/${file}`;

const ROLES: Array<{ id: OnboardingRoleId; label: string; img: string }> = [
  { id: 'executive-director',        label: 'Executive Director',        img: roleImg('executive-director.png') },
  { id: 'fundraising-coordinator',   label: 'Fundraising Coordinator',   img: roleImg('fundraising-coordinator.png') },
  { id: 'communications-specialist', label: 'Communications Specialist', img: roleImg('communications-specialist.png') },
  { id: 'program-manager',           label: 'Program Manager',           img: roleImg('program-manager.png') },
  { id: 'operator',                  label: 'Operator',                  img: roleImg('operator.png') },
  { id: 'other',                     label: 'Other',                     img: roleImg('other.png') },
];

export interface ProfileState {
  firstName: string;
  lastName: string;
  roleId: OnboardingRoleId | '';
}

export interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  roleId?: string;
}

interface ProfileStepProps {
  profile: ProfileState;
  onChange: (next: ProfileState) => void;
  errors: ProfileErrors;
  showErrors: boolean;
}

export function ProfileStep({ profile, onChange, errors, showErrors }: ProfileStepProps) {
  const showFieldError = (k: keyof ProfileErrors) => showErrors && errors[k];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <AuthField
            label="First Name"
            required
            value={profile.firstName}
            onChange={(e) => onChange({ ...profile, firstName: e.target.value })}
            placeholder="Sofia"
            aria-invalid={!!showFieldError('firstName')}
            className={showFieldError('firstName') ? '!border-danger focus-visible:!ring-danger/30' : ''}
          />
          <FieldError show={!!showFieldError('firstName')}>{errors.firstName}</FieldError>
        </div>
        <div className="flex flex-col gap-2">
          <AuthField
            label="Last Name"
            required
            value={profile.lastName}
            onChange={(e) => onChange({ ...profile, lastName: e.target.value })}
            placeholder="Reyes"
            aria-invalid={!!showFieldError('lastName')}
            className={showFieldError('lastName') ? '!border-danger focus-visible:!ring-danger/30' : ''}
          />
          <FieldError show={!!showFieldError('lastName')}>{errors.lastName}</FieldError>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 text-[14px] leading-[18px] font-medium text-primary">
          Your Role <span>*</span>
        </div>
        <div className="grid grid-cols-4 grid-rows-2 gap-2 w-full">
          {ROLES.map((role) => {
            const selected = profile.roleId === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onChange({ ...profile, roleId: role.id })}
                className={`relative flex flex-col gap-3 items-center justify-center px-6 py-3.5 rounded-lg border cursor-pointer
                  transition-[background-color,border-color,box-shadow] duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border-default
                  ${selected
                    ? 'border-accent bg-accent-soft/30 shadow-[inset_0_0_0_1px_rgba(244,190,0,0.5)]'
                    : showErrors && !profile.roleId
                      ? 'border-danger/50 bg-danger-soft/20 hover:border-danger'
                      : 'border-border-subtle hover:border-border-default bg-surface'
                  }`}
                aria-pressed={selected}
              >
                <RolePortrait selected={selected} img={role.img} alt={role.label} />
                <p className="text-[12px] leading-[16px] font-medium text-primary text-center">
                  {role.label}
                </p>
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                    >
                      <Check size={10} strokeWidth={3} className="text-primary" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        <FieldError show={!!showFieldError('roleId')}>{errors.roleId}</FieldError>
      </div>
    </div>
  );
}

function RolePortrait({ selected, img, alt }: { selected: boolean; img: string; alt: string }) {
  return (
    <div
      className={`w-[63px] h-[52px] flex items-center justify-center overflow-hidden transition-[filter,opacity] duration-150 ${
        selected ? 'opacity-100' : 'opacity-80'
      }`}
    >
      <img
        src={img}
        alt={alt}
        className="h-full w-auto object-contain select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
}

function FieldError({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
          className="text-[13px] text-danger flex items-center gap-1.5"
        >
          <AlertCircle size={12} />
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function validateProfile(profile: ProfileState): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!profile.firstName.trim()) errors.firstName = 'Enter your first name';
  if (!profile.lastName.trim()) errors.lastName = 'Enter your last name';
  if (!profile.roleId) errors.roleId = 'Choose the role that fits you best';
  return errors;
}

// Map the onboarding role picker to the app-wide RoleContext role.
export function mapOnboardingRoleToAppRole(roleId: OnboardingRoleId | '') {
  switch (roleId) {
    case 'executive-director':        return 'executive' as const;
    case 'fundraising-coordinator':   return 'fundraising' as const;
    case 'communications-specialist': return 'communications' as const;
    case 'program-manager':           return 'program' as const;
    case 'operator':                  return 'operations' as const;
    case 'other':
    case '':
    default:                          return 'executive' as const;
  }
}
