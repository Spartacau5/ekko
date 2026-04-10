import React from 'react';
import { TopNav } from './TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-page">
      <TopNav />
      <main className="max-w-[1280px] mx-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
