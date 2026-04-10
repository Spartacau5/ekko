import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { accounts, Account, AccountType } from '../../data/accounts';
import { Button, Chip, SearchBar, SegmentedControl } from '../../components/ui';
import { Building, ArrowUpRight, Plus, Calendar } from 'lucide-react';

const typeFilters: { value: 'all' | AccountType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Foundation', label: 'Foundations' },
  { value: 'Corporation', label: 'Corporations' },
  { value: 'Household', label: 'Households' },
  { value: 'Government', label: 'Government' },
  { value: 'Religious', label: 'Religious' },
];

export function AccountsListPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return accounts.filter(a => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, typeFilter]);

  // Stats
  const totalLifetime = filtered.reduce((sum, a) => sum + a.totalLifetime, 0);
  const activeCount = filtered.filter(a => a.stage === 'Active partner').length;
  const renewalsThisQuarter = filtered.filter(a => {
    if (!a.nextRenewal) return false;
    const r = new Date(a.nextRenewal);
    const now = new Date('2026-04-10');
    const diff = (r.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 90;
  }).length;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total accounts" value={filtered.length.toString()} />
        <StatCard label="Active partners" value={activeCount.toString()} sublabel="currently engaged" />
        <StatCard label="Lifetime giving" value={`$${(totalLifetime / 1000).toFixed(0)}K`} sublabel="all-time total" />
        <StatCard label="Upcoming renewals" value={renewalsThisQuarter.toString()} sublabel="next 90 days" />
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <SegmentedControl options={typeFilters} value={typeFilter} onChange={setTypeFilter} />
        <Button variant="primary"><Plus size={14} className="mr-1.5" />New account</Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search accounts by name..." />
        </div>
        <span className="text-[13px] text-muted">{filtered.length} {filtered.length === 1 ? 'account' : 'accounts'}</span>
      </div>

      <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border-subtle bg-surface-muted/40">
          <div className="col-span-4 text-[12px] font-medium text-muted uppercase tracking-wider">Account</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Type</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Stage</div>
          <div className="col-span-2 text-[12px] font-medium text-muted uppercase tracking-wider">Lifetime</div>
          <div className="col-span-1 text-[12px] font-medium text-muted uppercase tracking-wider">Owner</div>
          <div className="col-span-1"></div>
        </div>
        {filtered.map(a => <AccountRow key={a.id} account={a} />)}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Building size={28} className="mx-auto text-muted mb-2" />
            <p className="text-sm text-muted">No accounts match your filters</p>
          </div>
        )}
      </div>
    </>
  );
}

function AccountRow({ account }: { account: Account }) {
  const stageVariant: any = {
    'Active partner': 'success',
    'Cultivation': 'warning',
    'Stewardship': 'info',
    'Lapsed': 'danger',
    'Prospect': 'default',
  };
  const typeVariant: any = {
    'Foundation': 'info',
    'Corporation': 'warning',
    'Household': 'default',
    'Government': 'info',
    'Religious': 'default',
  };

  return (
    <Link
      to={`/people/accounts/${account.id}`}
      className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border-subtle last:border-0 hover:bg-surface-muted/30 items-center no-underline"
    >
      <div className="col-span-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
          <Building size={15} className="text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{account.name}</p>
          <p className="text-[12px] text-muted truncate">{account.location}{account.industry ? ` · ${account.industry}` : ''}</p>
        </div>
      </div>
      <div className="col-span-2"><Chip label={account.type} variant={typeVariant[account.type]} /></div>
      <div className="col-span-2"><Chip label={account.stage} variant={stageVariant[account.stage]} /></div>
      <div className="col-span-2">
        <p className="text-sm text-primary font-medium">${account.totalLifetime.toLocaleString()}</p>
        {account.nextRenewal && (
          <p className="text-[12px] text-muted flex items-center gap-1">
            <Calendar size={10} /> Renews {new Date(account.nextRenewal).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
      <div className="col-span-1 text-[13px] text-secondary truncate">{account.accountOwner.split(' ')[0]}</div>
      <div className="col-span-1 flex justify-end"><ArrowUpRight size={14} className="text-muted" /></div>
    </Link>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="bg-surface border border-border-subtle rounded-md p-5">
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-[32px] leading-[36px] font-semibold text-primary">{value}</p>
      {sublabel && <p className="text-[13px] text-muted mt-1">{sublabel}</p>}
    </div>
  );
}
