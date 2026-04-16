import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Upload, FileText, Check } from 'lucide-react';
import { motionDurations, motionEasings } from '../../lib/motion';

// Document upload modal. Drag-drop zone up top, scrollable list below. Files
// start "uploading" with a fake progress bar, then flip to "completed" after a
// short delay — good enough to demo the state transitions without a real
// backend. One seeded "failed" item so the failure state is visible.

type UploadStatus = 'uploading' | 'completed' | 'failed';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: UploadStatus;
  progress: number; // 0-100
}

interface DocUploadModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

export function DocUploadModal({ open, onClose, onDone }: DocUploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  // Tick the seeded "uploading" file forward so progress visibly moves.
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status !== 'uploading') return f;
          const next = Math.min(100, f.progress + 8);
          return next >= 100 ? { ...f, progress: 100, status: 'completed' } : { ...f, progress: next };
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, [open]);

  const addFile = (name: string, sizeLabel: string) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFiles((prev) => [{ id, name, size: sizeLabel, status: 'uploading', progress: 10 }, ...prev]);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((f) => {
      const kb = f.size / 1024;
      const label = kb > 1024 ? `${Math.round(kb / 1024)}MB` : `${Math.round(kb)}KB`;
      addFile(f.name, label);
    });
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files || []).forEach((f) => {
      const kb = f.size / 1024;
      const label = kb > 1024 ? `${Math.round(kb / 1024)}MB` : `${Math.round(kb)}KB`;
      addFile(f.name, label);
    });
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
        >
          <div className="absolute inset-0 bg-overlay" />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: motionDurations.modal, ease: motionEasings.out }}
            className="relative bg-surface rounded-[32px] w-full max-w-[560px] p-6 flex flex-col gap-10 shadow-[0_24px_64px_rgba(17,17,17,0.18)]"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pl-5">
                <h2 className="flex-1 text-center font-serif text-[20px] leading-[24px] font-semibold text-primary">
                  Document Upload
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-muted hover:text-primary transition-colors duration-150 p-1 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col gap-4 items-center justify-center h-[140px] p-6 rounded-lg border border-dashed cursor-pointer text-center
                  transition-[background-color,border-color] duration-150
                  ${dragOver ? 'border-accent bg-accent-soft/30' : 'border-border-subtle hover:border-border-default'}`}
              >
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileInput} accept=".pdf,.zip,.docx" />
                <Upload size={24} className="text-primary" />
                <div className="flex flex-col gap-2 items-center w-full">
                  <p className="text-[14px] leading-[18px] text-primary">Drag and drop files here, or click to browse</p>
                  <p className="text-[10px] leading-[12px] text-muted">Upload PDF, ZIP, or DOCX up to 10MB each</p>
                </div>
              </div>

              <div className={`${files.length === 0 ? 'hidden' : 'max-h-[280px] overflow-y-auto flex flex-col gap-2 pr-1'}`}>
                <AnimatePresence initial={false}>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: motionDurations.chip, ease: motionEasings.out }}
                      className="group flex flex-col gap-2 p-4 rounded-lg border border-border-subtle bg-surface hover:border-border-default transition-colors duration-150"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-[42px] h-[42px] rounded-lg bg-surface-muted text-muted flex items-center justify-center shrink-0">
                          <FileText size={18} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <p className="text-[16px] leading-[20px] font-medium text-primary truncate">{file.name}</p>
                          <p className="text-[12px] leading-[14px] text-muted flex gap-2">
                            <span>{file.size}</span>
                            {file.status === 'completed' && <span className="text-success">Completed</span>}
                            {file.status === 'failed' && <span className="text-danger">Failed</span>}
                          </p>
                        </div>
                        <div className="relative w-5 h-5 shrink-0">
                          {file.status === 'completed' && (
                            <span className="absolute inset-0 rounded-full bg-success-soft text-success flex items-center justify-center transition-opacity duration-150 group-hover:opacity-0">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                          <button
                            onClick={() => remove(file.id)}
                            aria-label={file.status === 'uploading' ? 'Cancel upload' : 'Remove file'}
                            className={`absolute inset-0 flex items-center justify-center rounded-full text-muted hover:text-danger cursor-pointer transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default
                              ${file.status === 'uploading' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      {file.status === 'uploading' && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-[3px] bg-surface-muted overflow-hidden">
                            <motion.div
                              className="h-full bg-accent rounded-[3px]"
                              initial={{ width: 0 }}
                              animate={{ width: `${file.progress}%` }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                          </div>
                          <p className="text-[12px] leading-[14px] font-medium text-muted">{file.progress}%</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-6">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full bg-surface text-primary border border-border-default hover:bg-surface-muted cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              >
                Cancel
              </button>
              <button
                onClick={onDone}
                className="flex-1 flex items-center justify-center px-4 py-2 text-[16px] leading-[20px] font-medium rounded-full bg-accent text-primary border border-border-default hover:bg-accent-hover cursor-pointer shadow-[inset_0_-1px_0_rgba(17,17,17,0.08)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
