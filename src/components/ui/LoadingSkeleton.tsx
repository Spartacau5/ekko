import React from 'react';

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'sm' | 'md' | 'full';
}

export function LoadingSkeleton({ width = '100%', height = 16, className = '', rounded = 'sm' }: LoadingSkeletonProps) {
  const radius = rounded === 'full' ? 'rounded-full' : rounded === 'md' ? 'rounded-md' : 'rounded-sm';
  return (
    <div
      className={`bg-surface-muted animate-pulse ${radius} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface border border-border-subtle rounded-md p-5 ${className}`}>
      <LoadingSkeleton height={14} width="40%" className="mb-3" />
      <LoadingSkeleton height={28} width="60%" className="mb-4" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-3 ${className}`}>
      <LoadingSkeleton width={32} height={32} rounded="full" />
      <div className="flex-1">
        <LoadingSkeleton height={14} width="40%" className="mb-1.5" />
        <LoadingSkeleton height={12} width="60%" />
      </div>
      <LoadingSkeleton width={60} height={20} />
    </div>
  );
}
