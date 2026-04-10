import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const base = 'inline-flex items-center justify-center font-medium transition-colors duration-150 border cursor-pointer';

const variants: Record<string, string> = {
  primary: 'bg-accent text-primary border-border-default hover:bg-accent-hover',
  secondary: 'bg-surface text-primary border-border-default hover:bg-surface-muted',
  ghost: 'bg-transparent text-secondary border-transparent hover:bg-surface-muted',
  danger: 'bg-danger-soft text-danger border-danger hover:bg-danger',
};

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-[13px] rounded-sm',
  md: 'px-4 py-2 text-sm rounded-sm',
  lg: 'px-6 py-3 text-base rounded-sm',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
