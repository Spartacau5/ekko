import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader, SubNav } from '../../components/ui';
import { Users, UserCircle } from 'lucide-react';
import { donorGroups } from '../../data/groups';
import { useMaturity } from '../../lib/MaturityContext';
import { donorsForMaturity } from '../../data/maturity';
import { motionDurations, motionEasings } from '../../lib/motion';

export function PeopleLayout() {
  const location = useLocation();
  const { activeMaturity, isDay0 } = useMaturity();
  const donors = donorsForMaturity(activeMaturity);
  const groupsCount = isDay0 ? 0 : donorGroups.length;

  // Hide the sub-nav and header on detail pages — they have their own headers
  const isDetailPage =
    /^\/people\/(donors|groups)\/[^/]+$/.test(location.pathname);

  if (isDetailPage) {
    return <Outlet />;
  }

  return (
    <>
      <PageHeader
        title="People"
        subtitle={isDay0 ? 'Sample donors loaded — connect Salesforce to import your real records' : 'Donors and groups in one place'}
        serif
      />
      <SubNav
        items={[
          { label: 'Donors', path: '/people/donors', count: donors.length, icon: <UserCircle size={14} /> },
          { label: 'Groups', path: '/people/groups', count: groupsCount, icon: <Users size={14} /> },
        ]}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: motionDurations.tab, ease: motionEasings.out }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
