import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Auth-area form primitives. Deliberately different from the app-wide TextInput
// — rounded-[8px], larger 16px type, and full-width rounded-full CTA match the
// Sign up / Sign in screens' hero treatment.

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  rightSlot?: React.ReactNode;
  labelRight?: React.ReactNode;
}

export function AuthField({
  label,
  required,
  rightSlot,
  labelRight,
  className = '',
  id,
  ...props
}: AuthFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-[14px] font-medium text-primary leading-[18px]">
          {label}
          {required && <span className="ml-1">*</span>}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={inputId}
          className={`w-full px-3 py-[10px] ${rightSlot ? 'pr-10' : 'pr-3'} text-[16px] leading-[20px] bg-surface border border-border-subtle rounded-lg outline-none
            transition-[border-color,box-shadow] duration-150 ease-out
            placeholder:text-muted/80
            focus-visible:border-border-default focus-visible:ring-2 focus-visible:ring-border-default/30
            ${className}`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

interface PasswordFieldProps extends Omit<AuthFieldProps, 'rightSlot' | 'type'> {}

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <AuthField
      {...props}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AuthButton({ className = '', children, disabled, ...props }: AuthButtonProps) {
  return (
    <button
      className={`w-full flex items-center justify-center px-4 py-3 rounded-full text-[18px] leading-[22px] font-medium
        transition-[background-color,color,opacity,transform] duration-150 ease-out
        active:scale-[0.99]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-border-default
        ${disabled
          ? 'bg-surface-muted text-muted border border-border-subtle cursor-not-allowed'
          : 'bg-brand text-white border border-brand hover:bg-brand-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]'}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SocialButton({ className = '', children, ...props }: SocialButtonProps) {
  return (
    <button
      className={`w-[110px] flex items-center justify-center px-[46px] py-3 rounded-lg
        bg-surface border border-border-subtle hover:border-border-default hover:bg-surface-muted/60
        transition-[background-color,border-color] duration-150 ease-out cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-border-default
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
