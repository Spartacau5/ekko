import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { EkkoMark, GoogleMark, AppleMark } from './BrandMarks';
import { AuthField, PasswordField, AuthButton, SocialButton } from './AuthField';

// Sign up form for the onboarding flow. The "Sign in" link swaps the parent
// into sign-in mode; the CTA advances the parent into step 1 once email +
// password meet the minimum constraints.

interface SignUpStepProps {
  email: string;
  password: string;
  onChange: (next: { email: string; password: string }) => void;
  onSubmit: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpStep({ email, password, onChange, onSubmit, onSwitchToSignIn }: SignUpStepProps) {
  const constraints = useMemo(() => {
    const hasLength = password.length >= 8;
    const hasNumberOrSymbol = /[0-9\W_]/.test(password);
    const strength = hasLength && hasNumberOrSymbol ? 'Strong' : hasLength || hasNumberOrSymbol ? 'Medium' : 'Weak';
    return { hasLength, hasNumberOrSymbol, strength };
  }, [password]);

  // Testing phase: accept any input so the demo flow isn't gated on filling
  // real credentials. Re-tighten before real auth lands.
  const canSubmit = true;

  return (
    <>
      <div className="flex flex-col gap-8 items-start w-full">
        <div className="flex flex-col gap-4 items-center w-full">
          <EkkoMark size={40} />
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
          <div className="flex flex-col gap-2">
            <PasswordField
              label="Password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => onChange({ email, password: e.target.value })}
              placeholder="Enter password"
            />
            <ul className="flex flex-col gap-2 mt-1">
              <Constraint met={constraints.hasLength || constraints.hasNumberOrSymbol}>
                Password Strength: {constraints.strength}
              </Constraint>
              <Constraint met={constraints.hasLength}>At least 8 characters</Constraint>
              <Constraint met={constraints.hasNumberOrSymbol}>Contains a number or symbol</Constraint>
            </ul>
          </div>
          <button type="submit" className="sr-only" aria-hidden="true" tabIndex={-1} />
        </form>
      </div>

      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex flex-col gap-3 items-center w-full">
          <AuthButton disabled={!canSubmit} onClick={onSubmit}>
            Create Account
          </AuthButton>
          <p className="flex gap-1.5 items-center justify-center text-[14px] leading-[18px]">
            <span className="text-muted">Already have an account?</span>
            <button
              onClick={onSwitchToSignIn}
              className="text-secondary font-medium hover:text-primary transition-colors duration-150 cursor-pointer"
            >
              Sign in
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

function Constraint({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-2 items-center">
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-150 ${
          met ? 'bg-success-soft text-success' : 'bg-surface-muted text-muted'
        }`}
        aria-hidden="true"
      >
        {met ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={2.5} />}
      </span>
      <span className="text-[12px] leading-[14px] text-muted">{children}</span>
    </li>
  );
}

function OrDivider() {
  return (
    <div className="flex gap-3 items-center justify-center w-full">
      <div className="flex-1 max-w-[120px] h-px bg-border-subtle" />
      <span className="text-[12px] leading-[14px] font-medium text-muted">OR</span>
      <div className="flex-1 max-w-[120px] h-px bg-border-subtle" />
    </div>
  );
}

export { OrDivider };
