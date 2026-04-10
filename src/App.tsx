import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PeoplePage } from './pages/PeoplePage';
import { DonorDetailPage } from './pages/DonorDetailPage';
import { PolicyPage } from './pages/PolicyPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { PeersPage } from './pages/PeersPage';
import { SettingsPage } from './pages/SettingsPage';

function LayoutWrapper() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:id" element={<DonorDetailPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/policy/:id" element={<PolicyDetailPage />} />
          <Route path="/peers" element={<PeersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
