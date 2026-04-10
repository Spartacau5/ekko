import React from 'react';
import { Check, Minus } from 'lucide-react';
import {
  Role,
  Capability,
  capabilityLabels,
  rolePermissions,
  roleMeta,
} from '../../data/team';

interface PermissionMatrixProps {
  highlightedRole?: Role;
  editable?: boolean;
}

const ROLE_ORDER: Role[] = ['executive', 'fundraising', 'policy', 'program', 'operations'];

// Capabilities grouped by intent. View capabilities everyone gets; Edit
// capabilities depend on the surface; Admin capabilities are scoped to
// owners and operations.
const CAPABILITY_GROUPS: { label: string; capabilities: Capability[] }[] = [
  {
    label: 'View',
    capabilities: ['viewAll'],
  },
  {
    label: 'Edit',
    capabilities: ['editDonors', 'assignActions', 'manageWatchlist', 'exportData'],
  },
  {
    label: 'Admin',
    capabilities: ['manageTeam', 'manageIntegrations', 'managePeerSharing', 'manageAi', 'manageBilling'],
  },
];

export function PermissionMatrix({ highlightedRole, editable = false }: PermissionMatrixProps) {
  const gridCols = `1.6fr repeat(${ROLE_ORDER.length}, 1fr)`;

  return (
    <div className="border border-border-subtle rounded-sm overflow-hidden">
      {/* Header */}
      <div
        className="grid items-center bg-surface-muted/50 border-b border-border-subtle"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div className="px-4 py-3 text-[12px] font-medium text-muted uppercase tracking-wider">
          Capability
        </div>
        {ROLE_ORDER.map((r) => (
          <div
            key={r}
            className={`px-2 py-3 text-center text-[12px] font-semibold uppercase tracking-wider
              ${highlightedRole === r ? 'text-primary bg-accent-soft/60' : 'text-secondary'}`}
          >
            {roleMeta[r].short}
          </div>
        ))}
      </div>

      {CAPABILITY_GROUPS.map((group, gi) => (
        <React.Fragment key={group.label}>
          <div
            className={`px-4 py-2 bg-surface-muted/30 text-[11px] font-medium text-muted uppercase tracking-wider
              ${gi > 0 ? 'border-t border-border-subtle' : ''}`}
          >
            {group.label}
          </div>
          {group.capabilities.map((cap, ci) => (
            <div
              key={cap}
              className={`grid items-center
                ${ci < group.capabilities.length - 1 ? 'border-b border-border-subtle' : ''}`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-4 py-2.5 text-[13px] text-primary">{capabilityLabels[cap]}</div>
              {ROLE_ORDER.map((r) => {
                const allowed = rolePermissions[r][cap];
                return (
                  <div
                    key={r}
                    className={`px-2 py-2.5 flex items-center justify-center
                      ${highlightedRole === r ? 'bg-accent-soft/30' : ''}`}
                  >
                    {allowed ? (
                      <span className="w-5 h-5 rounded-full bg-success-soft border border-success/30 flex items-center justify-center">
                        <Check size={12} className="text-success" strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-surface-muted border border-border-subtle flex items-center justify-center">
                        <Minus size={11} className="text-muted" strokeWidth={2.5} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </React.Fragment>
      ))}

      {editable && (
        <div className="px-4 py-3 bg-surface-muted/30 border-t border-border-subtle text-[12px] text-muted">
          Permissions are read-only in this prototype. In production, owners and admins can toggle individual cells.
        </div>
      )}
    </div>
  );
}
