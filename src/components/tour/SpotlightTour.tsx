import React, { useState } from 'react';
import { Button } from '../ui';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  target: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Your dashboard',
    description: 'This is your home base. Recent signals, priority people, policy radar, and peer benchmarks live here. Everything is tailored to your organization and goals.',
    target: 'dashboard-welcome',
  },
  {
    title: 'Understand your people',
    description: 'See who needs attention, what to do next, and why. Donor profiles include rich timelines, persona insights, risk levels, and AI-suggested next steps.',
    target: 'dashboard-people',
  },
  {
    title: 'Track policy that matters',
    description: 'Monitor city, state, federal, and regional policies that affect your mission. See impact, urgency, stakeholder alignment, and recommended actions in one view.',
    target: 'dashboard-policy',
  },
  {
    title: 'Compare with peers',
    description: 'Benchmark your performance against similar organizations and unlock shared intelligence about campaigns, messaging themes, and what\'s working in your sector.',
    target: 'dashboard-peers',
  },
];

interface SpotlightTourProps {
  onClose: () => void;
}

export function SpotlightTour({ onClose }: SpotlightTourProps) {
  const [step, setStep] = useState(0);
  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-overlay pointer-events-auto" onClick={onClose} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-surface border border-border-default rounded-md w-[460px] shadow-2xl">
          <div className="flex items-start justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-muted uppercase tracking-wider">
                Tour &middot; {step + 1} of {tourSteps.length}
              </span>
            </div>
            <button onClick={onClose} className="text-muted hover:text-primary p-1 -mr-1">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 pb-6">
            <h2 className="text-[22px] leading-[30px] font-semibold font-serif text-primary mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-secondary leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle">
            <div className="flex items-center gap-1.5">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-6 bg-accent' : 'w-1.5 bg-border-subtle'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  <ArrowLeft size={14} className="mr-1" /> Back
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Skip
              </Button>
              <Button size="sm" onClick={() => (isLast ? onClose() : setStep(step + 1))}>
                {isLast ? 'Get started' : 'Next'}
                {!isLast && <ArrowRight size={14} className="ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
