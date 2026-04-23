import React from 'react';
import { EkkoWordmark, GoogleMark, AppleMark } from './BrandMarks';
import { AuthField, PasswordField, AuthButton, SocialButton } from './AuthField';
import { OrDivider } from './SignUpStep';

// Sign in mirror of SignUpStep — same shell, different copy, adds a
// "Forgot password" affordance and drops the password-strength constraints.

interface SignInStepProps {
  email: string;
  password: string;
  onChange: (next: { email: string; password: string }) => void;
  onSubmit: () => void;
  onSwitchToSignUp: () => void;
}

export function SignInStep({ email, password, onChange, onSubmit, onSwitchToSignUp }: SignInStepProps) {
  // Testing phase: accept any input so the demo flow isn't gated on filling
  // real credentials. Re-tighten before real auth lands.
  const canSubmit = true;

  return (
    <>
      <div className="flex flex-col gap-8 items-start w-full">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="text-brand">
            <EkkoWordmark size={40} />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-[32px] leading-[38px] font-semibold text-primary tracking-tight">
              Welcome to Ekko
            </h1>
            <p className="mt-1 text-[14px] leading-[18px] text-muted">
              Intelligence for organizations that serve the public good.
            </p>
          </div>
        </div>

        <form
          className="w-full flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSubmit();
          }}
        >
          <AuthField
            label="Work Email Address"
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => onChange({ email: e.target.value, password })}
            placeholder="Enter email address"
          />
          <PasswordField
            label="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => onChange({ email, password: e.target.value })}
            placeholder="Enter password"
            labelRight={
              <button
                type="button"
                className="text-[12px] leading-[14px] text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
              >
                Forgot password
              </button>
            }
          />
          <button type="submit" className="sr-only" aria-hidden="true" tabIndex={-1} />
        </form>
      </div>

      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex flex-col gap-3 items-center w-full">
          <AuthButton disabled={!canSubmit} onClick={onSubmit}>
            Sign In
          </AuthButton>
          <p className="flex gap-1.5 items-center justify-center text-[14px] leading-[18px]">
            <span className="text-muted">Don't have an account?</span>
            <button
              onClick={onSwitchToSignUp}
              className="text-secondary font-medium hover:text-primary transition-colors duration-150 cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
        <OrDivider />
        <div className="flex gap-2 items-start">
          <SocialButton aria-label="Continue with Google">
            <GoogleMark size={20} />
          </SocialButton>
          <SocialButton aria-label="Continue with Apple">
            <AppleMark size={20} />
          </SocialButton>
        </div>
      </div>
    </>
  );
}
