import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { VerticalStepper, ONBOARDING_STEPS } from './VerticalStepper';
import { motionDurations, motionEasings } from '../../lib/motion';

// Shared layout for Onboarding-1 through -5. Left: white rounded card with
// title, form content, and a Back / Continue footer. Right: the vertical
// stepper showing overall progress.

interface StepShellProps {
  currentStep: number; // 1..5
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  continueVariant?: 'primary' | 'danger';
  transitionDirection: 1 | -1;
  stepKey: string | number;
}

export function StepShell({
  currentStep,
  title,
  subtitle,
  children,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Continue',
  continueVariant = 'primary',
  transitionDirection,
  stepKey,
}: StepShellProps) {
  return (
    <div className="min-h-screen bg-page flex gap-14 items-start p-8">
      <div className="flex-1 min-h-[calc(100vh-64px)] min-w-[700px] bg-surface rounded-[32px] shadow-[0_0_64px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(17,17,17,0.04)] flex items-start p-16">
        <div className="flex-1 flex flex-col min-h-[calc(100vh-192px)] w-full">
          <div className="flex flex-col gap-2 items-start w-full">
            <h1 className="font-serif text-[22px] leading-[26px] font-semibold text-primary tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] leading-[18px] text-muted">{subtitle}</p>
            )}
          </div>

          <AnimatePresence mode="wait" custom={transitionDirection}>
            <motion.div
              key={stepKey}
              custom={transitionDirection}
              initial={{ opacity: 0, x: transitionDirection * 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: transitionDirection * -8 }}
              transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
              className="flex-1 w-full flex flex-col pt-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between w-full pt-8">
            <StepNavButton onClick={onBack} variant="secondary" icon={<ArrowLeft size={14} />}>
              Back
            </StepNavButton>
            <StepNavButton
              onClick={onContinue}
              variant={continueVariant}
              disabled={continueDisabled}
            >
              {continueLabel}
            </StepNavButton>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: motionDurations.modal, ease: motionEasings.out, delay: 0.05 }}
        className="flex-1 pt-14 flex justify-center"
      >
        <VerticalStepper steps={ONBOARDING_STEPS} currentStep={currentStep} />
      </motion.div>
    </div>
  );
}

interface StepNavButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: React.ReactNode;
}

function StepNavButton({ children, onClick, variant, disabled, icon }: StepNavButtonProps) {
  const base =
    'w-[120px] flex gap-3 items-center justify-center px-4 py-2 rounded-full text-[16px] leading-[20px] font-medium ' +
    'transition-[background-color,border-color,color,opacity,transform] duration-150 ease-out active:scale-[0.985] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-border-default';
  const variants: Record<string, string> = {
    secondary:
      'bg-surface text-primary border border-border-default hover:bg-surface-muted cursor-pointer',
    primary: disabled
      ? 'bg-surface-muted text-muted border border-border-subtle cursor-not-allowed'
      : 'bg-brand text-white border border-brand hover:bg-brand-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]',
    danger: disabled
      ? 'bg-surface-muted text-muted border border-border-subtle cursor-not-allowed'
      : 'bg-danger-soft text-danger border border-danger/50 hover:bg-danger hover:text-surface cursor-pointer',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}
