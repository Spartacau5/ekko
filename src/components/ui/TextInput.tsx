import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function TextInput({ label, hint, error, className = '', id, ...props }: TextInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-primary">
          {label}
        </label>
      )}
      {hint && <span className="text-[13px] text-muted">{hint}</span>}
      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full px-3 py-2 text-sm bg-surface border rounded-sm outline-none
          transition-[border-color,box-shadow,background-color] duration-150 ease-out
          placeholder:text-muted/80
          focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface
          ${error
            ? 'border-danger focus-visible:ring-danger/40'
            : 'border-border-subtle hover:border-border-default/60 focus-visible:border-border-default focus-visible:ring-border-default/40'}
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[13px] text-danger flex items-center gap-1.5 mt-0.5">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  );
}
