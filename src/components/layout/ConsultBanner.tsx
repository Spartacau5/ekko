import React from 'react';

interface ConsultBannerProps {
  className?: string;
  onClick?: () => void;
}

// "Turn noise to action" Consult banner — pre-baked PNG asset
// (/images/consultancy.png) wrapped in a button so the whole card opens
// the AI assistant. Sized to its natural aspect ratio and pinned to the
// bottom of the sidebar by the parent layout.
export function ConsultBanner({ className = '', onClick }: ConsultBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Consult"
      className={`group block w-full cursor-pointer text-left ${className}`}
    >
      <img
        src="/images/consultancy.png"
        alt=""
        className="block w-full h-auto rounded-lg transition-opacity duration-150 group-hover:opacity-90"
      />
    </button>
  );
}
