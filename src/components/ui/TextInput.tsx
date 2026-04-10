import React from 'react';

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
        className={`w-full px-3 py-2 text-sm bg-surface border rounded-sm outline-none transition-colors
          ${error ? 'border-danger' : 'border-border-subtle focus:border-border-default'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </div>
  );
}
