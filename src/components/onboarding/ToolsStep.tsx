import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { SalesforceTile, GoogleTile, MailchimpTile, DocUploadTile } from './IntegrationMarks';
import { motionDurations, motionEasings } from '../../lib/motion';

// Step 4: tool integrations. Each card shows a product mark, a connect/manage
// affordance, title, and short description. Salesforce/Google/Mailchimp flip
// between "+" (unconnected) and "• Connected + trash" (connected). Document
// Upload has a unique "+" → doc modal, becoming "Manage" once files exist.

export type ToolId = 'salesforce' | 'google' | 'mailchimp' | 'docs';

export interface ToolsState {
  connected: Record<ToolId, boolean>;
  docsManaged: boolean; // set once the doc-upload modal has been opened + done
}

export const emptyToolsState: ToolsState = {
  connected: { salesforce: false, google: false, mailchimp: false, docs: false },
  docsManaged: false,
};

interface ToolsStepProps {
  state: ToolsState;
  onToggle: (tool: ToolId) => void;
  onOpenDocUpload: () => void;
  onOpenRequestConnection: () => void;
}

interface ToolMeta {
  id: ToolId;
  name: string;
  desc: string;
  Tile: React.FC;
}

const TOOLS: ToolMeta[] = [
  { id: 'salesforce', name: 'Salesforce CRM',   desc: 'Sync donor records and giving history', Tile: SalesforceTile },
  { id: 'google',     name: 'Google Account',    desc: 'Connect email and calendar data',       Tile: GoogleTile },
  { id: 'mailchimp',  name: 'Mailchimp',         desc: 'Import email engagement metrics',       Tile: MailchimpTile },
  { id: 'docs',       name: 'Document Upload',   desc: 'Upload annual reports or grant docs',   Tile: DocUploadTile },
];

export function ToolsStep({ state, onToggle, onOpenDocUpload, onOpenRequestConnection }: ToolsStepProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((tool) => {
          const connected = state.connected[tool.id];
          return (
            <div
              key={tool.id}
              className="flex flex-col gap-6 p-4 border border-border-subtle rounded-lg bg-surface transition-[border-color,background-color] duration-150"
            >
              <div className="flex items-start justify-between">
                <tool.Tile />
                {tool.id === 'docs' ? (
                  state.docsManaged ? (
                    <ChipButton onClick={onOpenDocUpload}>Manage</ChipButton>
                  ) : (
                    <AddButton onClick={onOpenDocUpload} />
                  )
                ) : connected ? (
                  <div className="flex gap-1 items-center">
                    <ConnectedChip />
                    <IconButton onClick={() => onToggle(tool.id)} aria-label={`Disconnect ${tool.name}`}>
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                ) : (
                  <AddButton onClick={() => onToggle(tool.id)} />
                )}
              </div>
              <div className="flex flex-col gap-2 h-[42px]">
                <p className="text-[16px] leading-[20px] font-medium text-primary whitespace-nowrap">{tool.name}</p>
                <p className="text-[12px] leading-[14px] text-muted">{tool.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 items-center text-[14px] leading-[18px]">
        <span className="text-muted">Don't see your tools?</span>
        <button
          onClick={onOpenRequestConnection}
          className="text-secondary font-medium hover:text-primary transition-colors duration-150 cursor-pointer underline-offset-2 hover:underline"
        >
          Submit a request
        </button>
      </div>
    </div>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Connect"
      className="w-[30px] h-[30px] rounded flex items-center justify-center border border-border-subtle hover:border-border-default hover:bg-surface-muted transition-[background-color,border-color] duration-150 cursor-pointer text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
    >
      <Plus size={16} strokeWidth={2} />
    </button>
  );
}

function IconButton({ children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="w-[30px] h-[30px] rounded flex items-center justify-center border border-border-subtle hover:border-danger hover:text-danger transition-[background-color,border-color,color] duration-150 cursor-pointer text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
      {...rest}
    >
      {children}
    </button>
  );
}

function ChipButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1.5 rounded border border-border-subtle text-[12px] leading-[14px] font-medium text-primary hover:bg-surface-muted hover:border-border-default transition-[background-color,border-color] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
    >
      {children}
    </button>
  );
}

function ConnectedChip() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
      className="flex gap-1.5 items-center px-2 py-1.5 rounded border border-border-subtle bg-surface"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
      <span className="text-[12px] leading-[14px] font-medium text-primary">Connected</span>
    </motion.div>
  );
}
