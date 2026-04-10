import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { peerOrgs } from '../data/peers';
import { peerCampaigns } from '../data/campaigns';
import { Button, Chip, KPI, BarComparison } from '../components/ui';
import {
  ArrowLeft, Building, MapPin, Users, ExternalLink, Lock, Star,
} from 'lucide-react';

export function PeerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const peer = peerOrgs.find(p => p.id === id);
  const peerCamps = peerCampaigns.filter(c => c.orgId === id);

  if (!peer) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary">Peer organization not found.</p>
        <Link to="/peers" className="text-primary underline mt-2 inline-block">Back to peers</Link>
      </div>
    );
  }

  // Mock benchmark data — yours vs this peer
  const benchmarks = [
    { label: 'Email open rate', yours: 31, peer: parseFloat(peer.benchmarkStat.value), top: 36, suffix: '%' },
    { label: 'Donor retention', yours: 64, peer: 62, top: 72, suffix: '%' },
    { label: 'Conversion rate', yours: 3.8, peer: 4.2, top: 5.1, suffix: '%' },
  ];

  const optInVariant: any = {
    'Opted in': 'success',
    'Pending': 'warning',
    'Not opted in': 'default',
  };

  return (
    <>
      <Link to="/peers" className="inline-flex items-center gap-1 text-[13px] text-secondary hover:text-primary mb-4">
        <ArrowLeft size={14} /> Back to peers
      </Link>

      {/* Header */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-sm bg-surface-muted border border-border-subtle flex items-center justify-center flex-shrink-0">
              <Building size={24} className="text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Chip label={peer.optInStatus} variant={optInVariant[peer.optInStatus]} />
                <Chip label={peer.orgSize.split(' (')[0]} variant="default" />
              </div>
              <h1 className="text-[28px] leading-[36px] font-semibold font-serif text-primary">{peer.name}</h1>
              <p className="text-sm text-secondary mt-1">{peer.missionArea}</p>
              <div className="flex items-center gap-4 mt-2 text-[13px] text-muted">
                <span className="flex items-center gap-1"><MapPin size={12} />{peer.geography}</span>
                <span className="flex items-center gap-1"><Users size={12} />{peer.orgSize}</span>
                <span className="flex items-center gap-1">$ {peer.revenueBand}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary"><Star size={14} className="mr-2" />Follow</Button>
            <Button variant="secondary"><ExternalLink size={14} className="mr-2" />Public profile</Button>
          </div>
        </div>
      </div>

      {/* Two col */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          {/* Comparison KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <KPI
              label="Their best metric"
              value={peer.benchmarkStat.value}
              delta={4.2}
              deltaLabel={peer.benchmarkStat.label.toLowerCase()}
              trend={[28, 29, 30, 31, 32, 33, 34, 33, 34, 34]}
            />
            <KPI
              label="Recent campaigns"
              value={peerCamps.length.toString()}
              delta={0}
              deltaLabel="last 6 months"
              trend={[1, 1, 2, 2, 2, 3, 3, peerCamps.length, peerCamps.length, peerCamps.length]}
            />
            <KPI
              label="Mission overlap"
              value="High"
              deltaLabel="similar focus areas"
            />
          </div>

          {/* Side-by-side comparison */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-[15px] font-semibold text-primary">You vs. {peer.name.split(' ')[0]}</h2>
              <p className="text-[13px] text-muted mt-0.5">Anonymized benchmark comparison</p>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {benchmarks.map(b => (
                <BarComparison
                  key={b.label}
                  label={b.label}
                  yourValue={b.yours}
                  peerValue={b.peer}
                  topValue={b.top}
                  suffix={b.suffix}
                />
              ))}
            </div>
          </div>

          {/* Their recent campaigns */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-primary">Recent campaigns</h2>
                <p className="text-[13px] text-muted mt-0.5">What they\u2019ve been running</p>
              </div>
              <Link to="/peers/campaigns" className="text-[13px] text-secondary hover:text-primary underline">
                Full library
              </Link>
            </div>
            <div className="divide-y divide-border-subtle">
              {peerCamps.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted">No campaign data shared.</div>
              ) : (
                peerCamps.map(c => (
                  <div key={c.id} className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary mb-1">{c.title}</p>
                        <p className="text-[13px] text-secondary">{c.dateRange} · {c.duration}</p>
                      </div>
                      <Chip
                        label={`${c.performanceVsAvg > 100 ? '+' : ''}${(c.performanceVsAvg - 100).toFixed(0)}% vs avg`}
                        variant={c.performanceVsAvg >= 100 ? 'success' : 'default'}
                      />
                    </div>
                    <p className="text-[13px] text-secondary leading-relaxed mb-2 italic">"{c.topMessage}"</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.channels.map(ch => <Chip key={ch} label={ch} variant="default" />)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Org details */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Organization details</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <DetailRow label="Mission area" value={peer.missionArea} />
              <DetailRow label="Geography" value={peer.geography} />
              <DetailRow label="Org size" value={peer.orgSize} />
              <DetailRow label="Revenue band" value={peer.revenueBand} />
            </div>
          </div>

          {/* Data sharing */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
              <Lock size={14} className="text-secondary" />
              <h3 className="text-[14px] font-semibold text-primary">Data sharing</h3>
            </div>
            <div className="p-5">
              <Chip label={peer.optInStatus} variant={optInVariant[peer.optInStatus]} />
              <p className="text-[13px] text-secondary mt-3 leading-relaxed">
                {peer.optInStatus === 'Opted in'
                  ? 'This organization shares anonymized benchmark and campaign data with peer orgs.'
                  : peer.optInStatus === 'Pending'
                  ? 'This organization has been invited to share data but has not yet opted in.'
                  : 'This organization has not opted in to data sharing. Comparisons use public data only.'}
              </p>
            </div>
          </div>

          {/* Mission alignment */}
          <div className="bg-surface border border-border-subtle rounded-md">
            <div className="px-5 py-3 border-b border-border-subtle">
              <h3 className="text-[14px] font-semibold text-primary">Why they\u2019re a peer</h3>
            </div>
            <div className="p-5 flex flex-col gap-2 text-[13px]">
              <div className="flex items-start gap-2">
                <span className="text-success">\u2713</span>
                <span className="text-primary">Similar mission area</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success">\u2713</span>
                <span className="text-primary">Comparable size and revenue</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success">\u2713</span>
                <span className="text-primary">Same metro region</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success">\u2713</span>
                <span className="text-primary">Active in last 90 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] font-medium text-muted uppercase tracking-wider">{label}</span>
      <span className="text-[13px] text-primary">{value}</span>
    </div>
  );
}
