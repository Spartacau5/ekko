import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

export interface StepDescriptor {
  title: string;
  subtitle: string;
}

interface VerticalStepperProps {
  steps: StepDescriptor[];
  currentStep: number; // 1-based
}

// Right-rail vertical stepper used by Onboarding-1 through -5. Each step shows
// its number inside a circle, with the title + subtitle to the right. Completed
// steps fill the circle; the current step uses a solid border; pending steps
// are muted.

export function VerticalStepper({ steps, currentStep }: VerticalStepperProps) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex flex-col gap-1 items-center">
        {steps.map((_, i) => {
          const stepNum = i + 1;
          const completed = stepNum < currentStep;
          const current = stepNum === currentStep;
          return (
            <React.Fragment key={i}>
              <motion.div
                layout
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[16px] leading-[20px] font-semibold transition-colors duration-200
                  ${completed ? 'bg-brand border-brand text-white' :
                    current ? 'bg-surface border-brand text-brand' :
                    'bg-surface border-border-subtle text-muted'}`}
                aria-current={current ? 'step' : undefined}
              >
                {completed ? (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </motion.span>
                ) : stepNum}
              </motion.div>
              {i < steps.length - 1 && (
                <div className="h-12 w-0.5 flex items-center justify-center">
                  <div className={`w-full h-full rounded-sm transition-colors duration-200 ${
                    completed ? 'bg-brand' : 'bg-border-subtle'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-col w-[287px]">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCurrent = stepNum === currentStep;
          const isPast = stepNum < currentStep;
          return (
            <div
              key={i}
              className={`flex flex-col gap-2 ${i < steps.length - 1 ? 'mb-[46px]' : ''}`}
            >
              <p className={`text-[16px] leading-[20px] font-medium transition-colors duration-200 ${
                isCurrent || isPast ? 'text-primary' : 'text-muted'
              }`}>
                {step.title}
              </p>
              <p className={`text-[12px] leading-[14px] transition-colors duration-200 ${
                isCurrent ? 'text-secondary' : 'text-muted'
              }`}>
                {step.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ONBOARDING_STEPS: StepDescriptor[] = [
  { title: 'Complete your profile', subtitle: 'Tell us about yourself so we can personalize your experience.' },
  { title: 'Find your organization', subtitle: 'Search by name or add details manually.' },
  { title: 'Set your goals', subtitle: 'Pick the outcomes that matter most.' },
  { title: 'Connect your tools', subtitle: 'Integrations make Ekko smarter from day one.' },
  { title: 'Invite your team', subtitle: 'Bring collaborators into your workspace.' },
];
