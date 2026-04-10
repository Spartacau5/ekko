import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function Checkbox({ label, checked, onChange, description }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className={`mt-0.5 w-[18px] h-[18px] rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors
          ${checked ? 'bg-accent border-border-default' : 'bg-surface border-border-subtle group-hover:border-border-default'}`}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check size={13} strokeWidth={2.5} />}
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-primary">{label}</span>
        {description && <span className="text-[13px] text-muted">{description}</span>}
      </div>
    </label>
  );
}
