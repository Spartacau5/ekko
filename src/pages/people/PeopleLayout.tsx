import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageHeader, SubNav } from '../../components/ui';
import { Users, UserCircle, Building } from 'lucide-react';
import { donors } from '../../data/donors';
import { donorGroups } from '../../data/groups';
import { accounts } from '../../data/accounts';

export function PeopleLayout() {
  const location = useLocation();

  // Hide the sub-nav and header on detail pages — they have their own headers
  const isDetailPage =
    /^\/people\/(donors|groups|accounts)\/[^/]+$/.test(location.pathname);

  if (isDetailPage) {
    return <Outlet />;
  }

  return (
    <>
      <PageHeader
        title="People"
        subtitle="Donors, groups, and accounts in one place"
        serif
      />
      <SubNav
        items={[
          { label: 'Donors', path: '/people/donors', count: donors.length, icon: <UserCircle size={14} /> },
          { label: 'Groups', path: '/people/groups', count: donorGroups.length, icon: <Users size={14} /> },
          { label: 'Accounts', path: '/people/accounts', count: accounts.length, icon: <Building size={14} /> },
        ]}
      />
      <Outlet />
    </>
  );
}
