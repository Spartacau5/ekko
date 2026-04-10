import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl({ options, value, onChange, size = 'md' }: SegmentedControlProps) {
  const padding = size === 'sm' ? 'px-3 py-1' : 'px-3 py-1.5';
  const text = size === 'sm' ? 'text-[13px]' : 'text-sm';

  return (
    <div className="inline-flex items-center bg-surface-muted border border-border-subtle rounded-sm p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`${padding} ${text} font-medium rounded-sm transition-colors cursor-pointer
            ${value === opt.value
              ? 'bg-surface text-primary shadow-sm border border-border-subtle'
              : 'text-secondary hover:text-primary'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
