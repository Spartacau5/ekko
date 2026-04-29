import React from 'react';

/**
 * Square brand tile — indigo background with a white "E". Used in tight
 * spaces (favicons, collapsed nav, stepper headers). For wordmark lockups
 * prefer <EkkoWordmark />.
 */
export function EkkoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="bg-brand rounded-md flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span
        className="font-display font-bold text-white leading-none tracking-[-0.02em]"
        style={{ fontSize: size * 0.52 }}
      >
        E
      </span>
    </div>
  );
}

/**
 * Full EKKO wordmark with the final O drawn as an elongated capsule.
 * Colour inherits via `currentColor`, so pass a text color class
 * (e.g. `text-white`, `text-brand`, `text-accent`) on the wrapper.
 * `size` controls the cap height in px; the capsule scales with it.
 */
export function EkkoWordmark({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  // viewBox 320 × 110 → cap height 96, stroke 14 with rounded caps.
  const aspect = 320 / 110;
  const width = size * aspect;
  return (
    <svg
      role="img"
      aria-label="Ekko"
      width={width}
      height={size}
      viewBox="0 0 320 110"
      fill="none"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* E */}
      <path d="M10 7 V103" />
      <path d="M10 7 H62" />
      <path d="M10 55 H56" />
      <path d="M10 103 H62" />
      {/* K */}
      <path d="M88 7 V103" />
      <path d="M88 55 L138 7" />
      <path d="M88 55 L138 103" />
      {/* K */}
      <path d="M162 7 V103" />
      <path d="M162 55 L212 7" />
      <path d="M162 55 L212 103" />
      {/* O — wide horizontal capsule */}
      <rect x="234" y="14" width="80" height="82" rx="41" />
    </svg>
  );
}

export function GoogleMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function AppleMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-primary">
      <path d="M17.54 12.62c-.03-2.94 2.4-4.35 2.51-4.42-1.37-2.01-3.5-2.28-4.26-2.31-1.81-.19-3.54 1.07-4.46 1.07-.93 0-2.35-1.04-3.86-1.01-1.98.03-3.82 1.16-4.84 2.94-2.07 3.59-.53 8.9 1.49 11.81.99 1.42 2.16 3.02 3.68 2.96 1.48-.06 2.04-.96 3.83-.96 1.78 0 2.29.96 3.86.93 1.59-.03 2.6-1.45 3.57-2.88 1.13-1.65 1.59-3.25 1.62-3.33-.04-.02-3.11-1.2-3.14-4.75zM14.54 4.21c.82-.99 1.37-2.37 1.22-3.74-1.17.05-2.6.78-3.44 1.77-.75.87-1.41 2.27-1.24 3.61 1.31.1 2.64-.66 3.46-1.64z"/>
    </svg>
  );
}
