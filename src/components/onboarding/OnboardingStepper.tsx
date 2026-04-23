import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface OnboardingStepperProps {
  steps: Step[];
  currentStep: number;
}

export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium border transition-colors
                  ${isCompleted
                    ? 'bg-brand border-brand text-white'
                    : isCurrent
                    ? 'bg-surface border-brand text-brand'
                    : 'bg-surface-muted border-border-subtle text-muted'
                  }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={2.5} /> : index + 1}
              </div>
              <span
                className={`text-[13px] font-medium hidden lg:inline
                  ${isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-muted'}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px min-w-[24px] ${isCompleted ? 'bg-brand' : 'bg-border-subtle'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
