import React from 'react';
import { Mail, FileText, Cloud } from 'lucide-react';
import { GoogleMark } from './BrandMarks';

// Small brand-approximate marks for integration tiles. Each tile is a 42px
// rounded square with the product's accent color in the background and a
// simplified glyph on top. No proprietary artwork — just color + initial /
// category glyph to keep the grid visually distinct.

export function SalesforceTile() {
  return (
    <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center shrink-0 bg-[#00A1E0]">
      <Cloud size={22} strokeWidth={2} className="text-white" />
    </div>
  );
}

export function GoogleTile() {
  return (
    <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center shrink-0 bg-surface border border-border-subtle">
      <GoogleMark size={22} />
    </div>
  );
}

export function MailchimpTile() {
  return (
    <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center shrink-0 bg-[#FFE01B]">
      <Mail size={22} strokeWidth={2} className="text-[#111]" />
    </div>
  );
}

export function DocUploadTile() {
  return (
    <div className="w-[42px] h-[42px] rounded-lg flex items-center justify-center shrink-0 bg-surface-muted border border-border-subtle">
      <FileText size={22} strokeWidth={1.7} className="text-secondary" />
    </div>
  );
}
