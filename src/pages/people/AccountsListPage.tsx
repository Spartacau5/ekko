import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { accounts, Account, AccountType } from '../../data/accounts';
import { Button, Chip, SearchBar, SegmentedControl } from '../../components/ui';
import { Building, ArrowUpRight, Plus, Calendar, AlertCircle } from 'lucide-react';

const typeFilters: { value: 'all' | AccountType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Foundation', label: 'Foundations' },
  { value: 'Corporation', label: 'Corporations' },
  { value: 'Household', label: 'Households' },
  { value: 'Government', label: 'Government' },
  { value: 'Religious', label: 'Religious' },
];

function renewalUrgency(nextRenewal: string | undefined): { label: string; variant: 'danger' | 'warning' | 'default' } | null {
  if (!nextRenewal) return null;
  const r = new Date(nextRenewal);
  const now = new Date('2026-04-10');
  const days = Math.round((r.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days <= 60) return { label: `In ${days}d`, variant: 'danger' };
  if (days <= 120) return { label: `In ${days}d`, variant: 'warning' };
  return { label: `In ${days}d`, variant: 'default' };
}

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
        <StatCard label="Total accounts" value={filtered.length.toString()} sublabel={typeFilter !== 'all' ? `filtered by ${typeFilter.toLowerCase()}` : 'across all types'} />
        <StatCard label="Active partners" value={activeCount.toString()} sublabel="currently engaged" />
        <StatCard label="Lifetime giving" value={`$${(totalLifetime / 1000).toFixed(0)}K`} sublabel="all-time total" />
        <StatCard
          label="Upcoming renewals"
          value={renewalsThisQuarter.toString()}
          sublabel="next 90 days"
          accent={renewalsThisQuarter > 0}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <SegmentedControl options={typeFilters} value={typeFilter} onChange={setTypeFilter} />
        <Button variant="primary"><Plus size={14} className="mr-1.5" />New account</Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search accounts by name..." />
        </div>
        <span className="text-[13px] text-muted">{filtered.length} {filtered.length === 1 ? 'account' : 'accounts'}</span>
      </div>

      <div className="bg-surface border border-border-subtle rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-border-subtle bg-surface-muted/40">
          <div className="col-span-4 text-[11px] font-medium text-muted uppercase tracking-wider">Account</div>
          <div className="col-span-2 text-[11px] font-medium text-muted uppercase tracking-wider">Stage</div>
          <div className="col-span-2 text-[11px] font-medium text-muted uppercase tracking-wider">Lifetime</div>
          <div className="col-span-2 text-[11px] font-medium text-muted uppercase tracking-wider">Next renewal</div>
          <div className="col-span-1 text-[11px] font-medium text-muted uppercase tracking-wider">Owner</div>
          <div className="col-span-1"></div>
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <Building size={28} className="text-muted mb-2" />
            <p className="text-sm font-medium text-primary mb-1">No accounts match your filters</p>
            <p className="text-[13px] text-muted">Try adjusting the type filter or search query.</p>
          </div>
        ) : (
          filtered.map(a => <AccountRow key={a.id} account={a} />)
        )}
      </div>
    </>
  );
}

function AccountRow({ account }: { account: Account }) {
  const stageVariant: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
    'Active partner': 'success',
    'Cultivation': 'warning',
    'Stewardship': 'info',
    'Lapsed': 'danger',
    'Prospect': 'default',
  };
  const typeIconColor: Record<string, string> = {
    'Foundation': 'text-info',
    'Corporation': 'text-warning',
    'Household': 'text-secondary',
    'Government': 'text-info',
    'Religious': 'text-secondary',
  };
  const renewal = renewalUrgency(account.nextRenewal);

  return (
    <Link
      to={`/people/accounts/${account.id}`}
      className="grid grid-cols-12 gap-4 px-5 py-3.5 border-b border-border-subtle last:border-0 hover:bg-surface-muted/30 items-center no-underline"
    >
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
          <Building size={15} className={typeIconColor[account.type]} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{account.name}</p>
          <p className="text-[12px] text-muted truncate">
            <span className="text-secondary">{account.type}</span>
            {' · '}
            {account.location}
            {account.industry ? ` · ${account.industry}` : ''}
          </p>
        </div>
      </div>
      <div className="col-span-2">
        <Chip label={account.stage} variant={stageVariant[account.stage]} />
      </div>
      <div className="col-span-2">
        <p className="text-sm text-primary font-medium">${account.totalLifetime.toLocaleString()}</p>
        {account.lastGiftDate && (
          <p className="text-[12px] text-muted">
            Last {new Date(account.lastGiftDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
      <div className="col-span-2">
        {account.nextRenewal ? (
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-muted flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[13px] text-primary leading-tight">
                {new Date(account.nextRenewal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              {renewal && (
                <span className={`text-[11px] font-medium ${
                  renewal.variant === 'danger' ? 'text-danger' :
                  renewal.variant === 'warning' ? 'text-warning' :
                  'text-muted'
                }`}>
                  {renewal.variant === 'danger' && <AlertCircle size={9} className="inline mr-0.5 -mt-0.5" />}
                  {renewal.label}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-muted">—</span>
        )}
      </div>
      <div className="col-span-1 text-[13px] text-secondary truncate">{account.accountOwner.split(' ')[0]}</div>
      <div className="col-span-1 flex justify-end"><ArrowUpRight size={14} className="text-muted" /></div>
    </Link>
  );
}

function StatCard({ label, value, sublabel, accent }: { label: string; value: string; sublabel?: string; accent?: boolean }) {
  return (
    <div className={`bg-surface border rounded-md p-5 ${accent ? 'border-border-default' : 'border-border-subtle'}`}>
      <p className="text-[12px] font-medium text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-[32px] leading-[36px] font-semibold text-primary">{value}</p>
      {sublabel && <p className="text-[13px] text-muted mt-1 line-clamp-1">{sublabel}</p>}
    </div>
  );
}
