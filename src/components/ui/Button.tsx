// Phase 6: refined Button.
// Tighter radii, clearer hover states, and an added `editorial` variant for
// moments where a serif treatment would feel warranted (used sparingly in
// hero sections). The base shape is unchanged so every existing caller keeps
// working with its current variant / size props.

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'editorial';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center font-medium border cursor-pointer select-none ' +
  'transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out ' +
  'active:scale-[0.985] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface focus-visible:ring-border-default ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

const variants: Record<string, string> = {
  primary:
    'bg-accent text-primary border-border-default hover:bg-accent-hover ' +
    'shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)]',
  secondary:
    'bg-surface text-primary border-border-default hover:bg-surface-muted',
  ghost:
    'bg-transparent text-secondary border-transparent hover:bg-surface-muted hover:text-primary',
  danger:
    'bg-danger-soft text-danger border-danger/60 hover:bg-danger hover:text-surface',
  editorial:
    'bg-surface text-primary border-border-default font-serif italic hover:bg-surface-muted tracking-tight',
};

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-[12.5px] rounded-sm gap-1.5',
  md: 'px-3.5 py-2 text-[13px] rounded-sm gap-2',
  lg: 'px-5 py-2.5 text-[14px] rounded-sm gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
